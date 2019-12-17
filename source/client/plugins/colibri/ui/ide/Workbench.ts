/// <reference path="../controls/Controls.ts"/>

namespace colibri.ui.ide {

    export const EVENT_PART_DEACTIVATED = "partDeactivated";
    export const EVENT_PART_ACTIVATED = "partActivated";

    export const EVENT_EDITOR_DEACTIVATED = "editorDeactivated";
    export const EVENT_EDITOR_ACTIVATED = "editorActivated";
    export const EVENT_PROJECT_OPENED = "projectOpened";

    export const ICON_FILE = "file";
    export const ICON_FOLDER = "folder";
    export const ICON_PLUS = "plus";

    export class Workbench extends EventTarget {

        private static _workbench: Workbench;

        static getWorkbench() {

            if (!Workbench._workbench) {

                Workbench._workbench = new Workbench();
            }

            return this._workbench;
        }

        private _fileStringCache: core.io.FileStringCache;
        private _fileImageCache: ImageFileCache;
        private _fileImageSizeCache: ImageSizeFileCache;
        private _activeWindow: ide.WorkbenchWindow;
        private _contentType_icon_Map: Map<string, controls.IImage>;
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

        private constructor() {

            super();

            this._editorRegistry = new EditorRegistry();

            this._windows = [];

            this._activePart = null;
            this._activeEditor = null;
            this._activeElement = null;

            this._fileImageCache = new ImageFileCache();

            this._fileImageSizeCache = new ImageSizeFileCache();

            this._fileStorage = new core.io.FileStorage_HTTPServer();

            this._fileStringCache = new core.io.FileStringCache(this._fileStorage);

            this._globalPreferences = new core.preferences.Preferences("__global__");

            this._projectPreferences = null;
        }

        getGlobalPreferences() {
            return this._globalPreferences;
        }

        getProjectPreferences() {
            return this._projectPreferences;
        }


        async launch() {

            console.log("Workbench: starting.");

            {
                const plugins = Platform.getPlugins();

                for (const plugin of plugins) {
                    plugin.registerExtensions(Platform.getExtensionRegistry());
                }

                for (const plugin of plugins) {
                    console.log(`\tPlugin: starting %c${plugin.getId()}`, "color:blue");
                    await plugin.starting();
                }
            }

            await ui.controls.Controls.preload();

            console.log("Workbench: fetching UI icons.");

            await this.preloadIcons();

            console.log("Workbench: registering content types.");

            this.registerContentTypes();

            this.registerContentTypeIcons();

            console.log("Workbench: initializing UI.");

            this.initCommands();

            this.registerEditors();

            this.registerWindows();

            this.initEvents();

            console.log("%cWorkbench: started.", "color:green");

            for (const plugin of Platform.getPlugins()) {

                await plugin.started();
            }
        }

        private resetCache() {

            this._fileStringCache.reset();
            this._fileImageCache.reset();
            this._fileImageSizeCache.reset();
            this._contentTypeRegistry.resetCache();
        }

        async openProject(projectName: string, monitor: controls.IProgressMonitor) {

            this._projectPreferences = new core.preferences.Preferences("__project__" + projectName);

            this.resetCache();

            console.log(`Workbench: opening project ${projectName}.`);

            await this._fileStorage.openProject(projectName);

            console.log("Workbench: fetching required project resources.");

            await this.preloadProjectResources(monitor);

            this.dispatchEvent(new CustomEvent(EVENT_PROJECT_OPENED, {
                detail: projectName
            }));
        }

        private async preloadProjectResources(monitor: controls.IProgressMonitor) {

            const extensions = Platform.getExtensions<PreloadProjectResourcesExtension>(PreloadProjectResourcesExtension.POINT_ID);

            for (const extension of extensions) {
                await extension.getPreloadPromise(monitor);
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

            const win = this._windows.find(win => win.getId() === id);

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

        private async preloadIcons() {

            await this.getWorkbenchIcon(ICON_FILE).preload();
            await this.getWorkbenchIcon(ICON_FOLDER).preload();
            await this.getWorkbenchIcon(ICON_PLUS).preload();

            const extensions = Platform
                .getExtensions<IconLoaderExtension>(IconLoaderExtension.POINT_ID);

            for (const extension of extensions) {

                const icons = extension.getIcons();

                for (const icon of icons) {
                    await icon.preload();
                }
            }

        }

        private registerContentTypeIcons() {

            this._contentType_icon_Map = new Map();

            const extensions = Platform.getExtensions<ContentTypeIconExtension>(ContentTypeIconExtension.POINT_ID);

            for (const extension of extensions) {

                for (const item of extension.getConfig()) {
                    this._contentType_icon_Map.set(item.contentType, item.icon);
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

                this._activeElement = <HTMLElement>e.target;

                const part = this.findPart(<any>e.target);

                if (part) {
                    this.setActivePart(part);
                }
            });

            window.addEventListener("beforeunload", e => {
                e.preventDefault();
                e.returnValue = "";
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

        getFileStringCache() {
            return this._fileStringCache;
        }

        getFileStorage() {
            return this._fileStorage;
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

            this.dispatchEvent(new CustomEvent(EVENT_EDITOR_ACTIVATED, { detail: editor }));
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
                    this.dispatchEvent(new CustomEvent(EVENT_PART_DEACTIVATED, { detail: old }));
                }

                if (part) {

                    this.toggleActivePartClass(part);

                    part.onPartActivated();
                }

                this.dispatchEvent(new CustomEvent(EVENT_PART_ACTIVATED, { detail: part }));
            }

            if (part instanceof EditorPart) {
                this.setActiveEditor(<EditorPart>part);
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
                const tabPane = <controls.TabPane>control;
                const content = tabPane.getSelectedTabContent();
                if (content) {
                    const element = content.getElement();
                    if (element["__part"]) {
                        return element["__part"];
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
            return this._fileStorage.getRoot();
        }

        getContentTypeIcon(contentType: string): controls.IImage {

            if (this._contentType_icon_Map.has(contentType)) {

                return this._contentType_icon_Map.get(contentType);

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
            return controls.Controls.getIcon(name, "plugins/colibri/ui/icons");
        }

        getEditorRegistry() {
            return this._editorRegistry;
        }

        getEditors(): EditorPart[] {
            return this.getActiveWindow().getEditorArea().getEditors();
        }

        createEditor(input: any): EditorPart {

            const editorArea = this.getActiveWindow().getEditorArea();

            const factory = this._editorRegistry.getFactoryForInput(input);

            if (factory) {

                const editor = factory.createEditor();

                editor.setInput(input);

                editorArea.addPart(editor, true, false);

                return editor;

            } else {

                console.error("No editor available for :" + input);

                alert("No editor available for the given input.");
            }

            return null;
        }

        openEditor(input: any): EditorPart {

            const editorArea = this.getActiveWindow().getEditorArea();

            {
                const editors = this.getEditors();

                for (let editor of editors) {

                    if (editor.getInput() === input) {

                        editorArea.activateEditor(editor);

                        this.setActivePart(editor);

                        return editor;
                    }
                }
            }

            const editor = this.createEditor(input);

            if (editor) {

                editorArea.activateEditor(editor);

                this.setActivePart(editor);
            }

            return editor;
        }

    }

}