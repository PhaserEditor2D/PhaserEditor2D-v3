/// <reference path="../controls/Controls.ts"/>

namespace colibri.ui.ide {

    export class Workbench {

        private static _workbench: Workbench;

        static getWorkbench() {

            if (!Workbench._workbench) {

                Workbench._workbench = new Workbench();
            }

            return this._workbench;
        }


        public eventPartDeactivated = new controls.ListenerList<Part>();
        public eventPartActivated = new controls.ListenerList<Part>();
        public eventEditorDeactivated = new controls.ListenerList<EditorPart>();
        public eventEditorActivated = new controls.ListenerList<EditorPart>();
        public eventBeforeOpenProject = new controls.ListenerList();
        public eventProjectOpened = new controls.ListenerList();
        public eventThemeChanged = new controls.ListenerList<ui.controls.ITheme>();
        public eventWindowFocused = new controls.ListenerList();

        private _fileStringCache: core.io.FileStringCache;
        private _fileBinaryCache: core.io.FileBinaryCache;
        private _fileImageCache: ImageFileCache;
        private _fileImageSizeCache: ImageSizeFileCache;
        private _activeWindow: ide.WorkbenchWindow;
        private _contentType_icon_Map: Map<string, controls.IconDescriptor>;
        private _fileStorage: core.io.IFileStorage;
        private _contentTypeRegistry: core.ContentTypeRegistry;
        private _activePart: Part;
        private _activeEditor: EditorPart;
        private _activeElement: HTMLElement;
        private _editorRegistry: EditorRegistry;
        private _commandManager: commands.CommandManager;
        private _windows: WorkbenchWindow[];
        private _globalPreferences: core.preferences.Preferences;
        private _projectPreferences: core.preferences.Preferences;
        private _editorSessionStateRegistry: Map<string, any>;

        private constructor() {

            this._editorRegistry = new EditorRegistry();

            this._windows = [];

            this._activePart = null;
            this._activeEditor = null;
            this._activeElement = null;

            this._fileImageCache = new ImageFileCache();

            this._fileImageSizeCache = new ImageSizeFileCache();

            this._globalPreferences = new core.preferences.Preferences("__global__");

            this._projectPreferences = null;

            this._editorSessionStateRegistry = new Map();
        }

        getFileStringCache() {

            if (!CAPABILITY_FILE_STORAGE) {

                return undefined;
            }

            if (!this._fileStringCache) {

                this._fileStringCache = new core.io.FileStringCache(this.getFileStorage());
            }

            return this._fileStringCache;
        }

        getFileBinaryCache() {

            if (!CAPABILITY_FILE_STORAGE) {

                return undefined;
            }

            if (!this._fileBinaryCache) {

                this._fileBinaryCache = new core.io.FileBinaryCache(this.getFileStorage());
            }

            return this._fileBinaryCache;
        }

        getFileStorage() {

            if (!CAPABILITY_FILE_STORAGE) {

                return undefined;
            }

            if (!this._fileStorage) {

                const extensions = colibri.Platform.getExtensions(core.io.FileStorageExtension.POINT_ID);

                const ext = extensions[0] as core.io.FileStorageExtension;

                if (!ext) {

                    throw new Extension("No file storage extension registered");
                }

                console.log("Workbench: setting up file storage: " + ext.getStorageId());

                this._fileStorage = ext.createStorage();
            }

            return this._fileStorage;
        }

        getEditorSessionStateRegistry() {

            return this._editorSessionStateRegistry;
        }

        getGlobalPreferences() {

            return this._globalPreferences;
        }

        getProjectPreferences() {

            return this._projectPreferences;
        }

        showNotification(text: string, clickCallback?: () => void) {

            const element = document.createElement("div");
            element.classList.add("Notification");
            element.innerHTML = text;

            document.body.appendChild(element);

            element.classList.add("FadeInEffect");

            element.addEventListener("click", () => element.remove());

            const duration = 4000;

            setTimeout(() => {

                element.classList.add("FadeOutEffect");

                setTimeout(() => element.remove(), duration);

            }, duration);

            if (clickCallback) {

                element.addEventListener("click", clickCallback);
            }
        }

