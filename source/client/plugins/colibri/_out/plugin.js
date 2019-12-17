var colibri;
(function (colibri) {
    class Plugin {
        constructor(id) {
            this._id = id;
        }
        getId() {
            return this._id;
        }
        starting() {
            return Promise.resolve();
        }
        started() {
            return Promise.resolve();
        }
        registerExtensions(registry) {
        }
        getIcon(name) {
            return colibri.ui.controls.Controls.getIcon(name, `plugins/${this.getId()}/ui/icons`);
        }
    }
    colibri.Plugin = Plugin;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    class Platform {
        static addPlugin(plugin) {
            this._plugins.push(plugin);
        }
        static getPlugins() {
            return this._plugins;
        }
        static getExtensionRegistry() {
            if (!this._extensionRegistry) {
                this._extensionRegistry = new colibri.ExtensionRegistry();
            }
            return this._extensionRegistry;
        }
        static getExtensions(point) {
            return this._extensionRegistry.getExtensions(point);
        }
        static addExtension(...extensions) {
            this._extensionRegistry.addExtension(...extensions);
        }
        static getWorkbench() {
            return colibri.ui.ide.Workbench.getWorkbench();
        }
        static start() {
            return this.getWorkbench().launch();
        }
    }
    Platform._plugins = [];
    colibri.Platform = Platform;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.EVENT_CONTROL_LAYOUT = "controlLayout";
            class Control extends EventTarget {
                constructor(tagName = "div", ...classList) {
                    super();
                    this._bounds = { x: 0, y: 0, width: 0, height: 0 };
                    this._handlePosition = true;
                    this._children = [];
                    this._element = document.createElement(tagName);
                    this._element["__control"] = this;
                    this.addClass("Control", ...classList);
                    this._layout = null;
                    this._container = null;
                    this._scrollY = 0;
                    this._layoutChildren = true;
                }
                static getControlOf(element) {
                    return element["__control"];
                }
                isHandlePosition() {
                    return this._handlePosition;
                }
                setHandlePosition(_handlePosition) {
                    this._handlePosition = _handlePosition;
                }
                get style() {
                    return this.getElement().style;
                }
                isLayoutChildren() {
                    return this._layoutChildren;
                }
                setLayoutChildren(layout) {
                    this._layoutChildren = layout;
                }
                getScrollY() {
                    return this._scrollY;
                }
                setScrollY(scrollY) {
                    this._scrollY = scrollY;
                }
                getContainer() {
                    return this._container;
                }
                getLayout() {
                    return this._layout;
                }
                setLayout(layout) {
                    this._layout = layout;
                    this.layout();
                }
                addClass(...tokens) {
                    this._element.classList.add(...tokens);
                }
                removeClass(...tokens) {
                    this._element.classList.remove(...tokens);
                }
                containsClass(className) {
                    return this._element.classList.contains(className);
                }
                getElement() {
                    return this._element;
                }
                getControlPosition(windowX, windowY) {
                    const b = this.getElement().getBoundingClientRect();
                    return {
                        x: windowX - b.left,
                        y: windowY - b.top
                    };
                }
                containsLocalPoint(x, y) {
                    return x >= 0 && x <= this._bounds.width && y >= 0 && y <= this._bounds.height;
                }
                setBounds(bounds) {
                    this._bounds.x = bounds.x === undefined ? this._bounds.x : bounds.x;
                    this._bounds.y = bounds.y === undefined ? this._bounds.y : bounds.y;
                    this._bounds.width = bounds.width === undefined ? this._bounds.width : bounds.width;
                    this._bounds.height = bounds.height === undefined ? this._bounds.height : bounds.height;
                    this.layout();
                }
                setBoundsValues(x, y, w, h) {
                    this.setBounds({ x: x, y: y, width: w, height: h });
                }
                getBounds() {
                    return this._bounds;
                }
                setLocation(x, y) {
                    this._element.style.left = x + "px";
                    this._element.style.top = y + "px";
                    this._bounds.x = x;
                    this._bounds.y = y;
                }
                layout() {
                    if (this.isHandlePosition()) {
                        controls.setElementBounds(this._element, this._bounds);
                    }
                    else {
                        controls.setElementBounds(this._element, {
                            width: this._bounds.width,
                            height: this._bounds.height
                        });
                    }
                    if (this._layout) {
                        this._layout.layout(this);
                    }
                    else {
                        if (this._layoutChildren) {
                            for (let child of this._children) {
                                child.layout();
                            }
                        }
                    }
                    this.dispatchLayoutEvent();
                }
                dispatchLayoutEvent() {
                    this.dispatchEvent(new CustomEvent(controls.EVENT_CONTROL_LAYOUT));
                }
                add(control) {
                    control._container = this;
                    this._children.push(control);
                    this._element.appendChild(control.getElement());
                    control.onControlAdded();
                }
                onControlAdded() {
                }
                getChildren() {
                    return this._children;
                }
            }
            controls.Control = Control;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Control.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.EVENT_SELECTION_CHANGED = "selectionChanged";
            controls.EVENT_THEME_CHANGED = "themeChanged";
            let PreloadResult;
            (function (PreloadResult) {
                PreloadResult[PreloadResult["NOTHING_LOADED"] = 0] = "NOTHING_LOADED";
                PreloadResult[PreloadResult["RESOURCES_LOADED"] = 1] = "RESOURCES_LOADED";
            })(PreloadResult = controls.PreloadResult || (controls.PreloadResult = {}));
            controls.ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
            controls.ICON_CONTROL_TREE_EXPAND = "tree-expand";
            controls.ICON_CONTROL_CLOSE = "close";
            controls.ICON_CONTROL_DIRTY = "dirty";
            controls.ICON_SIZE = 16;
            const ICONS = [
                controls.ICON_CONTROL_TREE_COLLAPSE,
                controls.ICON_CONTROL_TREE_EXPAND,
                controls.ICON_CONTROL_CLOSE,
                controls.ICON_CONTROL_DIRTY
            ];
            class Controls {
                static setDragEventImage(e, render) {
                    let canvas = document.getElementById("__drag__canvas");
                    if (!canvas) {
                        canvas = document.createElement("canvas");
                        canvas.setAttribute("id", "__drag__canvas");
                        canvas.style.imageRendering = "crisp-edges";
                        canvas.width = 64;
                        canvas.height = 64;
                        canvas.style.width = canvas.width + "px";
                        canvas.style.height = canvas.height + "px";
                        canvas.style.position = "fixed";
                        canvas.style.left = -100 + "px";
                        document.body.appendChild(canvas);
                    }
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    render(ctx, canvas.width, canvas.height);
                    e.dataTransfer.setDragImage(canvas, 10, 10);
                }
                static getApplicationDragData() {
                    return this._applicationDragData;
                }
                static getApplicationDragDataAndClean() {
                    const data = this._applicationDragData;
                    this._applicationDragData = null;
                    return data;
                }
                static setApplicationDragData(data) {
                    this._applicationDragData = data;
                }
                static async resolveAll(list) {
                    let result = PreloadResult.NOTHING_LOADED;
                    for (const promise of list) {
                        const result2 = await promise;
                        if (result2 === PreloadResult.RESOURCES_LOADED) {
                            result = PreloadResult.RESOURCES_LOADED;
                        }
                    }
                    return Promise.resolve(result);
                }
                static resolveResourceLoaded() {
                    return Promise.resolve(PreloadResult.RESOURCES_LOADED);
                }
                static resolveNothingLoaded() {
                    return Promise.resolve(PreloadResult.NOTHING_LOADED);
                }
                static async preload() {
                    return Promise.all(ICONS.map(icon => this.getIcon(icon).preload()));
                }
                static getImage(url, id) {
                    if (Controls._images.has(id)) {
                        return Controls._images.get(id);
                    }
                    const img = new controls.DefaultImage(new Image(), url);
                    Controls._images.set(id, img);
                    return img;
                }
                static openUrlInNewPage(url) {
                    const element = document.createElement("a");
                    element.href = url;
                    element.target = "blank";
                    document.body.append(element);
                    element.click();
                    element.remove();
                }
                static getIcon(name, baseUrl = "plugins/colibri/ui/controls/images") {
                    const url = `static/${baseUrl}/${controls.ICON_SIZE}/${name}.png`;
                    return Controls.getImage(url, name);
                }
                static createIconElement(icon, size = controls.ICON_SIZE) {
                    const canvas = document.createElement("canvas");
                    canvas.width = canvas.height = size;
                    canvas.style.width = canvas.style.height = size + "px";
                    const context = canvas.getContext("2d");
                    context.imageSmoothingEnabled = false;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    if (icon) {
                        icon.paint(context, 0, 0, canvas.width, canvas.height, true);
                    }
                    return canvas;
                }
                static switchTheme() {
                    const newTheme = this._theme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
                    this.setTheme(newTheme);
                    return newTheme;
                }
                static setTheme(theme) {
                    const classList = document.getElementsByTagName("html")[0].classList;
                    classList.remove(...this._theme.classList);
                    classList.add(...theme.classList);
                    this._theme = theme;
                    window.dispatchEvent(new CustomEvent(controls.EVENT_THEME_CHANGED, { detail: this._theme }));
                }
                static getTheme() {
                    return this._theme;
                }
                static drawRoundedRect(ctx, x, y, w, h, topLeft = 5, topRight = 5, bottomRight = 5, bottomLeft = 5) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x + topLeft, y);
                    ctx.lineTo(x + w - topRight, y);
                    ctx.quadraticCurveTo(x + w, y, x + w, y + topRight);
                    ctx.lineTo(x + w, y + h - bottomRight);
                    ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h);
                    ctx.lineTo(x + bottomLeft, y + h);
                    ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft);
                    ctx.lineTo(x, y + topLeft);
                    ctx.quadraticCurveTo(x, y, x + topLeft, y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            }
            Controls._images = new Map();
            Controls._applicationDragData = null;
            Controls.LIGHT_THEME = {
                id: "light",
                displayName: "Light",
                classList: ["light"],
                dark: false,
                viewerSelectionBackground: "#4242ff",
                //treeItemSelectionBackground: "#525252",
                viewerSelectionForeground: "#f0f0f0",
                viewerForeground: "#000000",
            };
            Controls.DARK_THEME = {
                id: "dark",
                displayName: "Dark",
                classList: ["dark"],
                dark: true,
                viewerSelectionBackground: "#f0a050",
                viewerSelectionForeground: "#0e0e0e",
                viewerForeground: "#f0f0f0",
            };
            Controls._theme = Controls.DARK_THEME;
            controls.Controls = Controls;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../controls/Controls.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            ide.EVENT_PART_DEACTIVATED = "partDeactivated";
            ide.EVENT_PART_ACTIVATED = "partActivated";
            ide.EVENT_EDITOR_DEACTIVATED = "editorDeactivated";
            ide.EVENT_EDITOR_ACTIVATED = "editorActivated";
            ide.EVENT_PROJECT_OPENED = "projectOpened";
            ide.ICON_FILE = "file";
            ide.ICON_FOLDER = "folder";
            ide.ICON_PLUS = "plus";
            class Workbench extends EventTarget {
                constructor() {
                    super();
                    this._editorRegistry = new ide.EditorRegistry();
                    this._windows = [];
                    this._activePart = null;
                    this._activeEditor = null;
                    this._activeElement = null;
                    this._fileImageCache = new ide.ImageFileCache();
                    this._fileImageSizeCache = new ide.ImageSizeFileCache();
                    this._fileStorage = new colibri.core.io.FileStorage_HTTPServer();
                    this._fileStringCache = new colibri.core.io.FileStringCache(this._fileStorage);
                    this._globalPreferences = new colibri.core.preferences.Preferences("__global__");
                    this._projectPreferences = null;
                }
                static getWorkbench() {
                    if (!Workbench._workbench) {
                        Workbench._workbench = new Workbench();
                    }
                    return this._workbench;
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
                        const plugins = colibri.Platform.getPlugins();
                        for (const plugin of plugins) {
                            plugin.registerExtensions(colibri.Platform.getExtensionRegistry());
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
                    for (const plugin of colibri.Platform.getPlugins()) {
                        await plugin.started();
                    }
                }
                resetCache() {
                    this._fileStringCache.reset();
                    this._fileImageCache.reset();
                    this._fileImageSizeCache.reset();
                    this._contentTypeRegistry.resetCache();
                }
                async openProject(projectName, monitor) {
                    this._projectPreferences = new colibri.core.preferences.Preferences("__project__" + projectName);
                    this.resetCache();
                    console.log(`Workbench: opening project ${projectName}.`);
                    await this._fileStorage.openProject(projectName);
                    console.log("Workbench: fetching required project resources.");
                    await this.preloadProjectResources(monitor);
                    this.dispatchEvent(new CustomEvent(ide.EVENT_PROJECT_OPENED, {
                        detail: projectName
                    }));
                }
                async preloadProjectResources(monitor) {
                    const extensions = colibri.Platform.getExtensions(ide.PreloadProjectResourcesExtension.POINT_ID);
                    for (const extension of extensions) {
                        await extension.getPreloadPromise(monitor);
                    }
                }
                registerWindows() {
                    const extensions = colibri.Platform.getExtensions(ide.WindowExtension.POINT_ID);
                    this._windows = extensions.map(extension => extension.createWindow());
                    if (this._windows.length === 0) {
                        alert("No workbench window provided.");
                    }
                    else {
                        for (const win of this._windows) {
                            win.style.display = "none";
                            document.body.appendChild(win.getElement());
                        }
                    }
                }
                getWindows() {
                    return this._windows;
                }
                activateWindow(id) {
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
                async preloadIcons() {
                    await this.getWorkbenchIcon(ide.ICON_FILE).preload();
                    await this.getWorkbenchIcon(ide.ICON_FOLDER).preload();
                    await this.getWorkbenchIcon(ide.ICON_PLUS).preload();
                    const extensions = colibri.Platform
                        .getExtensions(ide.IconLoaderExtension.POINT_ID);
                    for (const extension of extensions) {
                        const icons = extension.getIcons();
                        for (const icon of icons) {
                            await icon.preload();
                        }
                    }
                }
                registerContentTypeIcons() {
                    this._contentType_icon_Map = new Map();
                    const extensions = colibri.Platform.getExtensions(ide.ContentTypeIconExtension.POINT_ID);
                    for (const extension of extensions) {
                        for (const item of extension.getConfig()) {
                            this._contentType_icon_Map.set(item.contentType, item.icon);
                        }
                    }
                }
                initCommands() {
                    this._commandManager = new ide.commands.CommandManager();
                    const extensions = colibri.Platform.getExtensions(ide.commands.CommandExtension.POINT_ID);
                    for (const extension of extensions) {
                        extension.getConfigurer()(this._commandManager);
                    }
                }
                initEvents() {
                    window.addEventListener("mousedown", e => {
                        this._activeElement = e.target;
                        const part = this.findPart(e.target);
                        if (part) {
                            this.setActivePart(part);
                        }
                    });
                    window.addEventListener("beforeunload", e => {
                        e.preventDefault();
                        e.returnValue = "";
                    });
                }
                registerEditors() {
                    const extensions = colibri.Platform.getExtensions(ide.EditorExtension.POINT_ID);
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
                    return ui.controls.dialogs.Dialog.getActiveDialog();
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
                setActiveEditor(editor) {
                    if (editor === this._activeEditor) {
                        return;
                    }
                    this._activeEditor = editor;
                    this.dispatchEvent(new CustomEvent(ide.EVENT_EDITOR_ACTIVATED, { detail: editor }));
                }
                /**
                 * Users may not call this method. This is public only for convenience.
                 */
                setActivePart(part) {
                    if (part !== this._activePart) {
                        const old = this._activePart;
                        this._activePart = part;
                        if (old) {
                            this.toggleActivePartClass(old);
                            this.dispatchEvent(new CustomEvent(ide.EVENT_PART_DEACTIVATED, { detail: old }));
                        }
                        if (part) {
                            this.toggleActivePartClass(part);
                            part.onPartActivated();
                        }
                        this.dispatchEvent(new CustomEvent(ide.EVENT_PART_ACTIVATED, { detail: part }));
                    }
                    if (part instanceof ide.EditorPart) {
                        this.setActiveEditor(part);
                    }
                }
                toggleActivePartClass(part) {
                    const tabPane = this.findTabPane(part.getElement());
                    if (!tabPane) {
                        // maybe the clicked part was closed
                        return;
                    }
                    if (part.containsClass("activePart")) {
                        part.removeClass("activePart");
                        tabPane.removeClass("activePart");
                    }
                    else {
                        part.addClass("activePart");
                        tabPane.addClass("activePart");
                    }
                }
                findTabPane(element) {
                    if (element) {
                        const control = ui.controls.Control.getControlOf(element);
                        if (control && control instanceof ui.controls.TabPane) {
                            return control;
                        }
                        return this.findTabPane(element.parentElement);
                    }
                    return null;
                }
                registerContentTypes() {
                    const extensions = colibri.Platform.getExtensions(colibri.core.ContentTypeExtension.POINT_ID);
                    this._contentTypeRegistry = new colibri.core.ContentTypeRegistry();
                    for (const extension of extensions) {
                        for (const resolver of extension.getResolvers()) {
                            this._contentTypeRegistry.registerResolver(resolver);
                        }
                    }
                }
                findPart(element) {
                    if (ui.controls.TabPane.isTabCloseIcon(element)) {
                        return null;
                    }
                    if (ui.controls.TabPane.isTabLabel(element)) {
                        element = ui.controls.TabPane.getContentFromLabel(element).getElement();
                    }
                    if (element["__part"]) {
                        return element["__part"];
                    }
                    const control = ui.controls.Control.getControlOf(element);
                    if (control && control instanceof ui.controls.TabPane) {
                        const tabPane = control;
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
                getProjectRoot() {
                    return this._fileStorage.getRoot();
                }
                getContentTypeIcon(contentType) {
                    if (this._contentType_icon_Map.has(contentType)) {
                        return this._contentType_icon_Map.get(contentType);
                    }
                    return null;
                }
                getFileImage(file) {
                    if (file === null) {
                        return null;
                    }
                    return this._fileImageCache.getContent(file);
                }
                getFileImageSizeCache() {
                    return this._fileImageSizeCache;
                }
                getWorkbenchIcon(name) {
                    return ui.controls.Controls.getIcon(name, "plugins/colibri/ui/icons");
                }
                getEditorRegistry() {
                    return this._editorRegistry;
                }
                getEditors() {
                    return this.getActiveWindow().getEditorArea().getEditors();
                }
                createEditor(input) {
                    const editorArea = this.getActiveWindow().getEditorArea();
                    const factory = this._editorRegistry.getFactoryForInput(input);
                    if (factory) {
                        const editor = factory.createEditor();
                        editor.setInput(input);
                        editorArea.addPart(editor, true, false);
                        return editor;
                    }
                    else {
                        console.error("No editor available for :" + input);
                        alert("No editor available for the given input.");
                    }
                    return null;
                }
                openEditor(input) {
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
            ide.Workbench = Workbench;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Plugin.ts" />
/// <reference path="./Platform.ts" />
/// <reference path="./ui/ide/Workbench.ts" />
var colibri;
(function (colibri) {
    class ColibriPlugin extends colibri.Plugin {
        constructor() {
            super("colibri");
            this._openingProject = false;
        }
        static getInstance() {
            var _a;
            return _a = this._instance, (_a !== null && _a !== void 0 ? _a : (this._instance = new ColibriPlugin()));
        }
        registerExtensions(reg) {
            // themes
            reg.addExtension(new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.LIGHT_THEME), new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.DARK_THEME));
            // keys
            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(colibri.ui.ide.actions.IDECommands.registerCommands));
        }
    }
    colibri.ColibriPlugin = ColibriPlugin;
    colibri.Platform.addPlugin(ColibriPlugin.getInstance());
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    class Extension {
        constructor(extensionPoint, priority = 10) {
            this._extensionPoint = extensionPoint;
            this._priority = priority;
        }
        getExtensionPoint() {
            return this._extensionPoint;
        }
        getPriority() {
            return this._priority;
        }
    }
    colibri.Extension = Extension;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    class ExtensionRegistry {
        constructor() {
            this._map = new Map();
        }
        addExtension(...extensions) {
            const points = new Set();
            for (const ext of extensions) {
                const point = ext.getExtensionPoint();
                let list = this._map.get(point);
                if (!list) {
                    this._map.set(point, list = []);
                }
                list.push(ext);
            }
            for (const point of points) {
                let list = this._map.get(point);
                list.sort((a, b) => a.getPriority() - b.getPriority());
            }
        }
        getExtensions(point) {
            let list = this._map.get(point);
            if (!list) {
                return [];
            }
            return list;
        }
    }
    colibri.ExtensionRegistry = ExtensionRegistry;
})(colibri || (colibri = {}));
/// <reference path="../Extension.ts" />
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        class ContentTypeExtension extends colibri.Extension {
            constructor(resolvers, priority = 10) {
                super(ContentTypeExtension.POINT_ID, priority);
                this._resolvers = resolvers;
            }
            getResolvers() {
                return this._resolvers;
            }
        }
        ContentTypeExtension.POINT_ID = "colibri.ContentTypeExtension";
        core.ContentTypeExtension = ContentTypeExtension;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FileContentCache {
                constructor(getContent, setContent) {
                    this._backendGetContent = getContent;
                    this._backendSetContent = setContent;
                    this.reset();
                }
                reset() {
                    this._map = new Map();
                    this._preloadMap = new Map();
                }
                preload(file) {
                    const filename = file.getFullName();
                    if (this._preloadMap.has(filename)) {
                        return this._preloadMap.get(filename);
                    }
                    const entry = this._map.get(filename);
                    if (entry) {
                        if (entry.modTime === file.getModTime()) {
                            return colibri.ui.controls.Controls.resolveNothingLoaded();
                        }
                        const promise = this._backendGetContent(file)
                            .then((content) => {
                            this._preloadMap.delete(filename);
                            entry.modTime = file.getModTime();
                            entry.content = content;
                            return Promise.resolve(colibri.ui.controls.PreloadResult.RESOURCES_LOADED);
                        });
                        this._preloadMap.set(filename, promise);
                        return promise;
                    }
                    const promise = this._backendGetContent(file)
                        .then((content) => {
                        this._preloadMap.delete(filename);
                        this._map.set(filename, new ContentEntry(content, file.getModTime()));
                        return colibri.ui.controls.PreloadResult.RESOURCES_LOADED;
                    });
                    this._preloadMap.set(filename, promise);
                    return promise;
                }
                getContent(file) {
                    const entry = this._map.get(file.getFullName());
                    return entry ? entry.content : null;
                }
                async setContent(file, content) {
                    if (this._backendSetContent) {
                        await this._backendSetContent(file, content);
                    }
                    const name = file.getFullName();
                    const modTime = file.getModTime();
                    let entry = this._map.get(name);
                    if (entry) {
                        entry.content = content;
                        entry.modTime = modTime;
                    }
                    else {
                        this._map.set(name, entry = new ContentEntry(content, modTime));
                    }
                }
                hasFile(file) {
                    return this._map.has(file.getFullName());
                }
            }
            io.FileContentCache = FileContentCache;
            class ContentEntry {
                constructor(content, modTime) {
                    this.content = content;
                    this.modTime = modTime;
                }
            }
            io.ContentEntry = ContentEntry;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
/// <reference path="./io/FileContentCache.ts" />
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        class ContentTypeFileCache extends core.io.FileContentCache {
            constructor(registry) {
                super(async (file) => {
                    for (const resolver of registry.getResolvers()) {
                        try {
                            const ct = await resolver.computeContentType(file);
                            if (ct !== core.CONTENT_TYPE_ANY) {
                                return ct;
                            }
                        }
                        catch (e) {
                            // nothing
                        }
                    }
                    return core.CONTENT_TYPE_ANY;
                });
            }
        }
        core.ContentTypeFileCache = ContentTypeFileCache;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
/// <reference path="./io/FileContentCache.ts" />
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        class ContentTypeRegistry {
            constructor() {
                this._resolvers = [];
                this._cache = new core.ContentTypeFileCache(this);
            }
            resetCache() {
                this._cache.reset();
            }
            registerResolver(resolver) {
                this._resolvers.push(resolver);
            }
            getResolvers() {
                return this._resolvers;
            }
            getCachedContentType(file) {
                return this._cache.getContent(file);
            }
            async preload(file) {
                return this._cache.preload(file);
            }
        }
        core.ContentTypeRegistry = ContentTypeRegistry;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        class ContentTypeResolver {
            constructor(id) {
                this._id = id;
            }
            getId() {
                return this._id;
            }
        }
        core.ContentTypeResolver = ContentTypeResolver;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        core.CONTENT_TYPE_ANY = "any";
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FilePath {
                constructor(parent, fileData) {
                    this._parent = parent;
                    this._isFile = fileData.isFile;
                    this._fileSize = fileData.size;
                    this._modTime = fileData.modTime;
                    this._alive = true;
                    this._setName(fileData.name);
                    if (fileData.children) {
                        this._files = [];
                        for (let child of fileData.children) {
                            this._files.push(new FilePath(this, child));
                        }
                        this._sort();
                    }
                    else {
                        this._files = [];
                    }
                }
                _sort() {
                    this._files.sort((a, b) => {
                        const a1 = a._isFile ? 1 : 0;
                        const b1 = b._isFile ? 1 : 0;
                        if (a1 === b1) {
                            return a._name.localeCompare(b._name);
                        }
                        return a1 - b1;
                    });
                }
                _setName(name) {
                    this._name = name;
                    const i = this._name.lastIndexOf(".");
                    if (i >= 0) {
                        this._ext = this._name.substring(i + 1);
                        this._nameWithoutExtension = this._name.substring(0, i);
                    }
                    else {
                        this._ext = "";
                        this._nameWithoutExtension = this._name;
                    }
                }
                getExtension() {
                    return this._ext;
                }
                getSize() {
                    return this.isFile() ? this._fileSize : 0;
                }
                _setSize(size) {
                    this._fileSize = size;
                }
                getName() {
                    return this._name;
                }
                getNameWithoutExtension() {
                    return this._nameWithoutExtension;
                }
                getModTime() {
                    return this._modTime;
                }
                _setModTime(modTime) {
                    this._modTime = modTime;
                }
                getFullName() {
                    if (this._parent) {
                        return this._parent.getFullName() + "/" + this._name;
                    }
                    return this._name;
                }
                getUrl() {
                    if (this._parent) {
                        return this._parent.getUrl() + "/" + this._name;
                    }
                    const projectName = this.getProject().getName();
                    return `./project/${projectName}`;
                }
                getProject() {
                    if (this._parent) {
                        return this._parent.getProject();
                    }
                    return this;
                }
                getSibling(name) {
                    const parent = this.getParent();
                    if (parent) {
                        return parent.getFile(name);
                    }
                    return null;
                }
                getFile(name) {
                    return this.getFiles().find(file => file.getName() === name);
                }
                getParent() {
                    return this._parent;
                }
                isFile() {
                    return this._isFile;
                }
                isFolder() {
                    return !this.isFile();
                }
                getFiles() {
                    return this._files;
                }
                _setAlive(alive) {
                    this._alive = alive;
                }
                isAlive() {
                    return this._alive;
                }
                _add(file) {
                    file._remove();
                    file._parent = this;
                    const b = this._files === file._files;
                    this._files.push(file);
                    this._sort();
                }
                _remove() {
                    this._alive = false;
                    if (this._parent) {
                        const list = this._parent._files;
                        const i = list.indexOf(this);
                        if (i >= 0) {
                            list.splice(i, 1);
                        }
                    }
                }
                flatTree(files, includeFolders) {
                    if (this.isFolder()) {
                        if (includeFolders) {
                            files.push(this);
                        }
                        for (const file of this.getFiles()) {
                            file.flatTree(files, includeFolders);
                        }
                    }
                    else {
                        files.push(this);
                    }
                    return files;
                }
                toString() {
                    if (this._parent) {
                        return this._parent.toString() + "/" + this._name;
                    }
                    return this._name;
                }
                toStringTree() {
                    return this.toStringTree2(0);
                }
                toStringTree2(depth) {
                    let s = " ".repeat(depth * 4);
                    s += this.getName() + (this.isFolder() ? "/" : "") + "\n";
                    if (this.isFolder()) {
                        for (let file of this._files) {
                            s += file.toStringTree2(depth + 1);
                        }
                    }
                    return s;
                }
            }
            io.FilePath = FilePath;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FileStorageChange {
                constructor() {
                    this._renameRecords_fromPath = new Set();
                    this._renameRecords_toPath = new Set();
                    this._deletedRecords = new Set();
                    this._addedRecords = new Set();
                    this._modifiedRecords = new Set();
                    this._renameFromToMap = new Map();
                }
                recordRename(fromPath, toPath) {
                    this._renameRecords_fromPath.add(fromPath);
                    this._renameRecords_toPath.add(toPath);
                    this._renameFromToMap[fromPath] = toPath;
                }
                getRenameTo(fromPath) {
                    return this._renameFromToMap[fromPath];
                }
                isRenamed(fromPath) {
                    return this._renameFromToMap.has(fromPath);
                }
                wasRenamed(toPath) {
                    return this._renameRecords_toPath.has(toPath);
                }
                getRenameToRecords() {
                    return this._renameRecords_toPath;
                }
                getRenameFromRecords() {
                    return this._renameRecords_fromPath;
                }
                recordDelete(path) {
                    this._deletedRecords.add(path);
                }
                isDeleted(path) {
                    return this._deletedRecords.has(path);
                }
                getDeleteRecords() {
                    return this._deletedRecords;
                }
                recordAdd(path) {
                    this._addedRecords.add(path);
                }
                isAdded(path) {
                    return this._addedRecords.has(path);
                }
                getAddRecords() {
                    return this._addedRecords;
                }
                recordModify(path) {
                    this._modifiedRecords.add(path);
                }
                isModified(path) {
                    return this._modifiedRecords.has(path);
                }
                getModifiedRecords() {
                    return this._modifiedRecords;
                }
            }
            io.FileStorageChange = FileStorageChange;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FileStringCache extends io.FileContentCache {
                constructor(storage) {
                    super(file => storage.getFileString(file), (file, content) => storage.setFileString(file, content));
                }
            }
            io.FileStringCache = FileStringCache;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            async function apiRequest(method, body) {
                try {
                    const resp = await fetch("api", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "method": method,
                            "body": body
                        })
                    });
                    const json = await resp.json();
                    return json;
                }
                catch (e) {
                    console.error(e);
                    return new Promise((resolve, reject) => {
                        resolve({
                            error: e.message
                        });
                    });
                }
            }
            io.apiRequest = apiRequest;
            class FileStorage_HTTPServer {
                constructor() {
                    this._root = null;
                    this._changeListeners = [];
                }
                addChangeListener(listener) {
                    this._changeListeners.push(listener);
                }
                removeChangeListener(listener) {
                    const i = this._changeListeners.indexOf(listener);
                    this._changeListeners.splice(i, 1);
                }
                getRoot() {
                    return this._root;
                }
                async openProject(projectName) {
                    this._projectName = projectName;
                    await this.reload();
                    return this.getRoot();
                }
                async getProjectTemplates() {
                    const data = await apiRequest("GetProjectTemplates", {});
                    if (data.error) {
                        alert("Cannot get the project templates");
                        return {
                            providers: []
                        };
                    }
                    return data["templatesData"];
                }
                async createProject(templatePath, projectName) {
                    const data = await apiRequest("CreateProject", {
                        templatePath: templatePath,
                        projectName: projectName
                    });
                    if (data.error) {
                        alert("Cannot create the project.");
                        return false;
                    }
                    return true;
                }
                async reload() {
                    const data = await apiRequest("GetProjectFiles", {
                        project: this._projectName
                    });
                    const oldRoot = this._root;
                    let newRoot;
                    if (data.projectNumberOfFiles > data.maxNumberOfFiles) {
                        newRoot = new io.FilePath(null, {
                            name: this._projectName,
                            modTime: 0,
                            size: 0,
                            children: [],
                            isFile: false
                        });
                        alert(`Your project exceeded the maximum number of files allowed (${data.projectNumberOfFiles} > ${data.maxNumberOfFiles})`);
                    }
                    else {
                        newRoot = new io.FilePath(null, data.rootFile);
                    }
                    this._root = newRoot;
                    if (oldRoot) {
                        const change = FileStorage_HTTPServer.compare(oldRoot, newRoot);
                        this.fireChange(change);
                    }
                }
                fireChange(change) {
                    for (const listener of this._changeListeners) {
                        try {
                            listener(change);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
                static compare(oldRoot, newRoot) {
                    const oldFiles = [];
                    const newFiles = [];
                    oldRoot.flatTree(oldFiles, false);
                    newRoot.flatTree(newFiles, false);
                    const newNameMap = new Map();
                    for (const file of newFiles) {
                        newNameMap.set(file.getFullName(), file);
                    }
                    const newNameSet = new Set(newFiles.map(file => file.getFullName()));
                    const oldNameSet = new Set(oldFiles.map(file => file.getFullName()));
                    const deleted = [];
                    const modified = [];
                    const added = [];
                    for (const oldFile of oldFiles) {
                        const oldName = oldFile.getFullName();
                        if (newNameSet.has(oldName)) {
                            const newFile = newNameMap.get(oldName);
                            if (newFile.getModTime() !== oldFile.getModTime()) {
                                modified.push(newFile);
                            }
                        }
                        else {
                            deleted.push(oldFile);
                        }
                    }
                    for (const newFile of newFiles) {
                        if (!oldNameSet.has(newFile.getFullName())) {
                            added.push(newFile);
                        }
                    }
                    const change = new io.FileStorageChange();
                    for (const file of modified) {
                        change.recordModify(file.getFullName());
                    }
                    for (const file of added) {
                        change.recordAdd(file.getFullName());
                    }
                    for (const file of deleted) {
                        change.recordDelete(file.getFullName());
                    }
                    return change;
                }
                async getProjects() {
                    const data = await apiRequest("GetProjects", {});
                    if (data.error) {
                        alert(`Cannot get the projects list`);
                        throw new Error(data.error);
                    }
                    return data.projects;
                }
                async createFile(folder, fileName, content) {
                    const file = new io.FilePath(folder, {
                        children: [],
                        isFile: true,
                        name: fileName,
                        size: 0,
                        modTime: 0
                    });
                    await this.setFileString_priv(file, content);
                    folder._add(file);
                    const change = new io.FileStorageChange();
                    change.recordAdd(file.getFullName());
                    this.fireChange(change);
                    return file;
                }
                async createFolder(container, folderName) {
                    const newFolder = new io.FilePath(container, {
                        children: [],
                        isFile: false,
                        name: folderName,
                        size: 0,
                        modTime: 0
                    });
                    const path = container.getFullName() + "/" + folderName;
                    const data = await apiRequest("CreateFolder", {
                        path: path
                    });
                    if (data.error) {
                        alert(`Cannot create folder at '${path}'`);
                        throw new Error(data.error);
                    }
                    newFolder["_modTime"] = data["modTime"];
                    container["_files"].push(newFolder);
                    container["_files"].sort((a, b) => a.getName().localeCompare(b.getName()));
                    const change = new io.FileStorageChange();
                    change.recordAdd(newFolder.getFullName());
                    this.fireChange(change);
                    return newFolder;
                }
                async getFileString(file) {
                    const data = await apiRequest("GetFileString", {
                        path: file.getFullName()
                    });
                    if (data.error) {
                        alert(`Cannot get file content of '${file.getFullName()}'`);
                        return null;
                    }
                    const content = data["content"];
                    return content;
                }
                async setFileString(file, content) {
                    await this.setFileString_priv(file, content);
                    const change = new io.FileStorageChange();
                    change.recordModify(file.getFullName());
                    this.fireChange(change);
                }
                async setFileString_priv(file, content) {
                    const data = await apiRequest("SetFileString", {
                        path: file.getFullName(),
                        content: content
                    });
                    if (data.error) {
                        alert(`Cannot set file content to '${file.getFullName()}'`);
                        throw new Error(data.error);
                    }
                    const fileData = data;
                    file._setModTime(fileData.modTime);
                    file._setSize(fileData.size);
                }
                async deleteFiles(files) {
                    const data = await apiRequest("DeleteFiles", {
                        paths: files.map(file => file.getFullName())
                    });
                    if (data.error) {
                        alert(`Cannot delete the files.`);
                        throw new Error(data.error);
                    }
                    const deletedSet = new Set();
                    for (const file of files) {
                        deletedSet.add(file);
                        for (const file2 of file.flatTree([], true)) {
                            deletedSet.add(file2);
                        }
                    }
                    const change = new io.FileStorageChange();
                    for (const file of deletedSet) {
                        file._remove();
                        change.recordDelete(file.getFullName());
                    }
                    this.fireChange(change);
                }
                async renameFile(file, newName) {
                    const data = await apiRequest("RenameFile", {
                        oldPath: file.getFullName(),
                        newPath: file.getParent().getFullName() + "/" + newName
                    });
                    if (data.error) {
                        alert(`Cannot rename the file.`);
                        throw new Error(data.error);
                    }
                    const fromPath = file.getFullName();
                    file._setName(newName);
                    file.getParent()._sort();
                    const change = new io.FileStorageChange();
                    change.recordRename(fromPath, file.getFullName());
                    this.fireChange(change);
                }
                async moveFiles(movingFiles, moveTo) {
                    const data = await apiRequest("MoveFiles", {
                        movingPaths: movingFiles.map(file => file.getFullName()),
                        movingToPath: moveTo.getFullName()
                    });
                    const records = movingFiles.map(file => {
                        return {
                            from: file.getFullName(),
                            to: moveTo.getFullName() + "/" + file.getName()
                        };
                    });
                    if (data.error) {
                        alert(`Cannot move the files.`);
                        throw new Error(data.error);
                    }
                    for (const srcFile of movingFiles) {
                        const i = srcFile.getParent().getFiles().indexOf(srcFile);
                        srcFile.getParent().getFiles().splice(i, 1);
                        moveTo._add(srcFile);
                    }
                    const change = new io.FileStorageChange();
                    for (const record of records) {
                        change.recordRename(record.from, record.to);
                    }
                    this.fireChange(change);
                }
                async uploadFile(uploadFolder, htmlFile) {
                    const formData = new FormData();
                    formData.append("uploadTo", uploadFolder.getFullName());
                    formData.append("file", htmlFile);
                    const resp = await fetch("upload", {
                        method: "POST",
                        body: formData
                    });
                    const data = await resp.json();
                    if (data.error) {
                        alert(`Error sending file ${htmlFile.name}`);
                        throw new Error(data.error);
                    }
                    const fileData = data.file;
                    let file = uploadFolder.getFile(htmlFile.name);
                    const change = new io.FileStorageChange();
                    if (file) {
                        file._setModTime(fileData.modTime);
                        file._setSize(fileData.size);
                        change.recordModify(file.getFullName());
                    }
                    else {
                        file = new io.FilePath(null, fileData);
                        uploadFolder._add(file);
                        change.recordAdd(file.getFullName());
                    }
                    this.fireChange(change);
                    return file;
                }
                async getImageSize(file) {
                    const data = await colibri.core.io.apiRequest("GetImageSize", {
                        path: file.getFullName()
                    });
                    if (data.error) {
                        return null;
                    }
                    return {
                        width: data.width,
                        height: data.height
                    };
                }
            }
            io.FileStorage_HTTPServer = FileStorage_HTTPServer;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class SyncFileContentCache {
                constructor(builder) {
                    this._getContent = builder;
                    this.reset();
                }
                reset() {
                    this._map = new Map();
                }
                getContent(file) {
                    const filename = file.getFullName();
                    const entry = this._map.get(filename);
                    if (entry) {
                        if (entry.modTime === file.getModTime()) {
                            return entry.content;
                        }
                        const content = this._getContent(file);
                        entry.modTime = file.getModTime();
                        entry.content = content;
                        return content;
                    }
                    const content = this._getContent(file);
                    this._map.set(filename, new io.ContentEntry(content, file.getModTime()));
                    return content;
                }
                hasFile(file) {
                    return this._map.has(file.getFullName());
                }
            }
            io.SyncFileContentCache = SyncFileContentCache;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var json;
        (function (json) {
            function write(data, name, value, defaultValue) {
                if (value !== defaultValue) {
                    data[name] = value;
                }
            }
            json.write = write;
            function read(data, name, defaultValue) {
                if (name in data) {
                    return data[name];
                }
                return defaultValue;
            }
            json.read = read;
            function getDataValue(data, key) {
                let result = data;
                const keys = key.split(".");
                for (const key of keys) {
                    if (result !== undefined) {
                        result = result[key];
                    }
                }
                return result;
            }
            json.getDataValue = getDataValue;
            function setDataValue(data, key, value) {
                const keys = key.split(".");
                const lastKey = keys[keys.length - 1];
                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (key in data) {
                        data = data[key];
                    }
                    else {
                        data = (data[key] = {});
                    }
                }
                data[lastKey] = value;
            }
            json.setDataValue = setDataValue;
        })(json = core.json || (core.json = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var preferences;
        (function (preferences) {
            class Preferences {
                constructor(preferencesSpace) {
                    this._preferencesSpace = preferencesSpace;
                }
                readData() {
                    if (this._preferencesSpace in window.localStorage) {
                        const str = window.localStorage[this._preferencesSpace];
                        try {
                            return JSON.parse(str);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    return {};
                }
                getPreferencesSpace() {
                    return this._preferencesSpace;
                }
                setValue(key, jsonData) {
                    try {
                        const data = this.readData();
                        data[key] = jsonData;
                        window.localStorage[this._preferencesSpace] = JSON.stringify(data);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                getValue(key, defaultValue = null) {
                    var _a;
                    const data = this.readData();
                    return _a = data[key], (_a !== null && _a !== void 0 ? _a : defaultValue);
                }
            }
            preferences.Preferences = Preferences;
        })(preferences = core.preferences || (core.preferences = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var lang;
    (function (lang) {
        function applyMixins(derivedCtor, baseCtors) {
            baseCtors.forEach(baseCtor => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
                });
            });
        }
        lang.applyMixins = applyMixins;
    })(lang = colibri.lang || (colibri.lang = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.EVENT_ACTION_CHANGED = "actionChanged";
            class Action extends EventTarget {
                constructor(config) {
                    var _a, _b, _c;
                    super();
                    this._text = (_a = config.text, (_a !== null && _a !== void 0 ? _a : ""));
                    this._icon = (_b = config.icon, (_b !== null && _b !== void 0 ? _b : null));
                    this._enabled = config.enabled === undefined || config.enabled;
                    this._callback = (_c = config.callback, (_c !== null && _c !== void 0 ? _c : null));
                }
                isEnabled() {
                    return this._enabled;
                }
                getText() {
                    return this._text;
                }
                getIcon() {
                    return this._icon;
                }
                run(e) {
                    if (this._callback) {
                        this._callback();
                    }
                }
            }
            controls.Action = Action;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Control.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class CanvasControl extends controls.Control {
                constructor(padding = 0, ...classList) {
                    super("canvas", "CanvasControl", ...classList);
                    this._padding = padding;
                    this._canvas = this.getElement();
                    this.initContext();
                }
                getCanvas() {
                    return this._canvas;
                }
                resizeTo(parent) {
                    parent = parent || this.getElement().parentElement;
                    const b = parent.getBoundingClientRect();
                    this.style.width = ((b.width - this._padding * 2) | 0) + "px";
                    this.style.height = ((b.height - this._padding * 2) | 0) + "px";
                    this.repaint();
                }
                getPadding() {
                    return this._padding;
                }
                ensureCanvasSize() {
                    if (this._canvas.width !== this._canvas.clientWidth || this._canvas.height !== this._canvas.clientHeight) {
                        this._canvas.width = this._canvas.clientWidth;
                        this._canvas.height = this._canvas.clientHeight;
                        this.initContext();
                    }
                }
                clear() {
                    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
                }
                repaint() {
                    this.ensureCanvasSize();
                    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
                    this.paint();
                }
                initContext() {
                    this._context = this.getCanvas().getContext("2d");
                    this._context.imageSmoothingEnabled = false;
                    this._context.font = `${controls.FONT_HEIGHT}px sans-serif`;
                }
            }
            controls.CanvasControl = CanvasControl;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class DefaultImage {
                constructor(img, url) {
                    this._imageElement = img;
                    this._url = url;
                    this._ready = false;
                    this._error = false;
                }
                preloadSize() {
                    return this.preload();
                }
                getImageElement() {
                    return this._imageElement;
                }
                getURL() {
                    return this._url;
                }
                preload() {
                    if (this._ready || this._error) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                    if (this._requestPromise) {
                        return this._requestPromise;
                    }
                    this._requestPromise = new Promise((resolve, reject) => {
                        this._imageElement.src = this._url;
                        this._imageElement.addEventListener("load", e => {
                            this._requestPromise = null;
                            this._ready = true;
                            resolve(controls.PreloadResult.RESOURCES_LOADED);
                        });
                        this._imageElement.addEventListener("error", e => {
                            console.error("ERROR: Loading image " + this._url);
                            this._requestPromise = null;
                            this._error = true;
                            resolve(controls.PreloadResult.NOTHING_LOADED);
                        });
                    });
                    return this._requestPromise;
                    /*
                    return this._img.decode().then(_ => {
                        this._ready = true;
                        return Controls.resolveResourceLoaded();
                    }).catch(e => {
                        this._ready = true;
                        console.error("ERROR: Cannot decode " + this._url);
                        console.error(e);
                        return Controls.resolveNothingLoaded();
                    });
                    */
                }
                getWidth() {
                    return this._ready ? this._imageElement.naturalWidth : 16;
                }
                getHeight() {
                    return this._ready ? this._imageElement.naturalHeight : 16;
                }
                paint(context, x, y, w, h, center) {
                    if (this._ready) {
                        DefaultImage.paintImageElement(context, this._imageElement, x, y, w, h, center);
                    }
                    else {
                        DefaultImage.paintEmpty(context, x, y, w, h);
                    }
                }
                static paintImageElement(context, image, x, y, w, h, center) {
                    const naturalWidth = image.naturalWidth;
                    const naturalHeight = image.naturalHeight;
                    let renderHeight = h;
                    let renderWidth = w;
                    let imgW = naturalWidth;
                    let imgH = naturalHeight;
                    // compute the right width
                    imgW = imgW * (renderHeight / imgH);
                    imgH = renderHeight;
                    // fix width if it goes beyond the area
                    if (imgW > renderWidth) {
                        imgH = imgH * (renderWidth / imgW);
                        imgW = renderWidth;
                    }
                    let scale = imgW / naturalWidth;
                    let imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
                    let imgY = y + renderHeight / 2 - imgH / 2;
                    let imgDstW = naturalWidth * scale;
                    let imgDstH = naturalHeight * scale;
                    if (imgDstW > 0 && imgDstH > 0) {
                        context.drawImage(image, imgX, imgY, imgDstW, imgDstH);
                    }
                }
                static paintEmpty(context, x, y, w, h) {
                    if (w > 10 && h > 10) {
                        context.save();
                        context.strokeStyle = controls.Controls.getTheme().viewerForeground;
                        const cx = x + w / 2;
                        const cy = y + h / 2;
                        context.strokeRect(cx, cy - 1, 2, 2);
                        context.strokeRect(cx - 5, cy - 1, 2, 2);
                        context.strokeRect(cx + 5, cy - 1, 2, 2);
                        context.restore();
                    }
                }
                static paintImageElementFrame(context, image, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    context.drawImage(image, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
                }
                paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    if (this._ready) {
                        DefaultImage.paintImageElementFrame(context, this._imageElement, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
                    }
                    else {
                        DefaultImage.paintEmpty(context, dstX, dstY, dstW, dstH);
                    }
                }
            }
            controls.DefaultImage = DefaultImage;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.EmptyProgressMonitor = {
                addTotal: (n) => { },
                step: () => { }
            };
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class FillLayout {
                constructor(padding = 0) {
                    this._padding = 0;
                    this._padding = padding;
                }
                getPadding() {
                    return this._padding;
                }
                setPadding(padding) {
                    this._padding = padding;
                }
                layout(parent) {
                    const children = parent.getChildren();
                    if (children.length > 1) {
                        console.warn("[FillLayout] Invalid number for children or parent control.");
                    }
                    const b = parent.getBounds();
                    controls.setElementBounds(parent.getElement(), b);
                    if (children.length > 0) {
                        const child = children[0];
                        child.setBoundsValues(this._padding, this._padding, b.width - this._padding * 2, b.height - this._padding * 2);
                    }
                }
            }
            controls.FillLayout = FillLayout;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class FrameData {
                constructor(index, src, dst, srcSize) {
                    this.index = index;
                    this.src = src;
                    this.dst = dst;
                    this.srcSize = srcSize;
                }
                static fromRect(index, rect) {
                    return new FrameData(0, rect.clone(), new controls.Rect(0, 0, rect.w, rect.h), new controls.Point(rect.w, rect.h));
                }
            }
            controls.FrameData = FrameData;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="CanvasControl.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ImageControl extends controls.CanvasControl {
                constructor(padding = 0, ...classList) {
                    super(padding, "ImageControl", ...classList);
                }
                setImage(image) {
                    this._image = image;
                }
                getImage() {
                    return this._image;
                }
                async paint() {
                    if (this._image) {
                        this.paint2();
                        const result = await this._image.preload();
                        if (result === controls.PreloadResult.RESOURCES_LOADED) {
                            this.paint2();
                        }
                    }
                    else {
                        this.clear();
                    }
                }
                paint2() {
                    this.ensureCanvasSize();
                    this.clear();
                    this._image.paint(this._context, 0, 0, this._canvas.width, this._canvas.height, true);
                }
            }
            controls.ImageControl = ImageControl;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ImageFrame {
                constructor(name, image, frameData) {
                    this._name = name;
                    this._image = image;
                    this._frameData = frameData;
                }
                preloadSize() {
                    return this.preload();
                }
                getName() {
                    return this._name;
                }
                getImage() {
                    return this._image;
                }
                getFrameData() {
                    return this._frameData;
                }
                paint(context, x, y, w, h, center) {
                    const img = this._image;
                    if (!img) {
                        return;
                    }
                    const fd = this._frameData;
                    const renderWidth = w;
                    const renderHeight = h;
                    let imgW = fd.src.w;
                    let imgH = fd.src.h;
                    // compute the right width
                    imgW = imgW * (renderHeight / imgH);
                    imgH = renderHeight;
                    // fix width if it goes beyond the area
                    if (imgW > renderWidth) {
                        imgH = imgH * (renderWidth / imgW);
                        imgW = renderWidth;
                    }
                    const scale = imgW / fd.src.w;
                    var imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
                    var imgY = y + renderHeight / 2 - imgH / 2;
                    // here we use the trimmed version of the image, maybe this should be parametrized
                    const imgDstW = fd.src.w * scale;
                    const imgDstH = fd.src.h * scale;
                    if (imgDstW > 0 && imgDstH > 0) {
                        img.paintFrame(context, fd.src.x, fd.src.y, fd.src.w, fd.src.h, imgX, imgY, imgDstW, imgDstH);
                    }
                }
                paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    // not implemented fow now
                }
                preload() {
                    if (this._image === null) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                    return this._image.preload();
                }
                getWidth() {
                    return this._frameData.srcSize.x;
                }
                getHeight() {
                    return this._frameData.srcSize.y;
                }
            }
            controls.ImageFrame = ImageFrame;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ImageWrapper {
                constructor(imageElement) {
                    this._imageElement = imageElement;
                }
                paint(context, x, y, w, h, center) {
                    if (this._imageElement) {
                        controls.DefaultImage.paintImageElement(context, this._imageElement, x, y, w, h, center);
                    }
                    else {
                        controls.DefaultImage.paintEmpty(context, x, y, w, h);
                    }
                }
                paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
                    if (this._imageElement) {
                        controls.DefaultImage.paintImageElementFrame(context, this._imageElement, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
                    }
                    else {
                        controls.DefaultImage.paintEmpty(context, dstX, dstY, dstW, dstH);
                    }
                }
                preload() {
                    return controls.Controls.resolveNothingLoaded();
                }
                preloadSize() {
                    return this.preload();
                }
                getWidth() {
                    if (this._imageElement) {
                        return this._imageElement.naturalWidth;
                    }
                    return 0;
                }
                getHeight() {
                    if (this._imageElement) {
                        return this._imageElement.naturalHeight;
                    }
                    return 0;
                }
            }
            controls.ImageWrapper = ImageWrapper;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Menu {
                constructor() {
                    this._actions = [];
                }
                setMenuClosedCallback(callback) {
                    this._menuCloseCallback = callback;
                }
                add(action) {
                    this._actions.push(action);
                }
                addSeparator() {
                    this._actions.push(null);
                }
                isEmpty() {
                    return this._actions.length === 0;
                }
                getElement() {
                    return this._element;
                }
                static getActiveMenu() {
                    return this._activeMenu;
                }
                create(e) {
                    Menu._activeMenu = this;
                    this._element = document.createElement("ul");
                    this._element.classList.add("Menu");
                    let lastIsSeparator = true;
                    for (const action of this._actions) {
                        if (action === null) {
                            if (!lastIsSeparator) {
                                lastIsSeparator = true;
                                const sepElement = document.createElement("li");
                                sepElement.classList.add("MenuItemSeparator");
                                this._element.appendChild(sepElement);
                            }
                            continue;
                        }
                        lastIsSeparator = false;
                        const item = document.createElement("li");
                        item.classList.add("MenuItem");
                        item.innerText = action.getText();
                        if (action.isEnabled()) {
                            item.addEventListener("click", e => {
                                this.close();
                                action.run();
                            });
                        }
                        else {
                            item.classList.add("MenuItemDisabled");
                        }
                        this._element.appendChild(item);
                    }
                    this._bgElement = document.createElement("div");
                    this._bgElement.classList.add("MenuContainer");
                    this._bgElement.addEventListener("mousedown", e => {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        this.close();
                    });
                    document.body.appendChild(this._bgElement);
                    document.body.appendChild(this._element);
                    let x = e.clientX;
                    let y = e.clientY;
                    const rect = this._element.getClientRects()[0];
                    if (y + rect.height > window.innerHeight) {
                        y -= rect.height;
                    }
                    if (x + rect.width > window.innerWidth) {
                        x -= rect.width;
                    }
                    this._element.style.left = x + "px";
                    this._element.style.top = y + "px";
                }
                close() {
                    Menu._activeMenu = null;
                    this._bgElement.remove();
                    this._element.remove();
                    if (this._menuCloseCallback) {
                        this._menuCloseCallback();
                    }
                }
            }
            Menu._activeMenu = null;
            controls.Menu = Menu;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Point {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }
            controls.Point = Point;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Rect {
                constructor(x = 0, y = 0, w = 0, h = 0) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                }
                set(x, y, w, h) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                }
                contains(x, y) {
                    return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
                }
                clone() {
                    return new Rect(this.x, this.y, this.w, this.h);
                }
            }
            controls.Rect = Rect;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ScrollPane extends controls.Control {
                constructor(clientControl) {
                    super("div", "ScrollPane");
                    this._clientContentHeight = 0;
                    this._startDragY = -1;
                    this._startScrollY = 0;
                    this._clientControl = clientControl;
                    this.add(this._clientControl);
                    this._scrollBar = document.createElement("div");
                    this._scrollBar.classList.add("ScrollBar");
                    this.getElement().appendChild(this._scrollBar);
                    this._scrollHandler = document.createElement("div");
                    this._scrollHandler.classList.add("ScrollHandler");
                    this._scrollBar.appendChild(this._scrollHandler);
                    const l2 = (e) => this.onMouseDown(e);
                    const l3 = (e) => this.onMouseUp(e);
                    const l4 = (e) => this.onMouseMove(e);
                    const l5 = (e) => {
                        if (!this.getElement().isConnected) {
                            window.removeEventListener("mousedown", l2);
                            window.removeEventListener("mouseup", l3);
                            window.removeEventListener("mousemove", l4);
                            window.removeEventListener("mousemove", l5);
                        }
                    };
                    window.addEventListener("mousedown", l2);
                    window.addEventListener("mouseup", l3);
                    window.addEventListener("mousemove", l4);
                    window.addEventListener("mousemove", l5);
                    this.getViewer().getElement().addEventListener("wheel", e => this.onClientWheel(e));
                    this._scrollBar.addEventListener("mousedown", e => this.onBarMouseDown(e));
                }
                getViewer() {
                    if (this._clientControl instanceof controls.viewers.ViewerContainer) {
                        return this._clientControl.getViewer();
                    }
                    return this._clientControl;
                }
                updateScroll(clientContentHeight) {
                    const scrollY = this.getViewer().getScrollY();
                    const b = this.getBounds();
                    let newScrollY = scrollY;
                    newScrollY = Math.max(-this._clientContentHeight + b.height, newScrollY);
                    newScrollY = Math.min(0, newScrollY);
                    if (newScrollY !== scrollY) {
                        this._clientContentHeight = clientContentHeight;
                        this.setClientScrollY(scrollY);
                    }
                    else if (clientContentHeight !== this._clientContentHeight) {
                        this._clientContentHeight = clientContentHeight;
                        this.layout();
                    }
                }
                onBarMouseDown(e) {
                    if (e.target !== this._scrollBar) {
                        return;
                    }
                    e.stopImmediatePropagation();
                    const b = this.getBounds();
                    this.setClientScrollY(-e.offsetY / b.height * (this._clientContentHeight - b.height));
                }
                onClientWheel(e) {
                    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
                        return;
                    }
                    let y = this.getViewer().getScrollY();
                    y += e.deltaY < 0 ? 30 : -30;
                    this.setClientScrollY(y);
                }
                setClientScrollY(y) {
                    const b = this.getBounds();
                    y = Math.max(-this._clientContentHeight + b.height, y);
                    y = Math.min(0, y);
                    this.getViewer().setScrollY(y);
                    this.layout();
                }
                onMouseDown(e) {
                    if (e.target === this._scrollHandler) {
                        e.stopImmediatePropagation();
                        this._startDragY = e.y;
                        this._startScrollY = this.getViewer().getScrollY();
                    }
                }
                onMouseMove(e) {
                    if (this._startDragY !== -1) {
                        let delta = e.y - this._startDragY;
                        const b = this.getBounds();
                        delta = delta / b.height * this._clientContentHeight;
                        this.setClientScrollY(this._startScrollY - delta);
                    }
                }
                onMouseUp(e) {
                    if (this._startDragY !== -1) {
                        e.stopImmediatePropagation();
                        this._startDragY = -1;
                    }
                }
                getBounds() {
                    const b = this.getElement().getBoundingClientRect();
                    return { x: 0, y: 0, width: b.width, height: b.height };
                }
                layout() {
                    const b = this.getBounds();
                    if (b.height < this._clientContentHeight) {
                        this._scrollHandler.style.display = "block";
                        const h = Math.max(10, b.height / this._clientContentHeight * b.height);
                        const y = -(b.height - h) * this.getViewer().getScrollY() / (this._clientContentHeight - b.height);
                        controls.setElementBounds(this._scrollHandler, {
                            y: y,
                            height: h
                        });
                        this.removeClass("hideScrollBar");
                    }
                    else {
                        this.addClass("hideScrollBar");
                    }
                    this._clientControl.layout();
                }
            }
            controls.ScrollPane = ScrollPane;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class SplitPanel extends controls.Control {
                constructor(left, right, horizontal = true) {
                    super("div", "split");
                    this._startDrag = -1;
                    this._horizontal = horizontal;
                    this._splitPosition = 50;
                    this._splitFactor = 0.5;
                    this._splitWidth = 2;
                    const l0 = (e) => this.onDragStart(e);
                    const l1 = (e) => this.onMouseLeave(e);
                    const l2 = (e) => this.onMouseDown(e);
                    const l3 = (e) => this.onMouseUp(e);
                    const l4 = (e) => this.onMouseMove(e);
                    const l5 = (e) => {
                        if (!this.getElement().isConnected) {
                            window.removeEventListener("dragstart", l0);
                            window.removeEventListener("mouseleave", l1);
                            window.removeEventListener("mousedown", l2);
                            window.removeEventListener("mouseup", l3);
                            window.removeEventListener("mousemove", l4);
                            window.removeEventListener("mousemove", l5);
                        }
                    };
                    window.addEventListener("dragstart", l0);
                    window.addEventListener("mouseleave", l1);
                    window.addEventListener("mousedown", l2);
                    window.addEventListener("mouseup", l3);
                    window.addEventListener("mousemove", l4);
                    window.addEventListener("mousemove", l5);
                    if (left) {
                        this.setLeftControl(left);
                    }
                    if (right) {
                        this.setRightControl(right);
                    }
                }
                onDragStart(e) {
                    if (this._startDrag !== -1) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                }
                onMouseDown(e) {
                    const pos = this.getControlPosition(e.x, e.y);
                    const offset = this._horizontal ? pos.x : pos.y;
                    const inside = Math.abs(offset - this._splitPosition) <= controls.SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);
                    if (inside) {
                        e.stopImmediatePropagation();
                        this._startDrag = this._horizontal ? e.x : e.y;
                        this._startPos = this._splitPosition;
                    }
                }
                onMouseUp(e) {
                    if (this._startDrag !== -1) {
                        e.stopImmediatePropagation();
                    }
                    this._startDrag = -1;
                }
                onMouseMove(e) {
                    const pos = this.getControlPosition(e.x, e.y);
                    const offset = this._horizontal ? pos.x : pos.y;
                    const screen = this._horizontal ? e.x : e.y;
                    const boundsSize = this._horizontal ? this.getBounds().width : this.getBounds().height;
                    const cursorResize = this._horizontal ? "ew-resize" : "ns-resize";
                    const inside = Math.abs(offset - this._splitPosition) <= controls.SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);
                    if (inside) {
                        if (e.buttons === 0 || this._startDrag !== -1) {
                            e.preventDefault();
                            this.getElement().style.cursor = cursorResize;
                        }
                    }
                    else {
                        this.getElement().style.cursor = "inherit";
                    }
                    if (this._startDrag !== -1) {
                        this.getElement().style.cursor = cursorResize;
                        const newPos = this._startPos + screen - this._startDrag;
                        if (newPos > 100 && boundsSize - newPos > 100) {
                            this._splitPosition = newPos;
                            this._splitFactor = this._splitPosition / boundsSize;
                            this.layout();
                        }
                    }
                }
                onMouseLeave(e) {
                    this.getElement().style.cursor = "inherit";
                    this._startDrag = -1;
                }
                setHorizontal(horizontal = true) {
                    this._horizontal = horizontal;
                }
                setVertical(vertical = true) {
                    this._horizontal = !vertical;
                }
                getSplitFactor() {
                    return this._splitFactor;
                }
                getSize() {
                    const b = this.getBounds();
                    return this._horizontal ? b.width : b.height;
                }
                setSplitFactor(factor) {
                    this._splitFactor = Math.min(Math.max(0, factor), 1);
                    this._splitPosition = this.getSize() * this._splitFactor;
                }
                setLeftControl(control) {
                    this._leftControl = control;
                    this.add(control);
                }
                getLeftControl() {
                    return this._leftControl;
                }
                setRightControl(control) {
                    this._rightControl = control;
                    this.add(control);
                }
                getRightControl() {
                    return this._rightControl;
                }
                layout() {
                    controls.setElementBounds(this.getElement(), this.getBounds());
                    if (!this._leftControl || !this._rightControl) {
                        return;
                    }
                    this.setSplitFactor(this._splitFactor);
                    const pos = this._splitPosition;
                    const sw = this._splitWidth;
                    let b = this.getBounds();
                    if (this._horizontal) {
                        this._leftControl.setBoundsValues(0, 0, pos - sw, b.height);
                        this._rightControl.setBoundsValues(pos + sw, 0, b.width - pos - sw, b.height);
                    }
                    else {
                        this._leftControl.setBoundsValues(0, 0, b.width, pos - sw);
                        this._rightControl.setBoundsValues(0, pos + sw, b.width, b.height - pos - sw);
                    }
                }
            }
            controls.SplitPanel = SplitPanel;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.EVENT_TAB_CLOSED = "tabClosed";
            controls.EVENT_TAB_SELECTED = "tabSelected";
            controls.EVENT_TAB_LABEL_RESIZED = "tabResized";
            class CloseIconManager {
                constructor() {
                    this._element = document.createElement("canvas");
                    this._element.classList.add("TabPaneLabelCloseIcon");
                    this._element.width = controls.ICON_SIZE;
                    this._element.height = controls.ICON_SIZE;
                    this._element.style.width = controls.ICON_SIZE + "px";
                    this._element.style.height = controls.ICON_SIZE + "px";
                    this._context = this._element.getContext("2d");
                    this._element.addEventListener("mouseenter", e => {
                        this.paint(this._overIcon);
                    });
                    this._element.addEventListener("mouseleave", e => {
                        this.paint(this._icon);
                    });
                }
                static setManager(element, manager) {
                    element["__CloseIconManager"] = manager;
                }
                static getManager(element) {
                    return element["__CloseIconManager"];
                }
                setIcon(icon) {
                    this._icon = icon;
                }
                setOverIcon(icon) {
                    this._overIcon = icon;
                }
                getElement() {
                    return this._element;
                }
                repaint() {
                    this.paint(this._icon);
                }
                paint(icon) {
                    if (icon) {
                        this._context.clearRect(0, 0, controls.ICON_SIZE, controls.ICON_SIZE);
                        icon.paint(this._context, 0, 0, controls.ICON_SIZE, controls.ICON_SIZE, true);
                    }
                }
            }
            class TabIconManager {
                constructor(canvas, icon) {
                    this._canvas = canvas;
                    this._icon = icon;
                }
                static createElement(icon, size) {
                    const canvas = document.createElement("canvas");
                    canvas.classList.add("TabCloseIcon");
                    const manager = new TabIconManager(canvas, icon);
                    canvas["__TabIconManager"] = manager;
                    manager.resize(size);
                    return canvas;
                }
                resize(size) {
                    size = Math.max(size, controls.ICON_SIZE);
                    if (this._icon && this._icon.getWidth() === controls.ICON_SIZE && this._icon.getHeight() === controls.ICON_SIZE) {
                        size = controls.ICON_SIZE;
                    }
                    this._canvas.width = this._canvas.height = size;
                    this._canvas.style.width = this._canvas.style.height = size + "px";
                    this.repaint();
                }
                static getManager(canvas) {
                    return canvas["__TabIconManager"];
                }
                setIcon(icon) {
                    this._icon = icon;
                    this.repaint();
                }
                repaint() {
                    const ctx = this._canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = false;
                    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                    if (!this._icon) {
                        return;
                    }
                    const w = this._icon.getWidth();
                    const h = this._icon.getHeight();
                    if (w === controls.ICON_SIZE && h === controls.ICON_SIZE) {
                        this._icon.paint(ctx, (this._canvas.width - w) / 2, (this._canvas.height - h) / 2, w, h, false);
                    }
                    else {
                        this._icon.paint(ctx, 0, 0, this._canvas.width, this._canvas.height, true);
                    }
                }
            }
            class TabPane extends controls.Control {
                constructor(...classList) {
                    super("div", "TabPane", ...classList);
                    this._selectionHistoryLabelElement = [];
                    this._titleBarElement = document.createElement("div");
                    this._titleBarElement.classList.add("TabPaneTitleBar");
                    this.getElement().appendChild(this._titleBarElement);
                    this._contentAreaElement = document.createElement("div");
                    this._contentAreaElement.classList.add("TabPaneContentArea");
                    this.getElement().appendChild(this._contentAreaElement);
                    this._iconSize = controls.ICON_SIZE;
                }
                addTab(label, icon, content, closeable = false, selectIt = true) {
                    const labelElement = this.makeLabel(label, icon, closeable);
                    this._titleBarElement.appendChild(labelElement);
                    labelElement.addEventListener("mousedown", e => {
                        if (TabPane.isTabCloseIcon(e.target)) {
                            return;
                        }
                        this.selectTab(labelElement);
                    });
                    const contentArea = new controls.Control("div", "ContentArea");
                    contentArea.add(content);
                    this._contentAreaElement.appendChild(contentArea.getElement());
                    labelElement["__contentArea"] = contentArea.getElement();
                    if (selectIt) {
                        if (this._titleBarElement.childElementCount === 1) {
                            this.selectTab(labelElement);
                        }
                    }
                }
                getTabIconSize() {
                    return this._iconSize;
                }
                setTabIconSize(size) {
                    this._iconSize = Math.max(controls.ICON_SIZE, size);
                    for (let i = 0; i < this._titleBarElement.children.length; i++) {
                        const label = this._titleBarElement.children.item(i);
                        const iconCanvas = label.firstChild;
                        TabIconManager.getManager(iconCanvas).resize(this._iconSize);
                        this.layout();
                    }
                    this.dispatchEvent(new CustomEvent(controls.EVENT_TAB_LABEL_RESIZED, {}));
                }
                incrementTabIconSize(amount) {
                    this.setTabIconSize(this._iconSize + amount);
                }
                makeLabel(label, icon, closeable) {
                    const labelElement = document.createElement("div");
                    labelElement.classList.add("TabPaneLabel");
                    const tabIconElement = TabIconManager.createElement(icon, this._iconSize);
                    labelElement.appendChild(tabIconElement);
                    const textElement = document.createElement("span");
                    textElement.innerHTML = label;
                    labelElement.appendChild(textElement);
                    if (closeable) {
                        const manager = new CloseIconManager();
                        manager.setIcon(controls.Controls.getIcon(controls.ICON_CONTROL_CLOSE));
                        manager.repaint();
                        manager.getElement().addEventListener("click", e => {
                            e.stopImmediatePropagation();
                            this.closeTabLabel(labelElement);
                        });
                        labelElement.appendChild(manager.getElement());
                        labelElement.classList.add("closeable");
                        CloseIconManager.setManager(labelElement, manager);
                    }
                    return labelElement;
                }
                setTabCloseIcons(labelElement, icon, overIcon) {
                    const manager = CloseIconManager.getManager(labelElement);
                    if (manager) {
                        manager.setIcon(icon);
                        manager.setOverIcon(overIcon);
                        manager.repaint();
                    }
                }
                closeTab(content) {
                    const label = this.getLabelFromContent(content);
                    if (label) {
                        this.closeTabLabel(label);
                    }
                }
                closeAll() {
                    this._titleBarElement.innerHTML = "";
                    this._contentAreaElement.innerHTML = "";
                    this._selectionHistoryLabelElement = [];
                }
                closeTabLabel(labelElement) {
                    {
                        const content = TabPane.getContentFromLabel(labelElement);
                        const event = new CustomEvent(controls.EVENT_TAB_CLOSED, {
                            detail: content,
                            cancelable: true
                        });
                        if (!this.dispatchEvent(event)) {
                            return;
                        }
                    }
                    this._titleBarElement.removeChild(labelElement);
                    const contentArea = labelElement["__contentArea"];
                    this._contentAreaElement.removeChild(contentArea);
                    let toSelectLabel = null;
                    const selectedLabel = this.getSelectedLabelElement();
                    if (selectedLabel === labelElement) {
                        this._selectionHistoryLabelElement.pop();
                        const nextInHistory = this._selectionHistoryLabelElement.pop();
                        if (nextInHistory) {
                            toSelectLabel = nextInHistory;
                        }
                        else {
                            if (this._titleBarElement.childElementCount > 0) {
                                toSelectLabel = this._titleBarElement.firstChild;
                            }
                        }
                    }
                    if (toSelectLabel) {
                        this.selectTab(toSelectLabel);
                    }
                }
                setTabTitle(content, title, icon) {
                    for (let i = 0; i < this._titleBarElement.childElementCount; i++) {
                        const label = this._titleBarElement.children.item(i);
                        const content2 = TabPane.getContentFromLabel(label);
                        if (content2 === content) {
                            const iconElement = label.firstChild;
                            const textElement = iconElement.nextSibling;
                            const manager = TabIconManager.getManager(iconElement);
                            manager.setIcon(icon);
                            manager.repaint();
                            textElement.innerHTML = title;
                        }
                    }
                }
                static isTabCloseIcon(element) {
                    return element.classList.contains("TabPaneLabelCloseIcon");
                }
                static isTabLabel(element) {
                    return element.classList.contains("TabPaneLabel");
                }
                getLabelFromContent(content) {
                    for (let i = 0; i < this._titleBarElement.childElementCount; i++) {
                        const label = this._titleBarElement.children.item(i);
                        const content2 = TabPane.getContentFromLabel(label);
                        if (content2 === content) {
                            return label;
                        }
                    }
                    return null;
                }
                static getContentAreaFromLabel(labelElement) {
                    return labelElement["__contentArea"];
                }
                static getContentFromLabel(labelElement) {
                    return controls.Control.getControlOf(this.getContentAreaFromLabel(labelElement).firstChild);
                }
                selectTabWithContent(content) {
                    const label = this.getLabelFromContent(content);
                    if (label) {
                        this.selectTab(label);
                    }
                }
                selectTab(toSelectLabel) {
                    const selectedLabel = this._selectionHistoryLabelElement.pop();
                    if (selectedLabel) {
                        if (selectedLabel === toSelectLabel) {
                            this._selectionHistoryLabelElement.push(selectedLabel);
                            return;
                        }
                        selectedLabel.classList.remove("selected");
                        const selectedContentArea = TabPane.getContentAreaFromLabel(selectedLabel);
                        selectedContentArea.classList.remove("selected");
                    }
                    toSelectLabel.classList.add("selected");
                    const toSelectContentArea = TabPane.getContentAreaFromLabel(toSelectLabel);
                    toSelectContentArea.classList.add("selected");
                    this._selectionHistoryLabelElement.push(toSelectLabel);
                    this.dispatchEvent(new CustomEvent(controls.EVENT_TAB_SELECTED, {
                        detail: TabPane.getContentFromLabel(toSelectLabel)
                    }));
                    this.dispatchLayoutEvent();
                }
                getSelectedTabContent() {
                    const label = this.getSelectedLabelElement();
                    if (label) {
                        const area = TabPane.getContentAreaFromLabel(label);
                        return controls.Control.getControlOf(area.firstChild);
                    }
                    return null;
                }
                getContentList() {
                    const list = [];
                    for (let i = 0; i < this._titleBarElement.children.length; i++) {
                        const label = this._titleBarElement.children.item(i);
                        const content = TabPane.getContentFromLabel(label);
                        list.push(content);
                    }
                    return list;
                }
                getSelectedLabelElement() {
                    return this._selectionHistoryLabelElement.length > 0 ?
                        this._selectionHistoryLabelElement[this._selectionHistoryLabelElement.length - 1]
                        : null;
                }
            }
            controls.TabPane = TabPane;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ToolbarManager {
                constructor(toolbarElement) {
                    this._toolbarElement = toolbarElement;
                    this._actionDataMap = new Map();
                }
                add(action) {
                    const btnElement = document.createElement("div");
                    btnElement.classList.add("ToolbarItem");
                    btnElement.addEventListener("click", e => {
                        action.run(e);
                    });
                    if (action.getIcon()) {
                        const iconElement = controls.Controls.createIconElement(action.getIcon());
                        btnElement.appendChild(iconElement);
                        btnElement["__icon"] = iconElement;
                    }
                    const textElement = document.createElement("div");
                    btnElement.appendChild(textElement);
                    btnElement["__text"] = textElement;
                    if (action.getText() && action.getIcon()) {
                        btnElement.classList.add("ToolbarItemHasTextAndIcon");
                    }
                    this._toolbarElement.appendChild(btnElement);
                    const listener = e => this.updateButtonWithAction(btnElement, action);
                    action.addEventListener(controls.EVENT_ACTION_CHANGED, listener);
                    this.updateButtonWithAction(btnElement, action);
                    this._actionDataMap.set(action, {
                        btnElement: btnElement,
                        listener: listener
                    });
                }
                dispose() {
                    for (const [action, data] of this._actionDataMap.entries()) {
                        action.removeEventListener(controls.EVENT_ACTION_CHANGED, data.listener);
                        data.btnElement.remove();
                    }
                }
                updateButtonWithAction(btn, action) {
                    const textElement = btn["__text"];
                    textElement.innerText = action.getText();
                }
            }
            controls.ToolbarManager = ToolbarManager;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            controls.CONTROL_PADDING = 3;
            controls.ROW_HEIGHT = 20;
            controls.FONT_HEIGHT = 14;
            controls.FONT_OFFSET = 2;
            controls.ACTION_WIDTH = 20;
            controls.PANEL_BORDER_SIZE = 5;
            controls.PANEL_TITLE_HEIGHT = 22;
            controls.FILTERED_VIEWER_FILTER_HEIGHT = 30;
            controls.SPLIT_OVER_ZONE_WIDTH = 6;
            function setElementBounds(elem, bounds) {
                if (bounds.x !== undefined) {
                    elem.style.left = bounds.x + "px";
                }
                if (bounds.y !== undefined) {
                    elem.style.top = bounds.y + "px";
                }
                if (bounds.width !== undefined) {
                    elem.style.width = bounds.width + "px";
                }
                if (bounds.height !== undefined) {
                    elem.style.height = bounds.height + "px";
                }
            }
            controls.setElementBounds = setElementBounds;
            function getElementBounds(elem) {
                return {
                    x: elem.clientLeft,
                    y: elem.clientTop,
                    width: elem.clientWidth,
                    height: elem.clientHeight
                };
            }
            controls.getElementBounds = getElementBounds;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class Dialog extends controls.Control {
                    constructor(...classList) {
                        super("div", "Dialog", ...classList);
                        this._closeWithEscapeKey = true;
                        this._width = 400;
                        this._height = 300;
                        this._parentDialog = Dialog._dialogs.length === 0 ?
                            null : Dialog._dialogs[Dialog._dialogs.length - 1];
                        if (Dialog._firstTime) {
                            Dialog._firstTime = false;
                            window.addEventListener("keydown", e => {
                                if (e.code === "Escape") {
                                    if (Dialog._dialogs.length > 0) {
                                        const dlg = Dialog._dialogs[Dialog._dialogs.length - 1];
                                        if (dlg.isCloseWithEscapeKey()) {
                                            dlg.close();
                                        }
                                    }
                                }
                            });
                            window.addEventListener(controls.EVENT_THEME_CHANGED, e => {
                                for (const dlg of Dialog._dialogs) {
                                    dlg.layout();
                                }
                            });
                            window.addEventListener("resize", e => {
                                for (const dlg of Dialog._dialogs) {
                                    dlg.layout();
                                }
                            });
                        }
                        Dialog._dialogs.push(this);
                    }
                    static getActiveDialog() {
                        return Dialog._dialogs[Dialog._dialogs.length - 1];
                    }
                    getDialogBackgroundElement() {
                        return this._containerElement;
                    }
                    setCloseWithEscapeKey(closeWithEscapeKey) {
                        this._closeWithEscapeKey = closeWithEscapeKey;
                    }
                    isCloseWithEscapeKey() {
                        return this._closeWithEscapeKey;
                    }
                    getParentDialog() {
                        return this._parentDialog;
                    }
                    create() {
                        this._containerElement = document.createElement("div");
                        this._containerElement.classList.add("DialogContainer");
                        document.body.appendChild(this._containerElement);
                        document.body.appendChild(this.getElement());
                        window.addEventListener("resize", () => this.resize());
                        this._titlePaneElement = document.createElement("div");
                        this._titlePaneElement.classList.add("DialogTitlePane");
                        this.getElement().appendChild(this._titlePaneElement);
                        this.createDialogArea();
                        this._buttonPaneElement = document.createElement("div");
                        this._buttonPaneElement.classList.add("DialogButtonPane");
                        this.getElement().appendChild(this._buttonPaneElement);
                        this.resize();
                        if (this._parentDialog) {
                            this._parentDialog._containerElement.style.display = "none";
                            this._parentDialog.style.display = "none";
                        }
                    }
                    setTitle(title) {
                        this._titlePaneElement.innerText = title;
                    }
                    addButton(text, callback) {
                        const btn = document.createElement("button");
                        btn.innerText = text;
                        btn.addEventListener("click", e => callback());
                        this._buttonPaneElement.appendChild(btn);
                        return btn;
                    }
                    createDialogArea() {
                    }
                    resize() {
                        this.setBounds({
                            x: window.innerWidth / 2 - this._width / 2,
                            y: window.innerHeight * 0.2,
                            width: this._width,
                            height: this._height
                        });
                    }
                    setSize(width, height) {
                        this._width = width;
                        this._height = height;
                    }
                    close() {
                        Dialog._dialogs = Dialog._dialogs.filter(d => d !== this);
                        this._containerElement.remove();
                        this.getElement().remove();
                        if (this._parentDialog) {
                            this._parentDialog._containerElement.style.display = "block";
                            this._parentDialog.style.display = "grid";
                        }
                    }
                    closeAll() {
                        this.close();
                        if (this._parentDialog) {
                            this._parentDialog.closeAll();
                        }
                    }
                }
                Dialog._dialogs = [];
                Dialog._firstTime = true;
                dialogs.Dialog = Dialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Dialog.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class AlertDialog extends dialogs.Dialog {
                    constructor() {
                        super("AlertDialog");
                    }
                    createDialogArea() {
                        this._messageElement = document.createElement("div");
                        this._messageElement.classList.add("DialogClientArea", "DialogSection");
                        this.getElement().appendChild(this._messageElement);
                    }
                    create() {
                        super.create();
                        this.setTitle("Alert");
                        this.addButton("Close", () => {
                            AlertDialog._currentDialog = null;
                            this.close();
                        });
                    }
                    static replaceConsoleAlert() {
                        window["__alert"] = window.alert;
                        window.alert = (msg) => {
                            if (!this._currentDialog) {
                                const dlg = new AlertDialog();
                                dlg.create();
                                this._currentDialog = dlg;
                            }
                            this._currentDialog._messageElement.innerHTML += `<pre>${msg}</pre>`;
                        };
                    }
                }
                dialogs.AlertDialog = AlertDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class InputDialog extends dialogs.Dialog {
                    constructor() {
                        super("InputDialog");
                    }
                    setInputValidator(validator) {
                        this._validator = validator;
                    }
                    setResultCallback(callback) {
                        this._resultCallback = callback;
                    }
                    setMessage(message) {
                        this._messageElement.innerText = message + ":";
                    }
                    setInitialValue(value) {
                        this._textElement.value = value;
                    }
                    createDialogArea() {
                        const area = document.createElement("div");
                        area.classList.add("DialogClientArea", "DialogSection");
                        area.style.display = "grid";
                        area.style.gridTemplateColumns = "1fr";
                        area.style.gridTemplateRows = "min-content min-content";
                        this.getElement().appendChild(area);
                        this._messageElement = document.createElement("label");
                        this._messageElement.innerText = "Enter value:";
                        this._messageElement.classList.add("InputDialogLabel");
                        area.appendChild(this._messageElement);
                        this._textElement = document.createElement("input");
                        this._textElement.type = "text";
                        this._textElement.addEventListener("keyup", e => this.validate());
                        area.appendChild(this._textElement);
                    }
                    validate() {
                        let valid = false;
                        if (this._validator) {
                            valid = this._validator(this._textElement.value);
                        }
                        this._acceptButton.disabled = !valid;
                    }
                    create() {
                        super.create();
                        this._acceptButton = this.addButton("Accept", () => {
                            if (this._resultCallback) {
                                this._resultCallback(this._textElement.value);
                            }
                            this.close();
                        });
                        this.addButton("Cancel", () => this.close());
                        setTimeout(() => this._textElement.focus(), 100);
                    }
                }
                dialogs.InputDialog = InputDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class ProgressDialog extends dialogs.Dialog {
                    constructor() {
                        super("ProgressDialog");
                    }
                    createDialogArea() {
                        this._progressElement = document.createElement("div");
                        this._progressElement.classList.add("ProgressBar");
                        const area = document.createElement("div");
                        area.classList.add("DialogClientArea");
                        area.style.paddingTop = "10px";
                        area.appendChild(this._progressElement);
                        this.getElement().appendChild(area);
                    }
                    create() {
                        super.create();
                        this.getElement().style.height = "auto !important";
                    }
                    setProgress(progress) {
                        this._progressElement.style.width = progress * 100 + "%";
                    }
                }
                dialogs.ProgressDialog = ProgressDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class ProgressDialogMonitor {
                    constructor(dialog) {
                        this._dialog = dialog;
                        this._total = 0;
                        this._step = 0;
                    }
                    updateDialog() {
                        const p = this._step / this._total;
                        this._dialog.setProgress(p);
                    }
                    addTotal(total) {
                        this._total += total;
                        this.updateDialog();
                    }
                    step() {
                        this._step += 1;
                        this.updateDialog();
                    }
                }
                dialogs.ProgressDialogMonitor = ProgressDialogMonitor;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class ViewerDialog extends dialogs.Dialog {
                    constructor(viewer) {
                        super("ViewerDialog");
                        this._viewer = viewer;
                    }
                    createDialogArea() {
                        this._filteredViewer = new controls.viewers.FilteredViewer(this._viewer, "DialogClientArea");
                        this.add(this._filteredViewer);
                        this._filteredViewer.getFilterControl().getFilterElement().focus();
                    }
                    getViewer() {
                        return this._viewer;
                    }
                }
                dialogs.ViewerDialog = ViewerDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var properties;
            (function (properties) {
                class PropertySectionPane extends controls.Control {
                    constructor(page, section) {
                        super();
                        this._page = page;
                        this._section = section;
                        this.addClass("PropertySectionPane");
                    }
                    createOrUpdateWithSelection() {
                        if (!this._formArea) {
                            this._titleArea = document.createElement("div");
                            this._titleArea.classList.add("PropertyTitleArea");
                            this._expandIconElement = document.createElement("canvas");
                            this._expandIconElement.classList.add("expanded");
                            this._expandIconElement.style.width = (this._expandIconElement.width = controls.ICON_SIZE) + "px";
                            this._expandIconElement.style.height = (this._expandIconElement.height = controls.ICON_SIZE) + "px";
                            this._expandIconElement.addEventListener("mouseup", () => this.toggleSection());
                            this._titleArea.appendChild(this._expandIconElement);
                            this._expandIconContext = this._expandIconElement.getContext("2d");
                            this._expandIconContext.imageSmoothingEnabled = false;
                            const label = document.createElement("label");
                            label.innerText = this._section.getTitle();
                            label.addEventListener("mouseup", () => this.toggleSection());
                            this._titleArea.appendChild(label);
                            this._formArea = document.createElement("div");
                            this._formArea.classList.add("PropertyFormArea");
                            this._section.create(this._formArea);
                            this.getElement().appendChild(this._titleArea);
                            this.getElement().appendChild(this._formArea);
                            this.updateExpandIcon();
                        }
                        this._section.updateWithSelection();
                    }
                    isExpanded() {
                        return this._expandIconElement.classList.contains("expanded");
                    }
                    toggleSection() {
                        if (this.isExpanded()) {
                            this._formArea.style.display = "none";
                            this._expandIconElement.classList.remove("expanded");
                        }
                        else {
                            this._formArea.style.display = "grid";
                            this._expandIconElement.classList.add("expanded");
                        }
                        this._page.updateExpandStatus();
                        this.getContainer().dispatchLayoutEvent();
                        this.updateExpandIcon();
                    }
                    updateExpandIcon() {
                        const w = this._expandIconElement.width;
                        const h = this._expandIconElement.height;
                        this._expandIconContext.clearRect(0, 0, w, h);
                        const icon = this.isExpanded() ? controls.ICON_CONTROL_TREE_COLLAPSE : controls.ICON_CONTROL_TREE_EXPAND;
                        const image = controls.Controls.getIcon(icon);
                        image.paint(this._expandIconContext, 0, 0, w, h, false);
                    }
                    getSection() {
                        return this._section;
                    }
                    getFormArea() {
                        return this._formArea;
                    }
                }
                class PropertyPage extends controls.Control {
                    constructor() {
                        super("div");
                        this.addClass("PropertyPage");
                        this._sectionPanes = [];
                        this._sectionPaneMap = new Map();
                        this._selection = [];
                    }
                    build() {
                        if (this._sectionProvider) {
                            const list = [];
                            this._sectionProvider.addSections(this, list);
                            for (const section of list) {
                                if (!this._sectionPaneMap.has(section.getId())) {
                                    const pane = new PropertySectionPane(this, section);
                                    this.add(pane);
                                    this._sectionPaneMap.set(section.getId(), pane);
                                    this._sectionPanes.push(pane);
                                }
                            }
                            const sectionIdList = list.map(section => section.getId());
                            for (const pane of this._sectionPanes) {
                                const index = sectionIdList.indexOf(pane.getSection().getId());
                                pane.getElement().style.order = index.toString();
                            }
                            this.updateWithSelection();
                        }
                        else {
                            for (const pane of this._sectionPanes) {
                                pane.getElement().style.display = "none";
                            }
                        }
                    }
                    updateWithSelection() {
                        if (!this._sectionProvider) {
                            return;
                        }
                        const list = [];
                        this._sectionProvider.addSections(this, list);
                        const sectionIdSet = new Set();
                        for (const section of list) {
                            sectionIdSet.add(section.getId());
                        }
                        const n = this._selection.length;
                        for (const pane of this._sectionPanes) {
                            const section = pane.getSection();
                            let show = false;
                            if (section.canEditNumber(n)) {
                                show = true;
                                for (const obj of this._selection) {
                                    if (!section.canEdit(obj, n)) {
                                        show = false;
                                        break;
                                    }
                                }
                            }
                            show = show && sectionIdSet.has(section.getId());
                            if (show) {
                                pane.getElement().style.display = "grid";
                                pane.createOrUpdateWithSelection();
                            }
                            else {
                                pane.getElement().style.display = "none";
                            }
                        }
                        this.updateExpandStatus();
                    }
                    updateExpandStatus() {
                        const list = [];
                        this._sectionProvider.addSections(this, list);
                        const sectionIdList = list.map(section => section.getId());
                        const sortedPanes = this._sectionPanes
                            .map(p => p)
                            .sort((a, b) => sectionIdList.indexOf(a.getSection().getId()) - sectionIdList.indexOf(b.getSection().getId()));
                        let templateRows = "";
                        for (const pane of sortedPanes) {
                            if (pane.style.display !== "none") {
                                pane.createOrUpdateWithSelection();
                                if (pane.isExpanded()) {
                                    templateRows += " " + (pane.getSection().isFillSpace() ? "1fr" : "min-content");
                                }
                                else {
                                    templateRows += " min-content";
                                }
                            }
                        }
                        this.getElement().style.gridTemplateRows = templateRows + " ";
                    }
                    getSelection() {
                        return this._selection;
                    }
                    setSelection(sel) {
                        this._selection = sel;
                        this.updateWithSelection();
                    }
                    setSectionProvider(provider) {
                        this._sectionProvider = provider;
                        this.build();
                    }
                    getSectionProvider() {
                        return this._sectionProvider;
                    }
                }
                properties.PropertyPage = PropertyPage;
            })(properties = controls.properties || (controls.properties = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var properties;
            (function (properties) {
                class PropertySection {
                    constructor(page, id, title, fillSpace = false) {
                        this._page = page;
                        this._id = id;
                        this._title = title;
                        this._fillSpace = fillSpace;
                        this._updaters = [];
                    }
                    updateWithSelection() {
                        for (const updater of this._updaters) {
                            updater();
                        }
                    }
                    addUpdater(updater) {
                        this._updaters.push(updater);
                    }
                    isFillSpace() {
                        return this._fillSpace;
                    }
                    getPage() {
                        return this._page;
                    }
                    getSelection() {
                        return this._page.getSelection();
                    }
                    getId() {
                        return this._id;
                    }
                    getTitle() {
                        return this._title;
                    }
                    create(parent) {
                        this.createForm(parent);
                    }
                    flatValues_Number(values) {
                        const set = new Set(values);
                        if (set.size == 1) {
                            const value = set.values().next().value;
                            return value.toString();
                        }
                        return "";
                    }
                    flatValues_StringJoin(values) {
                        return values.join(",");
                    }
                    createGridElement(parent, cols = 0, simpleProps = true) {
                        const div = document.createElement("div");
                        div.classList.add("formGrid");
                        if (cols > 0) {
                            div.classList.add("formGrid-cols-" + cols);
                        }
                        if (simpleProps) {
                            div.classList.add("formSimpleProps");
                        }
                        parent.appendChild(div);
                        return div;
                    }
                    createLabel(parent, text = "") {
                        const label = document.createElement("label");
                        label.classList.add("formLabel");
                        label.innerText = text;
                        parent.appendChild(label);
                        return label;
                    }
                    createButton(parent, text, callback) {
                        const btn = document.createElement("button");
                        btn.innerText = text;
                        btn.addEventListener("click", e => callback());
                        parent.appendChild(btn);
                        return btn;
                    }
                    createText(parent, readOnly = false) {
                        const text = document.createElement("input");
                        text.type = "text";
                        text.classList.add("formText");
                        text.readOnly = readOnly;
                        parent.appendChild(text);
                        return text;
                    }
                    createCheckbox(parent) {
                        const check = document.createElement("input");
                        check.type = "checkbox";
                        check.classList.add("formCheckbox");
                        parent.appendChild(check);
                        return check;
                    }
                }
                properties.PropertySection = PropertySection;
            })(properties = controls.properties || (controls.properties = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var properties;
            (function (properties) {
                class PropertySectionProvider {
                }
                properties.PropertySectionProvider = PropertySectionProvider;
            })(properties = controls.properties || (controls.properties = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                viewers.EMPTY_ARRAY = [];
                class ArrayTreeContentProvider {
                    getRoots(input) {
                        // ok, we assume the input is an array
                        return input;
                    }
                    getChildren(parent) {
                        return viewers.EMPTY_ARRAY;
                    }
                }
                viewers.ArrayTreeContentProvider = ArrayTreeContentProvider;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class EmptyCellRenderer {
                    constructor(variableSize = true) {
                        this._variableSize = variableSize;
                    }
                    renderCell(args) {
                    }
                    cellHeight(args) {
                        return this._variableSize ? args.viewer.getCellSize() : controls.ROW_HEIGHT;
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.EmptyCellRenderer = EmptyCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class EmptyCellRendererProvider {
                    constructor(getRenderer) {
                        this._getRenderer = (getRenderer !== null && getRenderer !== void 0 ? getRenderer : ((e) => new viewers.EmptyCellRenderer()));
                    }
                    getCellRenderer(element) {
                        return this._getRenderer(element);
                    }
                    preload(obj) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.EmptyCellRendererProvider = EmptyCellRendererProvider;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class EmptyTreeContentProvider {
                    getRoots(input) {
                        return viewers.EMPTY_ARRAY;
                    }
                    getChildren(parent) {
                        return viewers.EMPTY_ARRAY;
                    }
                }
                viewers.EmptyTreeContentProvider = EmptyTreeContentProvider;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class FilterControl extends controls.Control {
                    constructor() {
                        super("div", "FilterControl");
                        this.setLayoutChildren(false);
                        this._filterElement = document.createElement("input");
                        this.getElement().appendChild(this._filterElement);
                    }
                    getFilterElement() {
                        return this._filterElement;
                    }
                }
                class ViewerContainer extends controls.Control {
                    constructor(viewer) {
                        super("div", "ViewerContainer");
                        this._viewer = viewer;
                        this.add(viewer);
                        setTimeout(() => this.layout(), 1);
                    }
                    getViewer() {
                        return this._viewer;
                    }
                    layout() {
                        const b = this.getElement().getBoundingClientRect();
                        this._viewer.setBoundsValues(b.left, b.top, b.width, b.height);
                    }
                }
                viewers.ViewerContainer = ViewerContainer;
                class FilteredViewer extends controls.Control {
                    constructor(viewer, ...classList) {
                        super("div", "FilteredViewer", ...classList);
                        this._viewer = viewer;
                        this._filterControl = new FilterControl();
                        this._filterControl.getFilterElement().addEventListener("input", e => this.onFilterInput(e));
                        this.add(this._filterControl);
                        this._viewerContainer = new ViewerContainer(this._viewer);
                        this._scrollPane = new controls.ScrollPane(this._viewerContainer);
                        this.add(this._scrollPane);
                        this.setLayoutChildren(false);
                    }
                    onFilterInput(e) {
                        const value = this._filterControl.getFilterElement().value;
                        this._viewer.setFilterText(value);
                        this._viewer.repaint();
                    }
                    getViewer() {
                        return this._viewer;
                    }
                    layout() {
                        this._viewerContainer.layout();
                        this._scrollPane.layout();
                    }
                    getFilterControl() {
                        return this._filterControl;
                    }
                }
                viewers.FilteredViewer = FilteredViewer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class FilteredViewerInElement extends viewers.FilteredViewer {
                    constructor(viewer, ...classList) {
                        super(viewer, ...classList);
                        this.setHandlePosition(false);
                        this.style.position = "relative";
                        this.style.height = "100%";
                        this.resizeTo();
                    }
                    resizeTo() {
                        setTimeout(() => {
                            const parent = this.getElement().parentElement;
                            if (parent) {
                                this.setBounds({
                                    width: parent.clientWidth,
                                    height: parent.clientHeight
                                });
                            }
                            this.getViewer().repaint();
                        }, 10);
                    }
                }
                viewers.FilteredViewerInElement = FilteredViewerInElement;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class FolderCellRenderer {
                    constructor(maxCount = 8) {
                        this._maxCount = maxCount;
                    }
                    renderCell(args) {
                        if (this.cellHeight(args) === controls.ROW_HEIGHT) {
                            this.renderFolder(args);
                        }
                        else {
                            this.renderGrid(args);
                        }
                    }
                    renderFolder(args) {
                        // const icon = ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_FOLDER);
                        // icon.paint(args.canvasContext, args.x, args.y, args.w, args.h, true);
                    }
                    async preload(args) {
                        const viewer = args.viewer;
                        const obj = args.obj;
                        let result = controls.PreloadResult.NOTHING_LOADED;
                        const contentProvider = args.viewer.getContentProvider();
                        const children = contentProvider.getChildren(obj);
                        for (const child of children) {
                            const renderer = viewer.getCellRendererProvider().getCellRenderer(child);
                            const args2 = args.clone();
                            args2.obj = child;
                            const result2 = await renderer.preload(args2);
                            result = Math.max(result, result2);
                        }
                        return Promise.resolve(result);
                    }
                    renderGrid(args) {
                        const contentProvider = args.viewer.getContentProvider();
                        const children = contentProvider.getChildren(args.obj);
                        const width = args.w;
                        const height = args.h - 2;
                        if (children) {
                            const realCount = children.length;
                            if (realCount === 0) {
                                return;
                            }
                            let frameCount = realCount;
                            if (frameCount == 0) {
                                return;
                            }
                            let step = 1;
                            if (frameCount > this._maxCount) {
                                step = frameCount / this._maxCount;
                                frameCount = this._maxCount;
                            }
                            if (frameCount === 0) {
                                frameCount = 1;
                            }
                            var size = Math.floor(Math.sqrt(width * height / frameCount) * 0.8) + 1;
                            if (frameCount === 1) {
                                size = Math.min(width, height);
                            }
                            var cols = Math.floor(width / size);
                            var rows = frameCount / cols + (frameCount % cols == 0 ? 0 : 1);
                            var marginX = Math.max(0, (width - cols * size) / 2) | 0;
                            var marginY = Math.max(0, (height - rows * size) / 2) | 0;
                            var itemX = 0;
                            var itemY = 0;
                            const startX = args.x + marginX;
                            const startY = 2 + args.y + marginY;
                            for (var i = 0; i < frameCount; i++) {
                                if (itemY + size > height) {
                                    break;
                                }
                                const index = Math.min(realCount - 1, Math.round(i * step));
                                const obj = children[index];
                                const renderer = args.viewer.getCellRendererProvider().getCellRenderer(obj);
                                const args2 = new viewers.RenderCellArgs(args.canvasContext, startX + itemX, startY + itemY, size, size, obj, args.viewer, true);
                                renderer.renderCell(args2);
                                itemX += size;
                                if (itemX + size > width) {
                                    itemY += size;
                                    itemX = 0;
                                }
                            }
                        }
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize() < 50 ? controls.ROW_HEIGHT : args.viewer.getCellSize();
                    }
                }
                viewers.FolderCellRenderer = FolderCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class TreeViewerRenderer {
                    constructor(viewer, cellSize = controls.ROW_HEIGHT) {
                        this._viewer = viewer;
                        this._viewer.setCellSize(cellSize);
                    }
                    getViewer() {
                        return this._viewer;
                    }
                    paint() {
                        const viewer = this._viewer;
                        let x = 0;
                        let y = viewer.getScrollY();
                        const contentProvider = viewer.getContentProvider();
                        const roots = contentProvider.getRoots(viewer.getInput());
                        const treeIconList = [];
                        const paintItems = [];
                        this.paintItems(roots, treeIconList, paintItems, null, x, y);
                        let contentHeight = Number.MIN_VALUE;
                        for (const paintItem of paintItems) {
                            contentHeight = Math.max(paintItem.y + paintItem.h, contentHeight);
                        }
                        contentHeight -= viewer.getScrollY();
                        return {
                            contentHeight: contentHeight,
                            treeIconList: treeIconList,
                            paintItems: paintItems
                        };
                    }
                    paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y) {
                        const viewer = this._viewer;
                        const context = viewer.getContext();
                        const b = viewer.getBounds();
                        for (let obj of objects) {
                            const children = viewer.getContentProvider().getChildren(obj);
                            const expanded = viewer.isExpanded(obj);
                            let newParentPaintItem = null;
                            if (viewer.isFilterIncluded(obj)) {
                                const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);
                                const args = new viewers.RenderCellArgs(context, x + viewers.LABEL_MARGIN, y, b.width - x - viewers.LABEL_MARGIN, 0, obj, viewer);
                                const cellHeight = renderer.cellHeight(args);
                                args.h = cellHeight;
                                viewer.paintItemBackground(obj, 0, y, b.width, cellHeight);
                                if (y > -viewer.getCellSize() && y < b.height) {
                                    // render tree icon
                                    if (children.length > 0) {
                                        const iconY = y + (cellHeight - viewers.TREE_ICON_SIZE) / 2;
                                        const icon = controls.Controls.getIcon(expanded ? controls.ICON_CONTROL_TREE_COLLAPSE : controls.ICON_CONTROL_TREE_EXPAND);
                                        icon.paint(context, x, iconY, controls.ICON_SIZE, controls.ICON_SIZE, false);
                                        treeIconList.push({
                                            rect: new controls.Rect(x, iconY, viewers.TREE_ICON_SIZE, viewers.TREE_ICON_SIZE),
                                            obj: obj
                                        });
                                    }
                                    this.renderTreeCell(args, renderer);
                                }
                                const item = new viewers.PaintItem(paintItems.length, obj, parentPaintItem);
                                item.set(args.x, args.y, args.w, args.h);
                                paintItems.push(item);
                                newParentPaintItem = item;
                                y += cellHeight;
                            }
                            if (expanded) {
                                const result = this.paintItems(children, treeIconList, paintItems, newParentPaintItem, x + viewers.LABEL_MARGIN, y);
                                y = result.y;
                            }
                        }
                        return { x: x, y: y };
                    }
                    renderTreeCell(args, renderer) {
                        const label = args.viewer.getLabelProvider().getLabel(args.obj);
                        let x = args.x;
                        let y = args.y;
                        const ctx = args.canvasContext;
                        ctx.fillStyle = controls.Controls.getTheme().viewerForeground;
                        let args2;
                        if (args.h <= controls.ROW_HEIGHT) {
                            args2 = new viewers.RenderCellArgs(args.canvasContext, args.x, args.y, controls.ICON_SIZE, args.h, args.obj, args.viewer);
                            x += 20;
                            y += 15;
                        }
                        else {
                            args2 = new viewers.RenderCellArgs(args.canvasContext, args.x, args.y, args.w, args.h - 20, args.obj, args.viewer);
                            y += args2.h + 15;
                        }
                        renderer.renderCell(args2);
                        ctx.save();
                        if (args.viewer.isSelected(args.obj)) {
                            ctx.fillStyle = controls.Controls.getTheme().viewerSelectionForeground;
                        }
                        ctx.fillText(label, x, y);
                        ctx.restore();
                    }
                }
                viewers.TreeViewerRenderer = TreeViewerRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./TreeViewerRenderer.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                viewers.TREE_RENDERER_GRID_PADDING = 5;
                class GridTreeViewerRenderer extends viewers.TreeViewerRenderer {
                    constructor(viewer, flat = false, center = false) {
                        super(viewer);
                        viewer.setCellSize(128);
                        this._center = center;
                        this._flat = flat;
                        this._sections = [];
                    }
                    isFlat() {
                        return this._flat;
                    }
                    setSections(sections) {
                        this._sections = sections;
                    }
                    getSections() {
                        return this._sections;
                    }
                    paint() {
                        const result = super.paint();
                        result.contentHeight += 10;
                        return result;
                    }
                    paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y) {
                        const viewer = this.getViewer();
                        const labelProvider = viewer.getLabelProvider();
                        let cellSize = viewer.getCellSize();
                        if (this._flat) {
                            if (cellSize < 64) {
                                cellSize = 64;
                                viewer.setCellSize(cellSize);
                            }
                        }
                        else {
                            if (cellSize <= 48) {
                                return super.paintItems(objects, treeIconList, paintItems, null, x, y);
                            }
                        }
                        const b = viewer.getBounds();
                        if (this._sections.length > 0) {
                            const ctx = viewer.getContext();
                            let y2 = y + 20;
                            let x2 = x + viewers.TREE_RENDERER_GRID_PADDING;
                            let first = true;
                            for (const section of this._sections) {
                                const objects2 = viewer
                                    .getContentProvider()
                                    .getChildren(section)
                                    .filter(obj => viewer.isFilterIncluded(obj));
                                if (objects2.length === 0) {
                                    continue;
                                }
                                if (first) {
                                    first = false;
                                }
                                else {
                                    y2 += 20;
                                }
                                const label = labelProvider.getLabel(section);
                                ctx.save();
                                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                                ctx.fillStyle = "#ff000";
                                ctx.fillRect(0, y2 - 18, b.width, 25);
                                ctx.fillStyle = controls.Controls.getTheme().viewerForeground + "aa";
                                const m = ctx.measureText(label);
                                ctx.fillText(label, b.width / 2 - m.width / 2, y2);
                                ctx.restore();
                                y2 += 20;
                                const result = this.paintItems2(objects2, treeIconList, paintItems, null, x2, y2, viewers.TREE_RENDERER_GRID_PADDING, 0);
                                y2 = result.y + 20;
                                if (result.x > viewers.TREE_RENDERER_GRID_PADDING) {
                                    y2 += cellSize;
                                }
                            }
                            return {
                                x: viewers.TREE_RENDERER_GRID_PADDING,
                                y: y2
                            };
                        }
                        else {
                            const offset = this._center ? Math.floor(b.width % (viewer.getCellSize() + viewers.TREE_RENDERER_GRID_PADDING) / 2) : viewers.TREE_RENDERER_GRID_PADDING;
                            return this.paintItems2(objects, treeIconList, paintItems, null, x + offset, y + viewers.TREE_RENDERER_GRID_PADDING, offset, 0);
                        }
                    }
                    paintItems2(objects, treeIconList, paintItems, parentPaintItem, x, y, offset, depth) {
                        const viewer = this.getViewer();
                        const cellSize = Math.max(controls.ROW_HEIGHT, viewer.getCellSize());
                        const context = viewer.getContext();
                        const b = viewer.getBounds();
                        const included = objects.filter(obj => viewer.isFilterIncluded(obj));
                        const lastObj = included.length === 0 ? null : included[included.length - 1];
                        for (let obj of objects) {
                            const children = viewer.getContentProvider().getChildren(obj);
                            const expanded = viewer.isExpanded(obj);
                            let newParentPaintItem = null;
                            if (viewer.isFilterIncluded(obj)) {
                                const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);
                                const args = new viewers.RenderCellArgs(context, x, y, cellSize, cellSize, obj, viewer, true);
                                this.renderGridCell(args, renderer, depth, obj === lastObj);
                                if (y > -cellSize && y < b.height) {
                                    // render tree icon
                                    if (children.length > 0 && !this._flat) {
                                        const iconY = y + (cellSize - viewers.TREE_ICON_SIZE) / 2;
                                        const icon = controls.Controls.getIcon(expanded ? controls.ICON_CONTROL_TREE_COLLAPSE : controls.ICON_CONTROL_TREE_EXPAND);
                                        icon.paint(context, x + 5, iconY, controls.ICON_SIZE, controls.ICON_SIZE, false);
                                        treeIconList.push({
                                            rect: new controls.Rect(x, iconY, viewers.TREE_ICON_SIZE, viewers.TREE_ICON_SIZE),
                                            obj: obj
                                        });
                                    }
                                }
                                const item = new viewers.PaintItem(paintItems.length, obj, parentPaintItem);
                                item.set(args.x, args.y, args.w, args.h);
                                paintItems.push(item);
                                newParentPaintItem = item;
                                x += cellSize + viewers.TREE_RENDERER_GRID_PADDING;
                                if (x + cellSize > b.width) {
                                    y += cellSize + viewers.TREE_RENDERER_GRID_PADDING;
                                    x = 0 + offset;
                                }
                            }
                            if (expanded && !this._flat) {
                                const result = this.paintItems2(children, treeIconList, paintItems, newParentPaintItem, x, y, offset, depth + 1);
                                y = result.y;
                                x = result.x;
                            }
                        }
                        return {
                            x: x,
                            y: y
                        };
                    }
                    renderGridCell(args, renderer, depth, isLastChild) {
                        const cellSize = args.viewer.getCellSize();
                        const b = args.viewer.getBounds();
                        const lineHeight = 20;
                        let x = args.x;
                        const ctx = args.canvasContext;
                        const label = args.viewer.getLabelProvider().getLabel(args.obj);
                        let line = "";
                        for (const c of label) {
                            const test = line + c;
                            const m = ctx.measureText(test);
                            if (m.width > args.w) {
                                if (line.length > 2) {
                                    line = line.substring(0, line.length - 2) + "..";
                                }
                                break;
                            }
                            else {
                                line += c;
                            }
                        }
                        const selected = args.viewer.isSelected(args.obj);
                        let labelHeight;
                        let visible;
                        {
                            labelHeight = lineHeight;
                            visible = args.y > -(cellSize + labelHeight) && args.y < b.height;
                            if (visible) {
                                this.renderCellBack(args, selected, isLastChild);
                                const args2 = new viewers.RenderCellArgs(args.canvasContext, args.x + 3, args.y + 3, args.w - 6, args.h - 6 - lineHeight, args.obj, args.viewer, args.center);
                                renderer.renderCell(args2);
                                this.renderCellFront(args, selected, isLastChild);
                                args.viewer.paintItemBackground(args.obj, args.x, args.y + args.h - lineHeight, args.w, labelHeight, 10);
                            }
                        }
                        if (visible) {
                            ctx.save();
                            if (selected) {
                                ctx.fillStyle = controls.Controls.getTheme().viewerSelectionForeground;
                            }
                            else {
                                ctx.fillStyle = controls.Controls.getTheme().viewerForeground;
                            }
                            const m = ctx.measureText(line);
                            const x2 = Math.max(x, x + args.w / 2 - m.width / 2);
                            ctx.fillText(line, x2, args.y + args.h - 5);
                            ctx.restore();
                        }
                    }
                    renderCellBack(args, selected, isLastChild) {
                        if (selected) {
                            const ctx = args.canvasContext;
                            ctx.save();
                            ctx.fillStyle = controls.Controls.getTheme().viewerSelectionBackground + "88";
                            ctx.fillRect(args.x, args.y, args.w, args.h);
                            ctx.restore();
                        }
                    }
                    renderCellFront(args, selected, isLastChild) {
                        if (selected) {
                            const ctx = args.canvasContext;
                            ctx.save();
                            ctx.fillStyle = controls.Controls.getTheme().viewerSelectionBackground + "44";
                            ctx.fillRect(args.x, args.y, args.w, args.h);
                            ctx.restore();
                        }
                    }
                }
                viewers.GridTreeViewerRenderer = GridTreeViewerRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../Controls.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class LabelCellRenderer {
                    renderCell(args) {
                        const img = this.getImage(args.obj);
                        let x = args.x;
                        const ctx = args.canvasContext;
                        if (img) {
                            img.paint(ctx, x, args.y, controls.ICON_SIZE, controls.ICON_SIZE, false);
                        }
                    }
                    cellHeight(args) {
                        return controls.ROW_HEIGHT;
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.LabelCellRenderer = LabelCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class ImageCellRenderer {
                    getImage(obj) {
                        return obj;
                    }
                    renderCell(args) {
                        const img = this.getImage(args.obj);
                        if (!img) {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
                        }
                        else {
                            img.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
                        }
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    preload(args) {
                        const img = this.getImage(args.obj);
                        if (img) {
                            return img.preload();
                        }
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.ImageCellRenderer = ImageCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../Rect.ts"/>
/// <reference path="../Controls.ts"/>
/// <reference path="./LabelCellRenderer.ts"/>
/// <reference path="./ImageCellRenderer.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                viewers.EVENT_OPEN_ITEM = "itemOpened";
                class Viewer extends controls.Control {
                    constructor(...classList) {
                        super("canvas", "Viewer");
                        this._labelProvider = null;
                        this._lastSelectedItemIndex = -1;
                        this._contentHeight = 0;
                        this.getElement().tabIndex = 1;
                        this.getElement().draggable = true;
                        this._filterText = "";
                        this._cellSize = 48;
                        this.initContext();
                        this._input = null;
                        this._expandedObjects = new Set();
                        this._selectedObjects = new Set();
                        window.cc = this;
                        this.initListeners();
                    }
                    initListeners() {
                        const canvas = this.getCanvas();
                        canvas.addEventListener("mouseup", e => this.onMouseUp(e));
                        canvas.addEventListener("wheel", e => this.onWheel(e));
                        canvas.addEventListener("keydown", e => this.onKeyDown(e));
                        canvas.addEventListener("dblclick", e => this.onDoubleClick(e));
                        canvas.addEventListener("dragstart", e => this.onDragStart(e));
                    }
                    onKeyDown(e) {
                    }
                    onDragStart(e) {
                        const paintItemUnderCursor = this.getPaintItemAt(e);
                        if (paintItemUnderCursor) {
                            let dragObjects = [];
                            {
                                const sel = this.getSelection();
                                if (new Set(sel).has(paintItemUnderCursor.data)) {
                                    dragObjects = sel;
                                }
                                else {
                                    dragObjects = [paintItemUnderCursor.data];
                                }
                            }
                            controls.Controls.setDragEventImage(e, (ctx, w, h) => {
                                for (const obj of dragObjects) {
                                    const renderer = this.getCellRendererProvider().getCellRenderer(obj);
                                    renderer.renderCell(new viewers.RenderCellArgs(ctx, 0, 0, w, h, obj, this, true));
                                }
                            });
                            const labels = dragObjects.map(obj => this.getLabelProvider().getLabel(obj)).join(",");
                            e.dataTransfer.setData("plain/text", labels);
                            controls.Controls.setApplicationDragData(dragObjects);
                        }
                        else {
                            e.preventDefault();
                        }
                    }
                    getMenu() {
                        return this._menu;
                    }
                    setMenu(menu) {
                        this._menu = menu;
                        if (this._menu) {
                            this._menu.setMenuClosedCallback(() => {
                                this._menu = null;
                            });
                        }
                    }
                    getLabelProvider() {
                        return this._labelProvider;
                    }
                    setLabelProvider(labelProvider) {
                        this._labelProvider = labelProvider;
                    }
                    setFilterText(filterText) {
                        this._filterText = filterText.toLowerCase();
                    }
                    getFilterText() {
                        return this._filterText;
                    }
                    prepareFiltering() {
                        this._filterIncludeSet = new Set();
                        this.buildFilterIncludeMap();
                    }
                    isFilterIncluded(obj) {
                        return this._filterIncludeSet.has(obj);
                    }
                    matches(obj) {
                        const labelProvider = this.getLabelProvider();
                        const filter = this.getFilterText();
                        if (labelProvider === null) {
                            return true;
                        }
                        if (filter === "") {
                            return true;
                        }
                        const label = labelProvider.getLabel(obj);
                        if (label.toLocaleLowerCase().indexOf(filter) !== -1) {
                            return true;
                        }
                        return false;
                    }
                    getPaintItemAt(e) {
                        for (let item of this._paintItems) {
                            if (item.contains(e.offsetX, e.offsetY)) {
                                return item;
                            }
                        }
                        return null;
                    }
                    getSelection() {
                        const sel = [];
                        for (const obj of this._selectedObjects) {
                            sel.push(obj);
                        }
                        return sel;
                    }
                    getSelectionFirstElement() {
                        const sel = this.getSelection();
                        if (sel.length > 0) {
                            return sel[0];
                        }
                        return null;
                    }
                    setSelection(selection, notify = true) {
                        this._selectedObjects = new Set(selection);
                        if (notify) {
                            this.fireSelectionChanged();
                            this.repaint();
                        }
                    }
                    fireSelectionChanged() {
                        this.dispatchEvent(new CustomEvent(controls.EVENT_SELECTION_CHANGED, {
                            detail: this.getSelection()
                        }));
                    }
                    escape() {
                        if (this._selectedObjects.size > 0) {
                            this._selectedObjects.clear();
                            this.repaint();
                            this.fireSelectionChanged();
                        }
                    }
                    onWheel(e) {
                        if (!e.shiftKey) {
                            return;
                        }
                        if (e.deltaY < 0) {
                            this.setCellSize(this.getCellSize() + controls.ROW_HEIGHT);
                        }
                        else if (this._cellSize > controls.ICON_SIZE) {
                            this.setCellSize(this.getCellSize() - controls.ROW_HEIGHT);
                        }
                        this.repaint();
                    }
                    onDoubleClick(e) {
                        const item = this.getPaintItemAt(e);
                        if (item) {
                            this.dispatchEvent(new CustomEvent(viewers.EVENT_OPEN_ITEM, {
                                detail: item.data
                            }));
                        }
                    }
                    onMouseUp(e) {
                        if (e.button !== 0 && e.button !== 2) {
                            return;
                        }
                        if (!this.canSelectAtPoint(e)) {
                            return;
                        }
                        const item = this.getPaintItemAt(e);
                        let selChanged = false;
                        if (item === null) {
                            this._selectedObjects.clear();
                            selChanged = true;
                        }
                        else {
                            const data = item.data;
                            if (e.button === 2) {
                                if (!this._selectedObjects.has(data)) {
                                    this._selectedObjects.add(data);
                                    selChanged = true;
                                }
                            }
                            else {
                                if (e.ctrlKey || e.metaKey) {
                                    if (this._selectedObjects.has(data)) {
                                        this._selectedObjects.delete(data);
                                    }
                                    else {
                                        this._selectedObjects.add(data);
                                    }
                                    selChanged = true;
                                }
                                else if (e.shiftKey) {
                                    if (this._lastSelectedItemIndex >= 0 && this._lastSelectedItemIndex != item.index) {
                                        const start = Math.min(this._lastSelectedItemIndex, item.index);
                                        const end = Math.max(this._lastSelectedItemIndex, item.index);
                                        for (let i = start; i <= end; i++) {
                                            const obj = this._paintItems[i].data;
                                            this._selectedObjects.add(obj);
                                        }
                                        selChanged = true;
                                    }
                                }
                                else {
                                    this._selectedObjects.clear();
                                    this._selectedObjects.add(data);
                                    selChanged = true;
                                }
                            }
                        }
                        if (selChanged) {
                            this.repaint();
                            this.fireSelectionChanged();
                            this._lastSelectedItemIndex = item ? item.index : 0;
                        }
                    }
                    initContext() {
                        this._context = this.getCanvas().getContext("2d");
                        this._context.imageSmoothingEnabled = false;
                        this._context.font = `${controls.FONT_HEIGHT}px sans-serif`;
                    }
                    setExpanded(obj, expanded) {
                        if (expanded) {
                            this._expandedObjects.add(obj);
                        }
                        else {
                            this._expandedObjects.delete(obj);
                        }
                    }
                    isExpanded(obj) {
                        return this._expandedObjects.has(obj);
                    }
                    getExpandedObjects() {
                        return this._expandedObjects;
                    }
                    isCollapsed(obj) {
                        return !this.isExpanded(obj);
                    }
                    collapseAll() {
                        this._expandedObjects = new Set();
                    }
                    expandCollapseBranch(obj) {
                        const parents = [];
                        const item = this._paintItems.find(item => item.data === obj);
                        if (item && item.parent) {
                            const parentObj = item.parent.data;
                            this.setExpanded(parentObj, !this.isExpanded(parentObj));
                            parents.push(parentObj);
                        }
                        return parents;
                    }
                    isSelected(obj) {
                        return this._selectedObjects.has(obj);
                    }
                    paintTreeHandler(x, y, collapsed) {
                        if (collapsed) {
                            this._context.strokeStyle = "#000";
                            this._context.strokeRect(x, y, controls.ICON_SIZE, controls.ICON_SIZE);
                        }
                        else {
                            this._context.fillStyle = "#000";
                            this._context.fillRect(x, y, controls.ICON_SIZE, controls.ICON_SIZE);
                        }
                    }
                    async repaint() {
                        this.prepareFiltering();
                        this.repaint2();
                        const result = await this.preload();
                        if (result === controls.PreloadResult.RESOURCES_LOADED) {
                            this.repaint2();
                        }
                        this.updateScrollPane();
                    }
                    updateScrollPane() {
                        const pane = this.getContainer().getContainer();
                        if (pane instanceof controls.ScrollPane) {
                            pane.updateScroll(this._contentHeight);
                        }
                    }
                    repaint2() {
                        this._paintItems = [];
                        const canvas = this.getCanvas();
                        this._context.clearRect(0, 0, canvas.width, canvas.height);
                        if (this._cellRendererProvider && this._contentProvider && this._input !== null) {
                            this.paint();
                        }
                        else {
                            this._contentHeight = 0;
                        }
                    }
                    paintItemBackground(obj, x, y, w, h, radius = 0) {
                        let fillStyle = null;
                        if (this.isSelected(obj)) {
                            fillStyle = controls.Controls.getTheme().viewerSelectionBackground;
                        }
                        if (fillStyle != null) {
                            this._context.save();
                            this._context.fillStyle = fillStyle;
                            this._context.strokeStyle = fillStyle;
                            if (radius > 0) {
                                this._context.lineJoin = "round";
                                this._context.lineWidth = radius;
                                this._context.strokeRect(x + (radius / 2), y + (radius / 2), w - radius, h - radius);
                                this._context.fillRect(x + (radius / 2), y + (radius / 2), w - radius, h - radius);
                            }
                            else {
                                this._context.fillRect(x, y, w, h);
                            }
                            this._context.restore();
                        }
                    }
                    setScrollY(scrollY) {
                        const b = this.getBounds();
                        scrollY = Math.max(-this._contentHeight + b.height, scrollY);
                        scrollY = Math.min(0, scrollY);
                        super.setScrollY(scrollY);
                        this.repaint();
                    }
                    layout() {
                        const b = this.getBounds();
                        if (this.isHandlePosition()) {
                            ui.controls.setElementBounds(this.getElement(), {
                                x: b.x,
                                y: b.y,
                                width: b.width | 0,
                                height: b.height | 0
                            });
                        }
                        else {
                            ui.controls.setElementBounds(this.getElement(), {
                                width: b.width | 0,
                                height: b.height | 0
                            });
                        }
                        const canvas = this.getCanvas();
                        canvas.width = b.width | 0;
                        canvas.height = b.height | 0;
                        this.initContext();
                        this.repaint();
                    }
                    getCanvas() {
                        return this.getElement();
                    }
                    getContext() {
                        return this._context;
                    }
                    getCellSize() {
                        return this._cellSize;
                    }
                    setCellSize(cellSize) {
                        this._cellSize = Math.max(controls.ROW_HEIGHT, cellSize);
                    }
                    getContentProvider() {
                        return this._contentProvider;
                    }
                    setContentProvider(contentProvider) {
                        this._contentProvider = contentProvider;
                    }
                    getCellRendererProvider() {
                        return this._cellRendererProvider;
                    }
                    setCellRendererProvider(cellRendererProvider) {
                        this._cellRendererProvider = cellRendererProvider;
                    }
                    getInput() {
                        return this._input;
                    }
                    setInput(input) {
                        this._input = input;
                    }
                    getState() {
                        return {
                            filterText: this._filterText,
                            expandedObjects: this._expandedObjects,
                            selectedObjects: this._selectedObjects,
                            cellSize: this._cellSize
                        };
                    }
                    setState(state) {
                        this._expandedObjects = state.expandedObjects;
                        this._selectedObjects = state.selectedObjects;
                        this.setFilterText(state.filterText);
                        this.setCellSize(state.cellSize);
                    }
                    selectAll() {
                        this.setSelection(this._paintItems.map(item => item.data));
                    }
                }
                viewers.Viewer = Viewer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Viewer.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class IconImageCellRenderer {
                    constructor(icon) {
                        this._icon = icon;
                    }
                    getIcon(obj) {
                        return this._icon;
                    }
                    renderCell(args) {
                        const icon = this.getIcon(args.obj);
                        if (!icon) {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
                        }
                        else {
                            const x = args.x + (args.w - controls.ICON_SIZE) / 2;
                            const y = args.y + (args.h - controls.ICON_SIZE) / 2;
                            icon.paint(args.canvasContext, x, y, controls.ICON_SIZE, controls.ICON_SIZE, false);
                        }
                    }
                    cellHeight(args) {
                        return controls.ROW_HEIGHT;
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.IconImageCellRenderer = IconImageCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./IconImageCellRenderer.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class IconGridCellRenderer {
                    constructor(icon) {
                        this._icon = icon;
                    }
                    renderCell(args) {
                        if (!this._icon) {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
                        }
                        else {
                            const x2 = (args.w - controls.ICON_SIZE) / 2;
                            const y2 = (args.h - controls.ICON_SIZE) / 2;
                            this._icon.paint(args.canvasContext, args.x + x2, args.y + y2, controls.ICON_SIZE, controls.ICON_SIZE, false);
                        }
                        const ctx = args.canvasContext;
                        ctx.save();
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.5;
                        ctx.strokeStyle = controls.Controls.getTheme().viewerForeground;
                        ctx.strokeRect(args.x, args.y, args.w, args.h);
                        ctx.restore();
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    preload(args) {
                        return this._icon.preload();
                    }
                }
                viewers.IconGridCellRenderer = IconGridCellRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class LabelProvider {
                    getLabel(obj) {
                        if (typeof (obj) === "string") {
                            return obj;
                        }
                        return "";
                    }
                }
                viewers.LabelProvider = LabelProvider;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class PaintItem extends controls.Rect {
                    constructor(index, data, parent = null) {
                        super();
                        this.index = index;
                        this.data = data;
                        this.parent = parent;
                    }
                }
                viewers.PaintItem = PaintItem;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class PreloadCellArgs {
                    constructor(obj, viewer) {
                        this.obj = obj;
                        this.viewer = viewer;
                    }
                    clone() {
                        return new PreloadCellArgs(this.obj, this.viewer);
                    }
                }
                viewers.PreloadCellArgs = PreloadCellArgs;
                ;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class RenderCellArgs {
                    constructor(canvasContext, x, y, w, h, obj, viewer, center = false) {
                        this.canvasContext = canvasContext;
                        this.x = x;
                        this.y = y;
                        this.w = w;
                        this.h = h;
                        this.obj = obj;
                        this.viewer = viewer;
                        this.center = center;
                    }
                    clone() {
                        return new RenderCellArgs(this.canvasContext, this.x, this.y, this.w, this.h, this.obj, this.viewer, this.center);
                    }
                }
                viewers.RenderCellArgs = RenderCellArgs;
                ;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Viewer.ts"/>
/// <reference path="./EmptyTreeContentProvider.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                viewers.TREE_ICON_SIZE = controls.ICON_SIZE;
                viewers.LABEL_MARGIN = viewers.TREE_ICON_SIZE + 0;
                class TreeViewer extends viewers.Viewer {
                    constructor(...classList) {
                        super("TreeViewer", ...classList);
                        this.getCanvas().addEventListener("click", e => this.onClick(e));
                        this._treeRenderer = new viewers.TreeViewerRenderer(this);
                        this._treeIconList = [];
                        this.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
                    }
                    getTreeRenderer() {
                        return this._treeRenderer;
                    }
                    setTreeRenderer(treeRenderer) {
                        this._treeRenderer = treeRenderer;
                    }
                    canSelectAtPoint(e) {
                        const icon = this.getTreeIconAtPoint(e);
                        return icon === null;
                    }
                    reveal(...objects) {
                        for (const obj of objects) {
                            const path = this.getObjectPath(obj);
                            this.revealPath(path);
                        }
                        try {
                            if (!(this.getContainer().getContainer() instanceof controls.ScrollPane)) {
                                return;
                            }
                        }
                        catch (e) {
                            return;
                        }
                        const scrollPane = this.getContainer().getContainer();
                        this.repaint().then(() => {
                            const objSet = new Set(objects);
                            let found = false;
                            let y = -this._contentHeight;
                            const b = this.getBounds();
                            for (const item of this._paintItems) {
                                if (objSet.has(item.data)) {
                                    if (item.y < 0 || item.y + item.h > b.height) {
                                        y = (item.y - b.height / 2 + item.h / 2) - this.getScrollY();
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if (found) {
                                this.setScrollY(-y);
                                this.repaint();
                                scrollPane.layout();
                            }
                        });
                    }
                    revealPath(path) {
                        for (let i = 0; i < path.length - 1; i++) {
                            this.setExpanded(path[i], true);
                        }
                    }
                    getObjectPath(obj) {
                        const list = this.getContentProvider().getRoots(this.getInput());
                        const path = [];
                        this.getObjectPath2(obj, path, list);
                        return path;
                    }
                    getObjectPath2(obj, path, children) {
                        const contentProvider = this.getContentProvider();
                        for (const child of children) {
                            path.push(child);
                            if (obj === child) {
                                return true;
                            }
                            const found = this.getObjectPath2(obj, path, contentProvider.getChildren(child));
                            if (found) {
                                return true;
                            }
                            path.pop();
                        }
                        return false;
                    }
                    getTreeIconAtPoint(e) {
                        for (let icon of this._treeIconList) {
                            if (icon.rect.contains(e.offsetX, e.offsetY)) {
                                return icon;
                            }
                        }
                        return null;
                    }
                    onClick(e) {
                        const icon = this.getTreeIconAtPoint(e);
                        if (icon) {
                            this.setExpanded(icon.obj, !this.isExpanded(icon.obj));
                            this.repaint();
                        }
                    }
                    visitObjects(visitor) {
                        const provider = this.getContentProvider();
                        const list = provider ? provider.getRoots(this.getInput()) : [];
                        this.visitObjects2(list, visitor);
                    }
                    visitObjects2(objects, visitor) {
                        for (var obj of objects) {
                            visitor(obj);
                            if (this.isExpanded(obj) || this.getFilterText() !== "") {
                                const list = this.getContentProvider().getChildren(obj);
                                this.visitObjects2(list, visitor);
                            }
                        }
                    }
                    async preload() {
                        const list = [];
                        const viewer = this;
                        this.visitObjects(obj => {
                            const provider = this.getCellRendererProvider();
                            list.push(provider.preload(obj).then(r1 => {
                                const renderer = provider.getCellRenderer(obj);
                                return renderer.preload(new viewers.PreloadCellArgs(obj, viewer)).then(r2 => {
                                    return Math.max(r1, r2);
                                });
                            }));
                        });
                        return controls.Controls.resolveAll(list);
                    }
                    paint() {
                        const result = this._treeRenderer.paint();
                        this._contentHeight = result.contentHeight;
                        this._paintItems = result.paintItems;
                        this._treeIconList = result.treeIconList;
                    }
                    setFilterText(filter) {
                        super.setFilterText(filter);
                        if (filter !== "") {
                            this.expandFilteredParents(this.getContentProvider().getRoots(this.getInput()));
                            this.repaint();
                        }
                    }
                    expandFilteredParents(objects) {
                        const contentProvider = this.getContentProvider();
                        for (const obj of objects) {
                            if (this.isFilterIncluded(obj)) {
                                const children = contentProvider.getChildren(obj);
                                if (children.length > 0) {
                                    this.setExpanded(obj, true);
                                    this.expandFilteredParents(children);
                                }
                            }
                        }
                    }
                    buildFilterIncludeMap() {
                        const provider = this.getContentProvider();
                        const roots = provider ? provider.getRoots(this.getInput()) : [];
                        this.buildFilterIncludeMap2(roots);
                    }
                    buildFilterIncludeMap2(objects) {
                        let result = false;
                        for (const obj of objects) {
                            let resultThis = this.matches(obj);
                            const children = this.getContentProvider().getChildren(obj);
                            const resultChildren = this.buildFilterIncludeMap2(children);
                            resultThis = resultThis || resultChildren;
                            if (resultThis) {
                                this._filterIncludeSet.add(obj);
                                result = true;
                            }
                        }
                        return result;
                    }
                    getContentProvider() {
                        return super.getContentProvider();
                    }
                    expandCollapseBranch(obj) {
                        if (this.getContentProvider().getChildren(obj).length > 0) {
                            this.setExpanded(obj, !this.isExpanded(obj));
                            return [obj];
                        }
                        return super.expandCollapseBranch(obj);
                    }
                }
                viewers.TreeViewer = TreeViewer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ContentTypeIconExtension extends colibri.Extension {
                constructor(config) {
                    super(ContentTypeIconExtension.POINT_ID, 10);
                    this._config = config;
                }
                static withPluginIcons(plugin, config) {
                    return new ContentTypeIconExtension(config.map(item => {
                        var _a;
                        return {
                            icon: (_a = item.plugin, (_a !== null && _a !== void 0 ? _a : plugin)).getIcon(item.iconName),
                            contentType: item.contentType
                        };
                    }));
                }
                getConfig() {
                    return this._config;
                }
            }
            ContentTypeIconExtension.POINT_ID = "colibri.ui.ide.ContentTypeIconExtension";
            ide.ContentTypeIconExtension = ContentTypeIconExtension;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../controls/Controls.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            ide.EVENT_PART_TITLE_UPDATED = "partTitledUpdated";
            class Part extends ui.controls.Control {
                constructor(id) {
                    super();
                    this._id = id;
                    this._title = "";
                    this._selection = [];
                    this._partCreated = false;
                    this._restoreState = null;
                    this._undoManager = new ide.undo.UndoManager();
                    this.getElement().setAttribute("id", id);
                    this.getElement().classList.add("Part");
                    this.getElement()["__part"] = this;
                }
                setRestoreState(state) {
                    this._restoreState = state;
                }
                getUndoManager() {
                    return this._undoManager;
                }
                getPartFolder() {
                    return this._folder;
                }
                setPartFolder(folder) {
                    this._folder = folder;
                }
                getTitle() {
                    return this._title;
                }
                setTitle(title) {
                    this._title = title;
                    this.dispatchTitleUpdatedEvent();
                }
                setIcon(icon) {
                    this._icon = icon;
                    this.dispatchTitleUpdatedEvent();
                }
                dispatchTitleUpdatedEvent() {
                    this.dispatchEvent(new CustomEvent(ide.EVENT_PART_TITLE_UPDATED, { detail: this }));
                }
                getIcon() {
                    return this._icon;
                }
                getId() {
                    return this._id;
                }
                setSelection(selection, notify = true) {
                    this._selection = selection;
                    window["SELECTION"] = selection;
                    if (notify) {
                        this.dispatchEvent(new CustomEvent(ui.controls.EVENT_SELECTION_CHANGED, {
                            detail: selection
                        }));
                    }
                }
                getSelection() {
                    return this._selection;
                }
                getPropertyProvider() {
                    return null;
                }
                layout() {
                }
                onPartClosed() {
                    return true;
                }
                onPartShown() {
                    if (!this._partCreated) {
                        this._partCreated = true;
                        this.doCreatePart();
                        if (this._restoreState) {
                            try {
                                this.restoreState(this._restoreState);
                                this._restoreState = null;
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                    }
                }
                doCreatePart() {
                    this.createPart();
                }
                onPartActivated() {
                }
                saveState(state) {
                }
                restoreState(state) {
                }
            }
            ide.Part = Part;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorPart extends ide.Part {
                constructor(id) {
                    super(id);
                    this.addClass("EditorPart");
                    this._dirty = false;
                }
                setDirty(dirty) {
                    this._dirty = dirty;
                    const folder = this.getPartFolder();
                    const label = folder.getLabelFromContent(this);
                    const iconClose = ui.controls.Controls.getIcon(ui.controls.ICON_CONTROL_CLOSE);
                    const iconDirty = dirty ? ui.controls.Controls.getIcon(ui.controls.ICON_CONTROL_DIRTY) : iconClose;
                    folder.setTabCloseIcons(label, iconDirty, iconClose);
                }
                isDirty() {
                    return this._dirty;
                }
                save() {
                    this.doSave();
                }
                doSave() {
                }
                onPartClosed() {
                    if (this.isDirty()) {
                        return confirm("This editor is not saved, do you want to close it?");
                    }
                    return true;
                }
                getInput() {
                    return this._input;
                }
                setInput(input) {
                    this._input = input;
                }
                getEditorViewerProvider(key) {
                    return null;
                }
                createEditorToolbar(parent) {
                    return null;
                }
            }
            ide.EditorPart = EditorPart;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../controls/TabPane.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class PartFolder extends ui.controls.TabPane {
                constructor(...classList) {
                    super("PartsTabPane", ...classList);
                    this.addEventListener(ui.controls.EVENT_CONTROL_LAYOUT, (e) => {
                        const content = this.getSelectedTabContent();
                        if (content) {
                            content.layout();
                        }
                    });
                    this.addEventListener(ui.controls.EVENT_TAB_CLOSED, (e) => {
                        const part = e.detail;
                        if (part.onPartClosed()) {
                            if (this.getContentList().length === 1) {
                                ide.Workbench.getWorkbench().setActivePart(null);
                                if (this instanceof ide.EditorArea) {
                                    ide.Workbench.getWorkbench().setActiveEditor(null);
                                }
                            }
                        }
                        else {
                            e.preventDefault();
                        }
                    });
                    this.addEventListener(ui.controls.EVENT_TAB_SELECTED, (e) => {
                        const part = e.detail;
                        ide.Workbench.getWorkbench().setActivePart(part);
                        part.onPartShown();
                    });
                    this.addEventListener(ui.controls.EVENT_TAB_LABEL_RESIZED, (e) => {
                        for (const part of this.getParts()) {
                            part.dispatchTitleUpdatedEvent();
                        }
                    });
                }
                addPart(part, closeable = false, selectIt = true) {
                    part.addEventListener(ide.EVENT_PART_TITLE_UPDATED, (e) => {
                        this.setTabTitle(part, part.getTitle(), part.getIcon());
                    });
                    this.addTab(part.getTitle(), part.getIcon(), part, closeable, selectIt);
                    part.setPartFolder(this);
                }
                getParts() {
                    return this.getContentList();
                }
            }
            ide.PartFolder = PartFolder;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Part.ts"/>
/// <reference path="./EditorPart.ts"/>
/// <reference path="./PartFolder.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorArea extends ide.PartFolder {
                constructor() {
                    super("EditorArea");
                }
                activateEditor(editor) {
                    super.selectTabWithContent(editor);
                }
                getEditors() {
                    return super.getParts();
                }
            }
            ide.EditorArea = EditorArea;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorExtension extends colibri.Extension {
                constructor(factories) {
                    super(EditorExtension.POINT_ID);
                    this._factories = factories;
                }
                getFactories() {
                    return this._factories;
                }
            }
            EditorExtension.POINT_ID = "colibri.ui.ide.EditorExtension";
            ide.EditorExtension = EditorExtension;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorFactory {
                constructor(id) {
                    this._id = id;
                }
                getId() {
                    return this._id;
                }
            }
            ide.EditorFactory = EditorFactory;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorRegistry {
                constructor() {
                    this._map = new Map();
                }
                registerFactory(factory) {
                    this._map.set(factory.getId(), factory);
                }
                getFactoryForInput(input) {
                    for (const factory of this._map.values()) {
                        if (factory.acceptInput(input)) {
                            return factory;
                        }
                    }
                    return null;
                }
            }
            ide.EditorRegistry = EditorRegistry;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class EditorViewerProvider {
                constructor() {
                    this._viewer = null;
                    this._initialSelection = null;
                }
                setViewer(viewer) {
                    this._viewer = viewer;
                    if (this._initialSelection) {
                        this.setSelection(this._initialSelection, true, true);
                        this._initialSelection = null;
                    }
                }
                setSelection(selection, reveal, notify) {
                    if (this._viewer) {
                        this._viewer.setSelection(selection, notify);
                        this._viewer.reveal(...selection);
                    }
                    else {
                        this._initialSelection = selection;
                    }
                }
                getSelection() {
                    return this._viewer.getSelection();
                }
                onViewerSelectionChanged(selection) {
                }
                repaint() {
                    if (this._viewer) {
                        const state = this._viewer.getState();
                        this.prepareViewerState(state);
                        this._viewer.setState(state);
                        this._viewer.repaint();
                    }
                }
                prepareViewerState(state) {
                }
            }
            ide.EditorViewerProvider = EditorViewerProvider;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ViewPart extends ide.Part {
                constructor(id) {
                    super(id);
                    this.addClass("View");
                }
            }
            ide.ViewPart = ViewPart;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./ViewPart.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ViewerView extends ide.ViewPart {
                constructor(id) {
                    super(id);
                }
                createPart() {
                    this._viewer = this.createViewer();
                    this.addClass("ViewerPart");
                    this._filteredViewer = new ui.controls.viewers.FilteredViewer(this._viewer);
                    this.add(this._filteredViewer);
                    this._viewer.addEventListener(ui.controls.EVENT_SELECTION_CHANGED, (e) => {
                        this.setSelection(e.detail);
                    });
                    this._viewer.getElement().addEventListener("contextmenu", e => this.onMenu(e));
                }
                fillContextMenu(menu) {
                }
                onMenu(e) {
                    e.preventDefault();
                    this._viewer.onMouseUp(e);
                    const menu = new ui.controls.Menu();
                    this._viewer.setMenu(menu);
                    this.fillContextMenu(menu);
                    menu.create(e);
                }
                getViewer() {
                    return this._viewer;
                }
                layout() {
                    if (this._filteredViewer) {
                        this._filteredViewer.layout();
                    }
                }
            }
            ide.ViewerView = ViewerView;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./ViewerView.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var viewers = ui.controls.viewers;
            class EditorViewerView extends ide.ViewerView {
                constructor(id) {
                    super(id);
                    this._viewerStateMap = new Map();
                }
                createViewer() {
                    const viewer = new viewers.TreeViewer();
                    viewer.addEventListener(ui.controls.EVENT_SELECTION_CHANGED, e => {
                        if (this._currentViewerProvider) {
                            this._currentViewerProvider.onViewerSelectionChanged(this._viewer.getSelection());
                        }
                    });
                    return viewer;
                }
                createPart() {
                    super.createPart();
                    ide.Workbench.getWorkbench().addEventListener(ide.EVENT_EDITOR_ACTIVATED, e => this.onWorkbenchEditorActivated());
                }
                async onWorkbenchEditorActivated() {
                    if (this._currentEditor !== null) {
                        const state = this._viewer.getState();
                        this._viewerStateMap.set(this._currentEditor, state);
                    }
                    const editor = ide.Workbench.getWorkbench().getActiveEditor();
                    let provider = null;
                    if (editor) {
                        if (editor === this._currentEditor) {
                            provider = this._currentViewerProvider;
                        }
                        else {
                            provider = this.getViewerProvider(editor);
                        }
                    }
                    if (provider) {
                        await provider.preload();
                        this._viewer.setTreeRenderer(provider.getTreeViewerRenderer(this._viewer));
                        this._viewer.setLabelProvider(provider.getLabelProvider());
                        this._viewer.setCellRendererProvider(provider.getCellRendererProvider());
                        this._viewer.setContentProvider(provider.getContentProvider());
                        this._viewer.setInput(provider.getInput());
                        provider.setViewer(this._viewer);
                        const state = this._viewerStateMap.get(editor);
                        if (state) {
                            provider.prepareViewerState(state);
                            this._viewer.setState(state);
                        }
                    }
                    else {
                        this._viewer.setInput(null);
                        this._viewer.setContentProvider(new ui.controls.viewers.EmptyTreeContentProvider());
                    }
                    this._currentViewerProvider = provider;
                    this._currentEditor = editor;
                    this._viewer.repaint();
                }
                getPropertyProvider() {
                    if (this._currentViewerProvider) {
                        return this._currentViewerProvider.getPropertySectionProvider();
                    }
                    return null;
                }
                getUndoManager() {
                    if (this._currentViewerProvider) {
                        return this._currentViewerProvider.getUndoManager();
                    }
                    return super.getUndoManager();
                }
            }
            ide.EditorViewerView = EditorViewerView;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class FileEditor extends ide.EditorPart {
                constructor(id) {
                    super(id);
                    this._isSaving = false;
                    this._onFileStorageListener = change => {
                        this.onFileStorageChanged(change);
                    };
                    ide.Workbench.getWorkbench().getFileStorage().addChangeListener(this._onFileStorageListener);
                }
                save() {
                    this._isSaving = true;
                    try {
                        super.save();
                    }
                    finally {
                        this._isSaving = false;
                    }
                }
                isSaving() {
                    return this._isSaving;
                }
                onFileStorageChanged(change) {
                    const editorFile = this.getInput();
                    const editorFileFullName = editorFile.getFullName();
                    if (change.isDeleted(editorFileFullName)) {
                        this.getPartFolder().closeTab(this);
                    }
                    else if (change.isModified(editorFileFullName)) {
                        if (!this._isSaving) {
                            this.onEditorInputContentChanged();
                        }
                    }
                    else if (change.wasRenamed(editorFileFullName)) {
                        this.setTitle(editorFile.getName());
                    }
                }
                onPartClosed() {
                    const closeIt = super.onPartClosed();
                    if (closeIt) {
                        ide.Workbench.getWorkbench().getFileStorage().removeChangeListener(this._onFileStorageListener);
                    }
                    return closeIt;
                }
                setInput(file) {
                    super.setInput(file);
                    this.setTitle(file.getName());
                }
                getInput() {
                    return super.getInput();
                }
                getIcon() {
                    const file = this.getInput();
                    if (!file) {
                        return ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_FILE);
                    }
                    const wb = ide.Workbench.getWorkbench();
                    const ct = wb.getContentTypeRegistry().getCachedContentType(file);
                    const icon = wb.getContentTypeIcon(ct);
                    return icon;
                }
            }
            ide.FileEditor = FileEditor;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class FileImage extends ui.controls.DefaultImage {
                constructor(file) {
                    super(new Image(), file.getUrl());
                    this._file = file;
                }
                getFile() {
                    return this._file;
                }
                preload() {
                    return super.preload();
                }
                getWidth() {
                    const size = ide.FileUtils.getImageSize(this._file);
                    return size ? size.width : super.getWidth();
                }
                getHeight() {
                    const size = ide.FileUtils.getImageSize(this._file);
                    return size ? size.height : super.getHeight();
                }
                preloadSize() {
                    const result = ide.FileUtils.preloadImageSize(this._file);
                    return result;
                }
            }
            ide.FileImage = FileImage;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class FileUtils {
                static preloadImageSize(file) {
                    return ide.Workbench.getWorkbench().getFileImageSizeCache().preload(file);
                }
                static getImageSize(file) {
                    return ide.Workbench.getWorkbench().getFileImageSizeCache().getContent(file);
                }
                static getImage(file) {
                    return ide.Workbench.getWorkbench().getFileImage(file);
                }
                static async preloadAndGetFileString(file) {
                    await this.preloadFileString(file);
                    return this.getFileString(file);
                }
                static getFileString(file) {
                    return ide.Workbench.getWorkbench().getFileStringCache().getContent(file);
                }
                static setFileString_async(file, content) {
                    return ide.Workbench.getWorkbench().getFileStringCache().setContent(file, content);
                }
                static async createFile_async(folder, fileName, content) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    const file = await storage.createFile(folder, fileName, content);
                    return file;
                }
                static async createFolder_async(container, folderName) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    const folder = await storage.createFolder(container, folderName);
                    return folder;
                }
                static async deleteFiles_async(files) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    await storage.deleteFiles(files);
                }
                static async renameFile_async(file, newName) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    await storage.renameFile(file, newName);
                }
                static async moveFiles_async(movingFiles, moveTo) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    await storage.moveFiles(movingFiles, moveTo);
                }
                static async getProjects_async() {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    return storage.getProjects();
                }
                static async getProjectTemplates_async() {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    return storage.getProjectTemplates();
                }
                static async createProject_async(templatePath, projectName) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    return storage.createProject(templatePath, projectName);
                }
                static async preloadFileString(file) {
                    const cache = ide.Workbench.getWorkbench().getFileStringCache();
                    return cache.preload(file);
                }
                static getFileFromPath(path) {
                    const root = ide.Workbench.getWorkbench().getProjectRoot();
                    const names = path.split("/");
                    const firstName = names.shift();
                    if (root.getName() !== firstName) {
                        return null;
                    }
                    let result = root;
                    for (const name of names) {
                        const child = result.getFile(name);
                        if (child) {
                            result = child;
                        }
                        else {
                            return null;
                        }
                    }
                    return result;
                }
                static async uploadFile_async(uploadFolder, file) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    return storage.uploadFile(uploadFolder, file);
                }
                static async getFilesWithContentType(contentType) {
                    const reg = ide.Workbench.getWorkbench().getContentTypeRegistry();
                    const files = this.getAllFiles();
                    for (const file of files) {
                        await reg.preload(file);
                    }
                    return files.filter(file => reg.getCachedContentType(file) === contentType);
                }
                static getAllFiles() {
                    const files = [];
                    ide.Workbench.getWorkbench().getProjectRoot().flatTree(files, false);
                    return files;
                }
                static getRoot() {
                    return ide.Workbench.getWorkbench().getProjectRoot();
                }
            }
            ide.FileUtils = FileUtils;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class IconLoaderExtension extends colibri.Extension {
                constructor(icons) {
                    super(IconLoaderExtension.POINT_ID);
                    this._icons = icons;
                }
                static withPluginFiles(plugin, iconNames) {
                    const icons = iconNames.map(name => plugin.getIcon(name));
                    return new IconLoaderExtension(icons);
                }
                getIcons() {
                    return this._icons;
                }
            }
            IconLoaderExtension.POINT_ID = "colibri.ui.ide.IconLoaderExtension";
            ide.IconLoaderExtension = IconLoaderExtension;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../../core/io/SyncFileContentCache.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ImageFileCache extends colibri.core.io.SyncFileContentCache {
                constructor() {
                    super(file => new ide.FileImage(file));
                }
            }
            ide.ImageFileCache = ImageFileCache;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../../core/io/SyncFileContentCache.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ImageSizeFileCache extends colibri.core.io.FileContentCache {
                constructor() {
                    super(file => ui.ide.Workbench.getWorkbench().getFileStorage().getImageSize(file));
                }
            }
            ide.ImageSizeFileCache = ImageSizeFileCache;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class MainToolbar extends ui.controls.Control {
                constructor() {
                    super("div", "MainToolbar");
                    this._currentManager = null;
                    const element = this.getElement();
                    this._leftArea = document.createElement("div");
                    this._leftArea.classList.add("MainToolbarLeftArea");
                    element.appendChild(this._leftArea);
                    this._centerArea = document.createElement("div");
                    this._centerArea.classList.add("MainToolbarCenterArea");
                    element.appendChild(this._centerArea);
                    this._rightArea = document.createElement("div");
                    this._rightArea.classList.add("MainToolbarRightArea");
                    element.appendChild(this._rightArea);
                    ide.Workbench.getWorkbench().addEventListener(ide.EVENT_EDITOR_ACTIVATED, e => this.onEditorActivated());
                }
                getLeftArea() {
                    return this._leftArea;
                }
                getCenterArea() {
                    return this._centerArea;
                }
                getRightArea() {
                    return this._rightArea;
                }
                onEditorActivated() {
                    const editor = ide.Workbench.getWorkbench().getActiveEditor();
                    if (this._currentManager) {
                        this._currentManager.dispose();
                        this._currentManager = null;
                    }
                    if (editor) {
                        const manager = editor.createEditorToolbar(this._centerArea);
                        this._currentManager = manager;
                    }
                }
            }
            ide.MainToolbar = MainToolbar;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class OutlineProvider extends EventTarget {
                constructor(editor) {
                    super();
                    this._editor = editor;
                }
            }
            ide.OutlineProvider = OutlineProvider;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class PreloadProjectResourcesExtension extends colibri.Extension {
                constructor(getPreloadPromise) {
                    super(PreloadProjectResourcesExtension.POINT_ID);
                    this._getPreloadPromise = getPreloadPromise;
                }
                getPreloadPromise(monitor) {
                    return this._getPreloadPromise(monitor);
                }
            }
            PreloadProjectResourcesExtension.POINT_ID = "colibri.ui.ide.PreloadProjectResourcesExtension";
            ide.PreloadProjectResourcesExtension = PreloadProjectResourcesExtension;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ViewFolder extends ide.PartFolder {
                constructor(...classList) {
                    super("ViewFolder", ...classList);
                }
            }
            ide.ViewFolder = ViewFolder;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./ViewPart.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ViewerFileEditor extends ide.FileEditor {
                constructor(id) {
                    super(id);
                }
                createPart() {
                    this._viewer = this.createViewer();
                    this.addClass("ViewerPart");
                    this._filteredViewer = new ui.controls.viewers.FilteredViewer(this._viewer);
                    this.add(this._filteredViewer);
                    this._viewer.addEventListener(ui.controls.EVENT_SELECTION_CHANGED, (e) => {
                        this.setSelection(e.detail);
                    });
                }
                getViewer() {
                    return this._viewer;
                }
                layout() {
                    if (this._filteredViewer) {
                        this._filteredViewer.layout();
                    }
                }
            }
            ide.ViewerFileEditor = ViewerFileEditor;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class WindowExtension extends colibri.Extension {
                constructor(createWindowFunc) {
                    super(WindowExtension.POINT_ID, 10);
                    this._createWindowFunc = createWindowFunc;
                }
                createWindow() {
                    return this._createWindowFunc();
                }
            }
            WindowExtension.POINT_ID = "colibri.ui.ide.WindowExtension";
            ide.WindowExtension = WindowExtension;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../controls/Control.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var io = colibri.core.io;
            class WorkbenchWindow extends ui.controls.Control {
                constructor(id) {
                    super("div", "Window");
                    this.getElement().id = id;
                    this._id = id;
                    this._created = false;
                }
                saveState(prefs) {
                    // nothing, derived classes can use methods like saveEditorsSate()
                }
                restoreState(prefs) {
                    // nothing, derived classes can use methods like restoreEditors().
                }
                saveEditorsState(prefs) {
                    const editorArea = this.getEditorArea();
                    const editors = editorArea.getEditors();
                    let activeEditorFile = null;
                    {
                        const activeEditor = editorArea.getSelectedTabContent();
                        if (activeEditor) {
                            const input = activeEditor.getInput();
                            if (input instanceof io.FilePath) {
                                activeEditorFile = input.getFullName();
                            }
                        }
                    }
                    const restoreEditorData = {
                        fileDataList: [],
                        activeEditorFile: activeEditorFile,
                        tabIconSize: editorArea.getTabIconSize()
                    };
                    for (const editor of editors) {
                        const input = editor.getInput();
                        if (input instanceof colibri.core.io.FilePath) {
                            const state = {};
                            editor.saveState(state);
                            restoreEditorData.fileDataList.push({
                                fileName: input.getFullName(),
                                state: state
                            });
                        }
                    }
                    prefs.setValue("restoreEditorData", restoreEditorData);
                }
                restoreEditors(prefs) {
                    const editorArea = this.getEditorArea();
                    const editors = editorArea.getEditors();
                    const restoreEditorData = prefs.getValue("restoreEditorData");
                    editorArea.closeAll();
                    if (restoreEditorData) {
                        if (restoreEditorData.tabIconSize) {
                            editorArea.setTabIconSize(restoreEditorData.tabIconSize);
                        }
                        let activeEditor = null;
                        let lastEditor = null;
                        const wb = colibri.Platform.getWorkbench();
                        for (const fileData of restoreEditorData.fileDataList) {
                            const fileName = fileData.fileName;
                            const file = colibri.ui.ide.FileUtils.getFileFromPath(fileName);
                            if (file) {
                                const editor = wb.createEditor(file);
                                if (!editor) {
                                    continue;
                                }
                                lastEditor = editor;
                                const state = fileData.state;
                                try {
                                    editor.setRestoreState(state);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                                if (file.getFullName() === restoreEditorData.activeEditorFile) {
                                    activeEditor = editor;
                                }
                            }
                        }
                        if (!activeEditor) {
                            activeEditor = lastEditor;
                        }
                        if (activeEditor) {
                            editorArea.activateEditor(activeEditor);
                            wb.setActivePart(activeEditor);
                        }
                    }
                }
                create() {
                    if (this._created) {
                        return;
                    }
                    this._created = true;
                    window.addEventListener("resize", e => {
                        this.layout();
                    });
                    window.addEventListener(ui.controls.EVENT_THEME_CHANGED, e => this.layout());
                    this._toolbar = new ide.MainToolbar();
                    this._clientArea = new ui.controls.Control("div", "WindowClientArea");
                    this._clientArea.setLayout(new ui.controls.FillLayout());
                    this.add(this._toolbar);
                    this.add(this._clientArea);
                    this.setLayout(new ide.WorkbenchWindowLayout());
                    this.createParts();
                }
                getId() {
                    return this._id;
                }
                getToolbar() {
                    return this._toolbar;
                }
                getClientArea() {
                    return this._clientArea;
                }
                getViews() {
                    const views = [];
                    this.findViews(this.getElement(), views);
                    return views;
                }
                getView(viewId) {
                    const views = this.getViews();
                    return views.find(view => view.getId() === viewId);
                }
                findViews(element, views) {
                    const control = ui.controls.Control.getControlOf(element);
                    if (control instanceof ide.ViewPart) {
                        views.push(control);
                    }
                    else {
                        for (let i = 0; i < element.childElementCount; i++) {
                            const childElement = element.children.item(i);
                            this.findViews(childElement, views);
                        }
                    }
                }
                createViewFolder(...parts) {
                    const folder = new ide.ViewFolder();
                    for (const part of parts) {
                        folder.addPart(part);
                    }
                    return folder;
                }
            }
            ide.WorkbenchWindow = WorkbenchWindow;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            const TOOLBAR_HEIGHT = 40;
            class WorkbenchWindowLayout {
                layout(parent) {
                    const win = parent;
                    const toolbar = win.getToolbar();
                    const clientArea = win.getClientArea();
                    const b = win.getBounds();
                    b.x = 0;
                    b.y = 0;
                    b.width = window.innerWidth;
                    b.height = window.innerHeight;
                    ui.controls.setElementBounds(win.getElement(), b);
                    toolbar.setBoundsValues(0, 0, b.width, TOOLBAR_HEIGHT);
                    clientArea.setBoundsValues(0, TOOLBAR_HEIGHT, b.width, b.height - TOOLBAR_HEIGHT);
                }
            }
            ide.WorkbenchWindowLayout = WorkbenchWindowLayout;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            ide.IMG_SECTION_PADDING = 10;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class KeyMatcher {
                    constructor(config) {
                        this._control = config.control === undefined ? false : config.control;
                        this._shift = config.shift === undefined ? false : config.shift;
                        this._alt = config.alt === undefined ? false : config.alt;
                        this._meta = config.meta === undefined ? false : config.meta;
                        this._key = config.key === undefined ? "" : config.key;
                        this._filterInputElements = config.filterInputElements === undefined ? true : config.filterInputElements;
                    }
                    matchesKeys(event) {
                        return event.ctrlKey === this._control
                            && event.shiftKey === this._shift
                            && event.altKey === this._alt
                            && event.metaKey === this._meta
                            && event.key.toLowerCase() === this._key.toLowerCase();
                    }
                    matchesTarget(element) {
                        if (this._filterInputElements) {
                            return !(element instanceof HTMLInputElement);
                        }
                        return true;
                    }
                }
                commands.KeyMatcher = KeyMatcher;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../commands/KeyMatcher.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var actions;
            (function (actions) {
                var KeyMatcher = ide.commands.KeyMatcher;
                actions.CMD_SAVE = "colibri.ui.ide.actions.Save";
                actions.CMD_DELETE = "colibri.ui.ide.actions.Delete";
                actions.CMD_RENAME = "colibri.ui.ide.actions.Rename";
                actions.CMD_UNDO = "colibri.ui.ide.actions.Undo";
                actions.CMD_REDO = "colibri.ui.ide.actions.Redo";
                actions.CMD_COLLAPSE_ALL = "colibri.ui.ide.actions.CollapseAll";
                actions.CMD_EXPAND_COLLAPSE_BRANCH = "colibri.ui.ide.actions.ExpandCollapseBranch";
                actions.CMD_SELECT_ALL = "colibri.ui.ide.actions.SelectAll";
                actions.CMD_ESCAPE = "colibri.ui.ide.actions.Scape";
                function isViewerScope(args) {
                    if (args.activeElement) {
                        const control = ui.controls.Control.getControlOf(args.activeElement);
                        if (control && control instanceof ui.controls.viewers.Viewer) {
                            return true;
                        }
                    }
                    return false;
                }
                class IDECommands {
                    static registerCommands(manager) {
                        IDECommands.initEdit(manager);
                        IDECommands.initUndo(manager);
                        IDECommands.initViewer(manager);
                    }
                    static initViewer(manager) {
                        // collapse all
                        manager.addCommandHelper(actions.CMD_COLLAPSE_ALL);
                        manager.addHandlerHelper(actions.CMD_COLLAPSE_ALL, isViewerScope, args => {
                            const viewer = ui.controls.Control.getControlOf(args.activeElement);
                            viewer.collapseAll();
                            viewer.repaint();
                        });
                        manager.addKeyBinding(actions.CMD_COLLAPSE_ALL, new KeyMatcher({
                            key: "c"
                        }));
                        // select all
                        manager.addCommandHelper(actions.CMD_SELECT_ALL);
                        manager.addHandlerHelper(actions.CMD_SELECT_ALL, isViewerScope, args => {
                            const viewer = ui.controls.Control.getControlOf(args.activeElement);
                            viewer.selectAll();
                            viewer.repaint();
                        });
                        manager.addKeyBinding(actions.CMD_SELECT_ALL, new KeyMatcher({
                            control: true,
                            key: "a"
                        }));
                        // collapse expand branch
                        manager.addCommandHelper(actions.CMD_EXPAND_COLLAPSE_BRANCH);
                        manager.addHandlerHelper(actions.CMD_EXPAND_COLLAPSE_BRANCH, args => args.activeElement !== null && ui.controls.Control.getControlOf(args.activeElement) instanceof ui.controls.viewers.Viewer, args => {
                            const viewer = ui.controls.Control.getControlOf(args.activeElement);
                            const parents = [];
                            for (const obj of viewer.getSelection()) {
                                const objParents = viewer.expandCollapseBranch(obj);
                                parents.push(...objParents);
                            }
                            viewer.setSelection(parents);
                        });
                        manager.addKeyBinding(actions.CMD_EXPAND_COLLAPSE_BRANCH, new KeyMatcher({
                            key: " "
                        }));
                        // escape
                        manager.addCommandHelper(actions.CMD_ESCAPE);
                        manager.addKeyBinding(actions.CMD_ESCAPE, new KeyMatcher({
                            key: "Escape"
                        }));
                        // clear viewer selection
                        manager.addHandlerHelper(actions.CMD_ESCAPE, isViewerScope, args => {
                            const viewer = ui.controls.Control.getControlOf(args.activeElement);
                            viewer.escape();
                        });
                        // escape menu
                        manager.addHandlerHelper(actions.CMD_ESCAPE, args => args.activeMenu !== null, args => args.activeMenu.close());
                    }
                    static initUndo(manager) {
                        // undo
                        manager.addCommandHelper(actions.CMD_UNDO);
                        manager.addHandlerHelper(actions.CMD_UNDO, args => args.activePart !== null, args => args.activePart.getUndoManager().undo());
                        manager.addKeyBinding(actions.CMD_UNDO, new KeyMatcher({
                            control: true,
                            key: "z"
                        }));
                        // redo
                        manager.addCommandHelper(actions.CMD_REDO);
                        manager.addHandlerHelper(actions.CMD_REDO, args => args.activePart !== null, args => args.activePart.getUndoManager().redo());
                        manager.addKeyBinding(actions.CMD_REDO, new KeyMatcher({
                            control: true,
                            shift: true,
                            key: "z"
                        }));
                    }
                    static initEdit(manager) {
                        // save
                        manager.addCommandHelper(actions.CMD_SAVE);
                        manager.addHandlerHelper(actions.CMD_SAVE, args => args.activeEditor ? true : false, args => {
                            if (args.activeEditor.isDirty()) {
                                args.activeEditor.save();
                            }
                        });
                        manager.addKeyBinding(actions.CMD_SAVE, new KeyMatcher({
                            control: true,
                            key: "s",
                            filterInputElements: false
                        }));
                        // delete
                        manager.addCommandHelper(actions.CMD_DELETE);
                        manager.addKeyBinding(actions.CMD_DELETE, new KeyMatcher({
                            key: "delete"
                        }));
                        // rename
                        manager.addCommandHelper(actions.CMD_RENAME);
                        manager.addKeyBinding(actions.CMD_RENAME, new KeyMatcher({
                            key: "f2"
                        }));
                    }
                }
                actions.IDECommands = IDECommands;
            })(actions = ide.actions || (ide.actions = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var actions;
            (function (actions) {
                class PartAction extends ui.controls.Action {
                    constructor(part, config) {
                        super(config);
                        this._part = part;
                    }
                    getPart() {
                        return this._part;
                    }
                }
                actions.PartAction = PartAction;
            })(actions = ide.actions || (ide.actions = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var actions;
            (function (actions) {
                class ViewerViewAction extends actions.PartAction {
                    constructor(view, config) {
                        super(view, config);
                    }
                    getViewViewer() {
                        return this.getPart().getViewer();
                    }
                    getViewViewerSelection() {
                        return this.getViewViewer().getSelection();
                    }
                }
                actions.ViewerViewAction = ViewerViewAction;
            })(actions = ide.actions || (ide.actions = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class Command {
                    constructor(id) {
                        this._id = id;
                    }
                    getId() {
                        return this._id;
                    }
                }
                commands.Command = Command;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class CommandArgs {
                    constructor(activePart, activeEditor, activeElement, activeMenu, activeWindow, activeDialog) {
                        this.activePart = activePart;
                        this.activeEditor = activeEditor;
                        this.activeElement = activeElement;
                        this.activeMenu = activeMenu;
                        this.activeWindow = activeWindow;
                        this.activeDialog = activeDialog;
                    }
                }
                commands.CommandArgs = CommandArgs;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class CommandExtension extends colibri.Extension {
                    constructor(configurer) {
                        super(CommandExtension.POINT_ID);
                        this._configurer = configurer;
                    }
                    getConfigurer() {
                        return this._configurer;
                    }
                }
                CommandExtension.POINT_ID = "colibri.ui.ide.commands";
                commands.CommandExtension = CommandExtension;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class CommandHandler {
                    constructor(config) {
                        this._testFunc = config.testFunc;
                        this._executeFunc = config.executeFunc;
                    }
                    test(args) {
                        return this._testFunc ? this._testFunc(args) : true;
                    }
                    execute(args) {
                        if (this._executeFunc) {
                            this._executeFunc(args);
                        }
                    }
                }
                commands.CommandHandler = CommandHandler;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var commands;
            (function (commands) {
                class CommandManager {
                    constructor() {
                        this._commands = [];
                        this._commandIdMap = new Map();
                        this._commandMatcherMap = new Map();
                        this._commandHandlerMap = new Map();
                        window.addEventListener("keydown", e => { this.onKeyDown(e); });
                    }
                    onKeyDown(event) {
                        if (event.isComposing) {
                            return;
                        }
                        const args = this.makeArgs();
                        for (const command of this._commands) {
                            let eventMatches = false;
                            const matchers = this._commandMatcherMap.get(command);
                            for (const matcher of matchers) {
                                if (matcher.matchesKeys(event) && matcher.matchesTarget(event.target)) {
                                    eventMatches = true;
                                    break;
                                }
                            }
                            if (eventMatches) {
                                const handlers = this._commandHandlerMap.get(command);
                                for (const handler of handlers) {
                                    if (handler.test(args)) {
                                        event.preventDefault();
                                        handler.execute(args);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    addCommand(cmd) {
                        this._commands.push(cmd);
                        this._commandIdMap.set(cmd.getId(), cmd);
                        this._commandMatcherMap.set(cmd, []);
                        this._commandHandlerMap.set(cmd, []);
                    }
                    addCommandHelper(id) {
                        this.addCommand(new commands.Command(id));
                    }
                    makeArgs() {
                        const wb = ide.Workbench.getWorkbench();
                        const activeMenu = ui.controls.Menu.getActiveMenu();
                        let activeElement = wb.getActiveElement();
                        if (activeMenu) {
                            activeElement = activeMenu.getElement();
                        }
                        return new commands.CommandArgs(wb.getActivePart(), wb.getActiveEditor(), activeElement, activeMenu, wb.getActiveWindow(), wb.getActiveDialog());
                    }
                    getCommand(id) {
                        const command = this._commandIdMap.get(id);
                        if (!command) {
                            console.error(`Command ${id} not found.`);
                        }
                        return command;
                    }
                    addKeyBinding(commandId, matcher) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            this._commandMatcherMap.get(command).push(matcher);
                        }
                    }
                    addHandler(commandId, handler) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            this._commandHandlerMap.get(command).push(handler);
                        }
                    }
                    addHandlerHelper(commandId, testFunc, executeFunc) {
                        this.addHandler(commandId, new commands.CommandHandler({
                            testFunc: testFunc,
                            executeFunc: executeFunc
                        }));
                    }
                }
                commands.CommandManager = CommandManager;
            })(commands = ide.commands || (ide.commands = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var properties;
            (function (properties) {
                class FilteredViewerInPropertySection extends ui.controls.viewers.FilteredViewer {
                    constructor(page, viewer, ...classList) {
                        super(viewer, ...classList);
                        this.setHandlePosition(false);
                        this.style.position = "relative";
                        this.style.height = "100%";
                        this.resizeTo();
                        page.addEventListener(ui.controls.EVENT_CONTROL_LAYOUT, (e) => {
                            this.resizeTo();
                        });
                    }
                    resizeTo() {
                        setTimeout(() => {
                            const parent = this.getElement().parentElement;
                            if (parent) {
                                this.setBounds({
                                    width: parent.clientWidth,
                                    height: parent.clientHeight
                                });
                            }
                            this.getViewer().repaint();
                        }, 10);
                    }
                }
                properties.FilteredViewerInPropertySection = FilteredViewerInPropertySection;
            })(properties = ide.properties || (ide.properties = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var themes;
            (function (themes) {
                class ThemeExtension extends colibri.Extension {
                    constructor(theme) {
                        super(ThemeExtension.POINT_ID);
                        this._theme = theme;
                    }
                    getTheme() {
                        return this._theme;
                    }
                }
                ThemeExtension.POINT_ID = "colibri.ui.ide.ThemeExtension";
                themes.ThemeExtension = ThemeExtension;
            })(themes = ide.themes || (ide.themes = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var undo;
            (function (undo) {
                class Operation {
                }
                undo.Operation = Operation;
            })(undo = ide.undo || (ide.undo = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var undo;
            (function (undo) {
                class UndoManager {
                    constructor() {
                        this._undoList = [];
                        this._redoList = [];
                    }
                    add(op) {
                        this._undoList.push(op);
                        this._redoList = [];
                    }
                    undo() {
                        if (this._undoList.length > 0) {
                            const op = this._undoList.pop();
                            op.undo();
                            this._redoList.push(op);
                        }
                    }
                    redo() {
                        if (this._redoList.length > 0) {
                            const op = this._redoList.pop();
                            op.redo();
                            this._undoList.push(op);
                        }
                    }
                }
                undo.UndoManager = UndoManager;
            })(undo = ide.undo || (ide.undo = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var utils;
            (function (utils) {
                class NameMaker {
                    constructor(getName) {
                        this._getName = getName;
                        this._nameSet = new Set();
                    }
                    update(objects) {
                        for (const obj of objects) {
                            const name = this._getName(obj);
                            this._nameSet.add(name);
                        }
                    }
                    makeName(baseName) {
                        let name;
                        let i = 0;
                        do {
                            name = baseName + (i === 0 ? "" : "_" + i);
                            i++;
                        } while (this._nameSet.has(name));
                        this._nameSet.add(name);
                        return name;
                    }
                }
                utils.NameMaker = NameMaker;
            })(utils = ide.utils || (ide.utils = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