        async launch() {

            console.log("Workbench: starting.");

            controls.Controls.init();

            controls.Controls.preloadTheme();

            {
                const plugins = Platform.getPlugins();

                const registry = Platform.getExtensionRegistry();

                for (const plugin of plugins) {

                    // register default extensions
                    registry.addExtension(new IconAtlasLoaderExtension(plugin));

                    registry.addExtension(new PluginResourceLoaderExtension(
                        () => plugin.preloadResources()));

                    plugin.registerExtensions(registry);
                }

                for (const plugin of plugins) {

                    console.log(`\tPlugin: starting %c${plugin.getId()}`, "color:blue");

                    await plugin.starting();
                }
            }

            controls.Controls.restoreTheme();

            console.log("Workbench: fetching UI icons.");

            await this.preloadPluginResources();

            console.log("Workbench: hide splash");

            this.hideSplash();

            console.log("Workbench: registering content types.");

            this.registerContentTypes();

            this.registerContentTypeIcons();

            console.log("Workbench: initializing UI.");

            this.initCommands();

            this.registerEditors();

            this.registerWindows();

            this.initEvents();

            ui.controls.Controls.addTabStop();

            console.log("%cWorkbench: started.", "color:green");

            for (const plugin of Platform.getPlugins()) {

                await plugin.started();
            }
        }

        private hideSplash() {

            const splashElement = document.getElementById("splash-container");

            if (splashElement) {

                splashElement.remove();
            }
        }

        private resetCache() {

            this.getFileStringCache().reset();
            this.getFileBinaryCache().reset();

            this._fileImageCache.reset();
            this._fileImageSizeCache.reset();
            this._contentTypeRegistry.resetCache();

            this._editorSessionStateRegistry.clear();
        }

        async openProject(monitor: controls.IProgressMonitor) {

            this.eventBeforeOpenProject.fire("");

            this.resetCache();

            console.log(`Workbench: opening project.`);

            const fileStorage = this.getFileStorage();

            await fileStorage.openProject();

            const projectName = fileStorage.getRoot().getName();

            console.log(`Workbench: project ${projectName} loaded.`);

            this._projectPreferences = new core.preferences.Preferences("__project__" + projectName);

            console.log("Workbench: fetching required project resources.");

            try {

                await this.preloadProjectResources(monitor);

                this.eventProjectOpened.fire(projectName);

            } catch (e) {

                console.log("Error loading project resources");
                alert("Error: loading project resources. " + e.message);
                console.log(e.message);
            }
        }

        private async preloadProjectResources(monitor: controls.IProgressMonitor) {

            const extensions = Platform
                .getExtensions<PreloadProjectResourcesExtension>(PreloadProjectResourcesExtension.POINT_ID);

            let total = 0;

            for (const extension of extensions) {

                const n = await extension.computeTotal();

                total += n;
            }

            monitor.addTotal(total);

            for (const extension of extensions) {

                try {

                    await extension.preload(monitor);

                } catch (e) {

                    console.log("Error with extension:")
                    console.log(extension);
                    console.error(e);
                    alert(`[${extension.constructor.name}] Preload error: ${(e.message || e)}`);
                }
            }
        }

        private registerWindows() {

            const extensions = Platform.getExtensions<WindowExtension>(WindowExtension.POINT_ID);

            this._windows = extensions.map(extension => extension.createWindow());

            if (this._windows.length === 0) {

                alert("No workbench window provided.");

            } else {

                for (const win of this._windows) {

                    win.style.display = "none";

                    document.body.appendChild(win.getElement());
                }
            }
        }

        getWindows() {
            return this._windows;
        }

        public activateWindow(id: string): WorkbenchWindow {

            const win = this._windows.find(w => w.getId() === id);

            if (win) {

                if (this._activeWindow) {
                    this._activeWindow.style.display = "none";
                }

                this._activeWindow = win;

                win.create();

                win.style.display = "initial";

                return win;
            }

            alert(`Window ${id} not found.`);

            return null;
        }

        private async preloadPluginResources() {

            const dlg = new controls.dialogs.ProgressDialog();
            dlg.create();
            dlg.setTitle("Loading Workbench");
            dlg.setCloseWithEscapeKey(false);
            dlg.setProgress(0);

            // count icon extensions

            const iconAtlasExtensions: IconAtlasLoaderExtension[] = Platform
                .getExtensionRegistry()
                .getExtensions(IconAtlasLoaderExtension.POINT_ID);


            const icons: controls.IconImage[] = [];
            {
                const extensions = Platform
                    .getExtensions<IconLoaderExtension>(IconLoaderExtension.POINT_ID);

                for (const extension of extensions) {

                    icons.push(...extension.getIcons());
                }
            }

            // count resource extensions

            const resExtensions = Platform
                .getExtensions<PluginResourceLoaderExtension>(PluginResourceLoaderExtension.POINT_ID);

            // start preload

            const preloads = [
                ...iconAtlasExtensions,
                ...icons,
                ...resExtensions
            ];

            let i = 0;

            for (const preloader of preloads) {

                await preloader.preload();

                i++;

                dlg.setProgress(i / preloads.length);
            }

            dlg.close();
        }

        private registerContentTypeIcons() {

            this._contentType_icon_Map = new Map();

            const extensions = Platform.getExtensions<ContentTypeIconExtension>(ContentTypeIconExtension.POINT_ID);

            for (const extension of extensions) {

                for (const item of extension.getConfig()) {

                    this._contentType_icon_Map.set(item.contentType, item.iconDescriptor);
                }
            }
        }

        private initCommands() {

            this._commandManager = new commands.CommandManager();

            const extensions = Platform.getExtensions<commands.CommandExtension>(commands.CommandExtension.POINT_ID);

            for (const extension of extensions) {

                extension.getConfigurer()(this._commandManager);
            }
        }

        private initEvents() {

            window.addEventListener("mousedown", e => {

                this._activeElement = e.target as HTMLElement;

                const part = this.findPart(e.target as any);

                if (part) {

                    this.setActivePart(part);
                }
            });

            window.addEventListener("beforeunload", e => {

                const dirty = this.getEditors().find(editor => editor.isDirty());

                if (dirty) {

                    e.preventDefault();
                    e.returnValue = "";

                    Platform.onElectron(electron => {

                        electron.sendMessage({
                            method: "ask-close-window"
                        });
                    });
                }
            });

            /*

            This flag is needed by Firefox.
            In Firefox the focus event is emitted when an object is drop into the window
            so we should filter that case.

            */
            const flag = { drop: false };

            window.addEventListener("drop", e => {

                flag.drop = true;
            });

            window.addEventListener("focus", () => {

                if (flag.drop) {

                    flag.drop = false;

                    return;
                }

                this.eventWindowFocused.fire();

                for (const window of this._windows) {

                    for (const editor of this.getEditors()) {

                        editor.onWindowFocus();
                    }

                    for (const part of window.getViews()) {

                        part.onWindowFocus();
                    }
                }
            });
        }

        private registerEditors(): void {

            const extensions = Platform.getExtensions<EditorExtension>(EditorExtension.POINT_ID);

            for (const extension of extensions) {

                for (const factory of extension.getFactories()) {
                    this._editorRegistry.registerFactory(factory);
                }
            }
        }

        getCommandManager() {

            return this._commandManager;
        }

        getActiveDialog() {

            return controls.dialogs.Dialog.getActiveDialog();
        }

        getActiveWindow() {

            return this._activeWindow;
        }

        getActiveElement() {

            return this._activeElement;
        }

        getActivePart() {

            return this._activePart;
        }

        getActiveEditor() {

            return this._activeEditor;
        }

        setActiveEditor(editor: EditorPart) {

            if (editor === this._activeEditor) {

                return;
            }

            this._activeEditor = editor;

            this.eventEditorActivated.fire(editor);
        }

        /**
         * Users may not call this method. This is public only for convenience.
         */
        setActivePart(part: Part): void {

            if (part !== this._activePart) {

                const old = this._activePart;

                this._activePart = part;

                if (old) {

                    this.toggleActivePartClass(old);

                    old.onPartDeactivated();

                    this.eventPartDeactivated.fire(old);
                }

                if (part) {

                    this.toggleActivePartClass(part);

                    part.onPartActivated();
                }

                this.eventPartActivated.fire(part);
            }

            if (part instanceof EditorPart) {

                this.setActiveEditor(part as EditorPart);
            }
        }

        private toggleActivePartClass(part: Part) {

            const tabPane = this.findTabPane(part.getElement());

            if (!tabPane) {
                // maybe the clicked part was closed
                return;
            }

            if (part.containsClass("activePart")) {

                part.removeClass("activePart");
                tabPane.removeClass("activePart");

            } else {

                part.addClass("activePart");
                tabPane.addClass("activePart");
            }
        }

        private findTabPane(element: HTMLElement) {

            if (element) {

                const control = controls.Control.getControlOf(element);

                if (control && control instanceof controls.TabPane) {
                    return control;
                }

                return this.findTabPane(element.parentElement);
            }

            return null;
        }

        private registerContentTypes() {

            const extensions = Platform.getExtensions<core.ContentTypeExtension>(core.ContentTypeExtension.POINT_ID);

            this._contentTypeRegistry = new core.ContentTypeRegistry();

            for (const extension of extensions) {

                for (const resolver of extension.getResolvers()) {
                    this._contentTypeRegistry.registerResolver(resolver);
                }
            }
        }

        findPart(element: HTMLElement): Part {

            if (controls.TabPane.isTabCloseIcon(element)) {
                return null;
            }

            if (controls.TabPane.isTabLabel(element)) {
                element = controls.TabPane.getContentFromLabel(element).getElement();
            }

            if (element["__part"]) {
                return element["__part"];
            }

            const control = controls.Control.getControlOf(element);

            if (control && control instanceof controls.TabPane) {

                const tabPane = control as controls.TabPane;
                const content = tabPane.getSelectedTabContent();

                if (content) {

                    const elem2 = content.getElement();

                    if (elem2["__part"]) {
                        return elem2["__part"];
                    }
                }
            }

            if (element.parentElement) {
                return this.findPart(element.parentElement);
            }

            return null;
        }

        getContentTypeRegistry() {

            return this._contentTypeRegistry;
        }

        getProjectRoot(): core.io.FilePath {

            return this.getFileStorage().getRoot();
        }

        getContentTypeIcon(contentType: string): controls.IImage {

            if (this._contentType_icon_Map.has(contentType)) {

                const iconDesc = this._contentType_icon_Map.get(contentType);

                if (iconDesc) {

                    const icon = iconDesc.getIcon();

                    return icon;
                }
            }

            return null;
        }

        getFileImage(file: core.io.FilePath) {

            if (file === null) {
                return null;
            }

            return this._fileImageCache.getContent(file);
        }

        getFileImageSizeCache() {
            return this._fileImageSizeCache;
        }

        getWorkbenchIcon(name: string) {
            return ColibriPlugin.getInstance().getIcon(name);
        }

        getEditorRegistry() {
            return this._editorRegistry;
        }

        getEditors(): EditorPart[] {

            return this.getActiveWindow().getEditorArea().getEditors();
        }

        getOpenEditorsWithInput(input: ui.ide.IEditorInput) {

            return this.getEditors().filter(editor => editor.getInput() === input);
        }

        async saveAllEditors() {

            for (const editor of this.getEditors()) {

                if (!editor.isReadOnly() && editor.isDirty()) {

                    await editor.save();
                }
            }
        }

        makeEditor(input: IEditorInput, editorFactory?: EditorFactory): EditorPart {

            const factory = editorFactory || this._editorRegistry.getFactoryForInput(input);

            if (factory) {

                const editor = factory.createEditor();

                editor.setInput(input);

                return editor;

            } else {

                console.error("No editor available for :" + input);

                alert("No editor available for the given input.");
            }

            return null;
        }

        createEditor(input: IEditorInput, editorFactory?: EditorFactory): EditorPart {

            const editorArea = this.getActiveWindow().getEditorArea();

            const editor = this.makeEditor(input, editorFactory);

            if (editor) {

                editorArea.addPart(editor, true, false);
            }

            return editor;
        }

        getEditorInputExtension(input: IEditorInput) {

            return this.getEditorInputExtensionWithId(input.getEditorInputExtension());
        }

        getEditorInputExtensionWithId(id: string) {

            return Platform.getExtensions<EditorInputExtension>(EditorInputExtension.POINT_ID)

                .find(e => e.getId() === id);
        }

        openEditor(input: IEditorInput, editorFactory?: EditorFactory): EditorPart {

            const editorArea = this.getActiveWindow().getEditorArea();

            {
                const editors = this.getEditors();

                // tslint:disable-next-line:no-shadowed-variable
                for (const editor of editors) {

                    if (editor.getInput() === input) {

                        if (editorFactory && editorFactory !== editor.getEditorFactory()) {

                            continue;
                        }

                        editorArea.activateEditor(editor);

                        this.setActivePart(editor);

                        return editor;
                    }
                }
            }

            const editor = this.createEditor(input, editorFactory);

            if (editor) {

                editorArea.activateEditor(editor);

                this.setActivePart(editor);
            }

            return editor;
        }
    }
}