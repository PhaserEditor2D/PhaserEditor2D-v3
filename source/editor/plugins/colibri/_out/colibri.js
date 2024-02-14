var colibri;
(function (colibri) {
    class Plugin {
        _id;
        _iconCache;
        _loadIconsFromAtlas;
        _loadResources;
        _atlasImage;
        _atlasData;
        _resources;
        constructor(id, config) {
            this._id = id;
            this._loadIconsFromAtlas = Boolean(config?.loadIconsFromAtlas);
            this._loadResources = Boolean(config?.loadResources);
            this._iconCache = new Map();
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
        getResources() {
            return this._resources;
        }
        async preloadResources() {
            if (!this._loadResources) {
                return;
            }
            this._resources = new colibri.ui.ide.Resources(this);
            await this._resources.preload();
        }
        async preloadAtlasIcons() {
            if (!this._loadIconsFromAtlas) {
                return;
            }
            const ratio = colibri.ui.controls.DEVICE_PIXEL_RATIO_x2 ? "@2x" : "@1x";
            const imgUrl = this.getPluginURL(`icons/atlas${ratio}.png`);
            this._atlasImage = colibri.ui.controls.Controls
                .getImage(imgUrl, this.getId() + ".atlas");
            await this._atlasImage.preload();
            this._atlasData = await this.getJSON(`icons/atlas${ratio}.json`);
        }
        registerExtensions(registry) {
            // nothing
        }
        getIconDescriptor(name) {
            return new colibri.ui.controls.IconDescriptor(this, name);
        }
        getIcon(name, common = false) {
            if (this._iconCache.has(name)) {
                return this._iconCache.get(name);
            }
            let lightImage;
            let darkImage;
            if (this._loadIconsFromAtlas) {
                if (common) {
                    darkImage = new colibri.ui.controls.AtlasImage(this, this.getIconsAtlasFrameName(name, "common"));
                    lightImage = darkImage;
                }
                else {
                    darkImage = new colibri.ui.controls.AtlasImage(this, this.getIconsAtlasFrameName(name, "dark"));
                    lightImage = new colibri.ui.controls.AtlasImage(this, this.getIconsAtlasFrameName(name, "light"));
                }
            }
            else {
                if (common) {
                    darkImage = this.getThemeIcon(name, "common");
                    lightImage = darkImage;
                }
                else {
                    darkImage = this.getThemeIcon(name, "dark");
                    lightImage = this.getThemeIcon(name, "light");
                }
            }
            const image = new colibri.ui.controls.IconImage(lightImage, darkImage);
            this._iconCache.set(name, image);
            return image;
        }
        getIconsAtlasImage() {
            return this._atlasImage;
        }
        getFrameDataFromIconsAtlas(frame) {
            const frameData = this._atlasData.frames[frame];
            if (!frameData) {
                throw new Error(`Atlas frame "${frame}" not found.`);
            }
            return frameData;
        }
        getThemeIcon(name, theme) {
            const iconPath = this.getIconsAtlasFrameName(name, theme);
            const url = this.getPluginURL(`icons/${iconPath}`);
            const id = theme + "." + name;
            return colibri.ui.controls.Controls.getImage(url, id);
        }
        getIconsAtlasFrameName(name, theme) {
            const x2 = colibri.ui.controls.DEVICE_PIXEL_RATIO_x2;
            return `${theme}/${name}${x2 ? "@2x" : ""}.png`;
        }
        getPluginURL(pathInPlugin) {
            return `/editor/app/plugins/${this.getId()}/${pathInPlugin}`;
        }
        getResourceURL(pathInPlugin) {
            return `${this.getPluginURL(pathInPlugin)}?v=${colibri.PRODUCT_VERSION}`;
        }
        // getResourceURL(pathInPlugin: string, version?: string) {
        //     if (version === undefined) {
        //         version = Date.now().toString();
        //     }
        //     return `${this.getPluginURL(pathInPlugin)}?v=${version}`;
        // }
        async getJSON(pathInPlugin) {
            const url = this.getResourceURL(pathInPlugin);
            const result = await fetch(url, {
                method: "GET",
                cache: "force-cache"
            });
            const data = await result.json();
            return data;
        }
        async getString(pathInPlugin) {
            const result = await fetch(this.getResourceURL(pathInPlugin), {
                method: "GET",
                cache: "force-cache"
            });
            const data = await result.text();
            return data;
        }
    }
    colibri.Plugin = Plugin;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    colibri.PRODUCT_VERSION = "1";
    class Platform {
        static _plugins = [];
        static _extensionRegistry;
        static _product;
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
        static async loadProduct(bypassCache = true) {
            try {
                const url = bypassCache ?
                    `/editor/product.json?v=${Date.now()}` :
                    `/editor/product.json`;
                const resp = await fetch(url, {
                    method: "GET",
                    cache: "no-cache"
                });
                this._product = await resp.json();
                colibri.PRODUCT_VERSION = this._product.version;
            }
            catch (e) {
                console.log(e);
                throw new Error("Cannot fetch product configuration.");
            }
        }
        static async start() {
            await this.getWorkbench().launch();
        }
        static getProduct() {
            return this._product;
        }
        static getProductOption(key) {
            return this._product[key];
        }
        static getElectron() {
            return window["electron"];
        }
        static onElectron(callback, elseCallback) {
            if (this.getElectron()) {
                callback(this.getElectron());
            }
            else if (elseCallback) {
                elseCallback();
            }
        }
        static isOnElectron() {
            return Boolean(this.getElectron());
        }
    }
    colibri.Platform = Platform;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Control {
                eventControlLayout = new controls.ListenerList();
                eventSelectionChanged = new controls.ListenerList();
                _bounds = { x: 0, y: 0, width: 0, height: 0 };
                _element;
                _children;
                _layout;
                _container;
                _scrollY;
                _layoutChildren;
                _handlePosition = true;
                constructor(tagName = "div", ...classList) {
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
                static getParentControl(element) {
                    if (element) {
                        const control = this.getControlOf(element);
                        return control || this.getParentControl(element.parentElement);
                    }
                    return null;
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
                    if (x !== undefined) {
                        x = Math.floor(x);
                        this._element.style.left = x + "px";
                        this._bounds.x = x;
                    }
                    if (y !== undefined) {
                        y = Math.floor(y);
                        this._element.style.top = y + "px";
                        this._bounds.y = y;
                    }
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
                        this.layoutChildren();
                    }
                    this.dispatchLayoutEvent();
                }
                layoutChildren() {
                    if (this._layoutChildren) {
                        for (const child of this._children) {
                            child.layout();
                        }
                    }
                }
                dispatchLayoutEvent() {
                    this.eventControlLayout.fire();
                }
                add(control) {
                    control._container = this;
                    this._children.push(control);
                    this._element.appendChild(control.getElement());
                    control.onControlAdded();
                }
                remove(control) {
                    control.getElement().remove();
                    this._children = this._children.filter(c => c !== control);
                    control.onControlRemoved();
                }
                onControlAdded() {
                    // nothing
                }
                onControlRemoved() {
                    // nothing
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
            let PreloadResult;
            (function (PreloadResult) {
                PreloadResult[PreloadResult["NOTHING_LOADED"] = 0] = "NOTHING_LOADED";
                PreloadResult[PreloadResult["RESOURCES_LOADED"] = 1] = "RESOURCES_LOADED";
            })(PreloadResult = controls.PreloadResult || (controls.PreloadResult = {}));
            controls.DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
            controls.DEVICE_PIXEL_RATIO_x2 = controls.DEVICE_PIXEL_RATIO > 1;
            controls.ICON_SIZE = controls.DEVICE_PIXEL_RATIO_x2 ? 32 : 16;
            controls.RENDER_ICON_SIZE = 16;
            class Controls {
                static _images = new Map();
                static _applicationDragData = null;
                static _mouseDownElement;
                static _dragCanvas;
                static init() {
                    window.addEventListener("mousedown", e => {
                        this._mouseDownElement = e.target;
                    });
                    this.initDragCanvas();
                }
                static addTabStop() {
                    // this prevents Safari to include the address bar in the tab order.
                    const tabStop = document.createElement("input");
                    tabStop.style.position = "fixed";
                    tabStop.style.left = "-1000px";
                    tabStop.onfocus = () => {
                        console.log("catch last tabIndex, focus first element");
                        document.getElementsByTagName("input")[0].focus();
                    };
                    document.body.appendChild(tabStop);
                }
                static getMouseDownElement() {
                    return this._mouseDownElement;
                }
                static adjustCanvasDPI(canvas, widthHint = 1, heightHint = 1) {
                    const dpr = window.devicePixelRatio || 1;
                    if (dpr === 1) {
                        return;
                    }
                    const rect = canvas.getBoundingClientRect();
                    const width = rect.width === 0 ? widthHint : rect.width;
                    const height = rect.height === 0 ? heightHint : rect.height;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    const ctx = canvas.getContext("2d");
                    ctx.scale(dpr, dpr);
                    return ctx;
                }
                static _charWidthMap = new Map();
                static _textWidthMap = new Map();
                static measureTextWidth(context, label) {
                    const font = controls.FONT_FAMILY + controls.getCanvasFontHeight();
                    const textKey = font + "@" + label;
                    let width = 0;
                    if (this._textWidthMap.has(textKey)) {
                        width = this._textWidthMap.get(textKey);
                    }
                    else {
                        for (const c of label) {
                            const key = font + "@" + c;
                            let charWidth = 0;
                            if (this._charWidthMap.has(key)) {
                                charWidth = this._charWidthMap.get(key);
                            }
                            else {
                                charWidth = context.measureText(c).width;
                                this._charWidthMap.set(key, charWidth);
                            }
                            width += charWidth;
                        }
                        this._textWidthMap.set(textKey, width);
                    }
                    return width;
                }
                static setDragEventImage(e, render) {
                    const canvas = this._dragCanvas;
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    render(ctx, canvas.width, canvas.height);
                    e.dataTransfer.setDragImage(canvas, 10, 10);
                }
                static initDragCanvas() {
                    const canvas = document.createElement("canvas");
                    canvas.setAttribute("id", "__drag__canvas");
                    canvas.style.imageRendering = "crisp-edges";
                    canvas.width = 64;
                    canvas.height = 64;
                    canvas.style.width = canvas.width + "px";
                    canvas.style.height = canvas.height + "px";
                    canvas.style.position = "fixed";
                    canvas.style.left = "0px";
                    document.body.appendChild(canvas);
                    this._dragCanvas = canvas;
                }
                static _isSafari = navigator.vendor.toLowerCase().indexOf("apple") >= 0;
                static isSafariBrowser() {
                    return this._isSafari;
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
                static getImage(url, id, appendVersion = true) {
                    if (Controls._images.has(id)) {
                        return Controls._images.get(id);
                    }
                    if (appendVersion) {
                        url += "?v=" + colibri.PRODUCT_VERSION;
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
                static LIGHT_THEME = {
                    id: "light",
                    displayName: "Light",
                    classList: ["light"],
                    dark: false,
                    sceneBackground: "#8e8e8e",
                    viewerSelectionBackground: "#4242ff",
                    viewerSelectionForeground: "#f0f0f0",
                    viewerForeground: "#2f2f2f",
                };
                static DARK_THEME = {
                    id: "dark",
                    displayName: "Dark",
                    classList: ["dark"],
                    dark: true,
                    sceneBackground: "#3f3f3f",
                    viewerSelectionBackground: "#f0a050", // "#101ea2",//"#8f8f8f",
                    viewerSelectionForeground: "#0e0e0e",
                    viewerForeground: "#f0f0f0",
                };
                static DEFAULT_THEME = Controls.DARK_THEME;
                static _theme = Controls.DEFAULT_THEME;
                static setTheme(theme) {
                    const classList = document.getElementsByTagName("html")[0].classList;
                    classList.remove(...this._theme.classList);
                    classList.add(...theme.classList);
                    this._theme = theme;
                    colibri.Platform.getWorkbench().eventThemeChanged.fire(this._theme);
                    localStorage.setItem("colibri.theme.id", theme.id);
                    localStorage.setItem("colibri.theme.classList", theme.classList.join(","));
                }
                static preloadTheme() {
                    let id = localStorage.getItem("colibri.theme.id");
                    if (!id) {
                        id = Controls.DEFAULT_THEME.id;
                    }
                    let tokens = [id];
                    const str = localStorage.getItem("colibri.theme.classList");
                    if (str) {
                        tokens = str.split(",");
                    }
                    const documentClassList = document.getElementsByTagName("html")[0].classList;
                    documentClassList.add(...tokens);
                }
                static restoreTheme() {
                    const id = localStorage.getItem("colibri.theme.id");
                    let theme = null;
                    if (id) {
                        theme = colibri.Platform
                            .getExtensions(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                            .map(e => e.getTheme())
                            .find(t => t.id === id);
                    }
                    controls.Controls.setTheme(theme ?? controls.Controls.DEFAULT_THEME);
                }
                static getTheme() {
                    return this._theme;
                }
                static drawRoundedRect(ctx, x, y, w, h, stroke = false, topLeft = 5, topRight = 5, bottomRight = 5, bottomLeft = 5) {
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
                    ctx.fill();
                    if (stroke) {
                        ctx.stroke();
                    }
                    ctx.restore();
                }
                static createBlobFromImage(img) {
                    return new Promise((resolve, reject) => {
                        let canvas;
                        if (img instanceof HTMLCanvasElement) {
                            canvas = img;
                        }
                        else {
                            canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            canvas.style.width = img.width + "px";
                            canvas.style.height = img.height + "px";
                            const ctx = canvas.getContext("2d");
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(img, 0, 0);
                        }
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, 'image/png');
                    });
                }
                static createImageFromBlob(blob) {
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(blob);
                    return img;
                }
            }
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
            class Workbench {
                static _workbench;
                static getWorkbench() {
                    if (!Workbench._workbench) {
                        Workbench._workbench = new Workbench();
                    }
                    return this._workbench;
                }
                eventPartDeactivated = new ui.controls.ListenerList();
                eventPartActivated = new ui.controls.ListenerList();
                eventEditorDeactivated = new ui.controls.ListenerList();
                eventEditorActivated = new ui.controls.ListenerList();
                eventBeforeOpenProject = new ui.controls.ListenerList();
                eventProjectOpened = new ui.controls.ListenerList();
                eventThemeChanged = new ui.controls.ListenerList();
                eventWindowFocused = new ui.controls.ListenerList();
                _fileStringCache;
                _fileBinaryCache;
                _fileImageCache;
                _fileImageSizeCache;
                _activeWindow;
                _contentType_icon_Map;
                _fileStorage;
                _contentTypeRegistry;
                _activePart;
                _activeEditor;
                _activeElement;
                _editorRegistry;
                _commandManager;
                _windows;
                _globalPreferences;
                _projectPreferences;
                _editorSessionStateRegistry;
                constructor() {
                    this._editorRegistry = new ide.EditorRegistry();
                    this._windows = [];
                    this._activePart = null;
                    this._activeEditor = null;
                    this._activeElement = null;
                    this._fileImageCache = new ide.ImageFileCache();
                    this._fileImageSizeCache = new ide.ImageSizeFileCache();
                    this._globalPreferences = new colibri.core.preferences.Preferences("__global__");
                    this._projectPreferences = null;
                    this._editorSessionStateRegistry = new Map();
                }
                getFileStringCache() {
                    if (!colibri.CAPABILITY_FILE_STORAGE) {
                        return undefined;
                    }
                    if (!this._fileStringCache) {
                        this._fileStringCache = new colibri.core.io.FileStringCache(this.getFileStorage());
                    }
                    return this._fileStringCache;
                }
                getFileBinaryCache() {
                    if (!colibri.CAPABILITY_FILE_STORAGE) {
                        return undefined;
                    }
                    if (!this._fileBinaryCache) {
                        this._fileBinaryCache = new colibri.core.io.FileBinaryCache(this.getFileStorage());
                    }
                    return this._fileBinaryCache;
                }
                getFileStorage() {
                    if (!colibri.CAPABILITY_FILE_STORAGE) {
                        return undefined;
                    }
                    if (!this._fileStorage) {
                        const extensions = colibri.Platform.getExtensions(colibri.core.io.FileStorageExtension.POINT_ID);
                        const ext = extensions[0];
                        if (!ext) {
                            throw new colibri.Extension("No file storage extension registered");
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
                showNotification(text, clickCallback) {
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
                    ui.controls.Controls.init();
                    ui.controls.Controls.preloadTheme();
                    {
                        const plugins = colibri.Platform.getPlugins();
                        const registry = colibri.Platform.getExtensionRegistry();
                        for (const plugin of plugins) {
                            // register default extensions
                            registry.addExtension(new ide.IconAtlasLoaderExtension(plugin));
                            registry.addExtension(new ide.PluginResourceLoaderExtension(() => plugin.preloadResources()));
                            plugin.registerExtensions(registry);
                        }
                        for (const plugin of plugins) {
                            console.log(`\tPlugin: starting %c${plugin.getId()}`, "color:blue");
                            await plugin.starting();
                        }
                    }
                    ui.controls.Controls.restoreTheme();
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
                    for (const plugin of colibri.Platform.getPlugins()) {
                        await plugin.started();
                    }
                }
                hideSplash() {
                    const splashElement = document.getElementById("splash-container");
                    if (splashElement) {
                        splashElement.remove();
                    }
                }
                resetCache() {
                    this.getFileStringCache().reset();
                    this.getFileBinaryCache().reset();
                    this._fileImageCache.reset();
                    this._fileImageSizeCache.reset();
                    this._contentTypeRegistry.resetCache();
                    this._editorSessionStateRegistry.clear();
                }
                async openProject(monitor) {
                    this.eventBeforeOpenProject.fire("");
                    this.resetCache();
                    console.log(`Workbench: opening project.`);
                    const fileStorage = this.getFileStorage();
                    await fileStorage.openProject();
                    const projectName = fileStorage.getRoot().getName();
                    console.log(`Workbench: project ${projectName} loaded.`);
                    this._projectPreferences = new colibri.core.preferences.Preferences("__project__" + projectName);
                    console.log("Workbench: fetching required project resources.");
                    try {
                        await this.preloadProjectResources(monitor);
                        this.eventProjectOpened.fire(projectName);
                    }
                    catch (e) {
                        console.log("Error loading project resources");
                        alert("Error: loading project resources. " + e.message);
                        console.log(e.message);
                    }
                }
                async preloadProjectResources(monitor) {
                    const extensions = colibri.Platform
                        .getExtensions(ide.PreloadProjectResourcesExtension.POINT_ID);
                    let total = 0;
                    for (const extension of extensions) {
                        const n = await extension.computeTotal();
                        total += n;
                    }
                    monitor.addTotal(total);
                    for (const extension of extensions) {
                        try {
                            await extension.preload(monitor);
                        }
                        catch (e) {
                            console.log("Error with extension:");
                            console.log(extension);
                            console.error(e);
                            alert(`[${extension.constructor.name}] Preload error: ${(e.message || e)}`);
                        }
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
                async preloadPluginResources() {
                    const dlg = new ui.controls.dialogs.ProgressDialog();
                    dlg.create();
                    dlg.setTitle("Loading Workbench");
                    dlg.setCloseWithEscapeKey(false);
                    dlg.setProgress(0);
                    // count icon extensions
                    const iconAtlasExtensions = colibri.Platform
                        .getExtensionRegistry()
                        .getExtensions(ide.IconAtlasLoaderExtension.POINT_ID);
                    const icons = [];
                    {
                        const extensions = colibri.Platform
                            .getExtensions(ide.IconLoaderExtension.POINT_ID);
                        for (const extension of extensions) {
                            icons.push(...extension.getIcons());
                        }
                    }
                    // count resource extensions
                    const resExtensions = colibri.Platform
                        .getExtensions(ide.PluginResourceLoaderExtension.POINT_ID);
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
                registerContentTypeIcons() {
                    this._contentType_icon_Map = new Map();
                    const extensions = colibri.Platform.getExtensions(ide.ContentTypeIconExtension.POINT_ID);
                    for (const extension of extensions) {
                        for (const item of extension.getConfig()) {
                            this._contentType_icon_Map.set(item.contentType, item.iconDescriptor);
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
                        const dirty = this.getEditors().find(editor => editor.isDirty());
                        if (dirty) {
                            e.preventDefault();
                            e.returnValue = "";
                            colibri.Platform.onElectron(electron => {
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
                registerEditors() {
                    const extensions = colibri.Platform.getExtensions(ide.EditorExtension.POINT_ID);
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
                    this.eventEditorActivated.fire(editor);
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
                            old.onPartDeactivated();
                            this.eventPartDeactivated.fire(old);
                        }
                        if (part) {
                            this.toggleActivePartClass(part);
                            part.onPartActivated();
                        }
                        this.eventPartActivated.fire(part);
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
                getProjectRoot() {
                    return this.getFileStorage().getRoot();
                }
                getContentTypeIcon(contentType) {
                    if (this._contentType_icon_Map.has(contentType)) {
                        const iconDesc = this._contentType_icon_Map.get(contentType);
                        if (iconDesc) {
                            const icon = iconDesc.getIcon();
                            return icon;
                        }
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
                    return colibri.ColibriPlugin.getInstance().getIcon(name);
                }
                getEditorRegistry() {
                    return this._editorRegistry;
                }
                getEditors() {
                    return this.getActiveWindow().getEditorArea().getEditors();
                }
                getOpenEditorsWithInput(input) {
                    return this.getEditors().filter(editor => editor.getInput() === input);
                }
                async saveAllEditors() {
                    for (const editor of this.getEditors()) {
                        if (!editor.isReadOnly() && editor.isDirty()) {
                            await editor.save();
                        }
                    }
                }
                makeEditor(input, editorFactory) {
                    const factory = editorFactory || this._editorRegistry.getFactoryForInput(input);
                    if (factory) {
                        const editor = factory.createEditor();
                        editor.setInput(input);
                        return editor;
                    }
                    else {
                        console.error("No editor available for :" + input);
                        alert("No editor available for the given input.");
                    }
                    return null;
                }
                createEditor(input, editorFactory) {
                    const editorArea = this.getActiveWindow().getEditorArea();
                    const editor = this.makeEditor(input, editorFactory);
                    if (editor) {
                        editorArea.addPart(editor, true, false);
                    }
                    return editor;
                }
                getEditorInputExtension(input) {
                    return this.getEditorInputExtensionWithId(input.getEditorInputExtension());
                }
                getEditorInputExtensionWithId(id) {
                    return colibri.Platform.getExtensions(ide.EditorInputExtension.POINT_ID)
                        .find(e => e.getId() === id);
                }
                openEditor(input, editorFactory) {
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
            ide.Workbench = Workbench;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./Plugin.ts" />
/// <reference path="./Platform.ts" />
/// <reference path="./ui/ide/Workbench.ts" />
var colibri;
(function (colibri) {
    colibri.CAPABILITY_FILE_STORAGE = true;
    colibri.ICON_FILE = "file";
    colibri.ICON_FOLDER = "folder";
    colibri.ICON_PLUS = "plus";
    colibri.ICON_ZOOM_IN = "zoom_in";
    colibri.ICON_ZOOM_OUT = "zoom_out";
    colibri.ICON_MINUS = "minus";
    colibri.ICON_DELETE = "delete";
    colibri.ICON_ZOOM_RESET = "zoom-reset";
    colibri.ICON_MENU = "menu";
    colibri.ICON_SMALL_MENU = "small-menu";
    colibri.ICON_CHECKED = "checked";
    colibri.ICON_KEYMAP = "keymap";
    colibri.ICON_COLOR = "color";
    colibri.ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
    colibri.ICON_CONTROL_TREE_EXPAND = "tree-expand";
    colibri.ICON_CONTROL_TREE_EXPAND_LEFT = "tree-expand-left";
    colibri.ICON_CONTROL_TREE_COLLAPSE_LEFT = "tree-collapse-left";
    colibri.ICON_CONTROL_SECTION_COLLAPSE = "section-collapse";
    colibri.ICON_CONTROL_SECTION_COLLAPSE_LEFT = "section-collapse-left";
    colibri.ICON_CONTROL_SECTION_EXPAND = "section-expand";
    colibri.ICON_CONTROL_CLOSE = "close";
    colibri.ICON_CONTROL_DIRTY = "dirty";
    colibri.ICON_INSPECTOR = "inspector";
    class ColibriPlugin extends colibri.Plugin {
        static _instance;
        static getInstance() {
            return this._instance ?? (this._instance = new ColibriPlugin());
        }
        constructor() {
            super("colibri", { loadIconsFromAtlas: true });
        }
        registerExtensions(reg) {
            // themes
            reg.addExtension(new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.LIGHT_THEME), new colibri.ui.ide.themes.ThemeExtension(colibri.ui.controls.Controls.DARK_THEME));
            // keys
            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(colibri.ui.ide.actions.ColibriCommands.registerCommands));
            // file storage
            reg.addExtension(new colibri.core.io.HTTPServerFileStorageExtension());
            // editor inputs
            reg.addExtension(new colibri.ui.ide.FileEditorInputExtension());
            // content types
            reg.addExtension(new colibri.core.ContentTypeExtension([new colibri.core.PublicRootContentTypeResolver()]));
        }
    }
    colibri.ColibriPlugin = ColibriPlugin;
    colibri.Platform.addPlugin(ColibriPlugin.getInstance());
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    class Extension {
        static DEFAULT_PRIORITY;
        _extensionPoint;
        _priority;
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
        setPriority(priority) {
            this._priority = priority;
        }
    }
    colibri.Extension = Extension;
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    class ExtensionRegistry {
        _map;
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
                const list = this._map.get(point);
                list.sort((a, b) => a.getPriority() - b.getPriority());
            }
        }
        getExtensions(point) {
            const list = this._map.get(point);
            if (!list) {
                return [];
            }
            list.sort((a, b) => a.getPriority() - b.getPriority());
            return list;
        }
    }
    colibri.ExtensionRegistry = ExtensionRegistry;
})(colibri || (colibri = {}));
var exprEval;
(function (exprEval) {
})(exprEval || (exprEval = {}));
/// <reference path="../Extension.ts" />
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        class ContentTypeExtension extends colibri.Extension {
            static POINT_ID = "colibri.ContentTypeExtension";
            _resolvers;
            constructor(resolvers, priority = 10) {
                super(ContentTypeExtension.POINT_ID, priority);
                this._resolvers = resolvers;
            }
            getResolvers() {
                return this._resolvers;
            }
        }
        core.ContentTypeExtension = ContentTypeExtension;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class ContentCache {
                _backendGetContent;
                _backendSetContent;
                _map;
                _preloadMap;
                constructor(getContent, setContent) {
                    this._backendGetContent = getContent;
                    this._backendSetContent = setContent;
                    this.reset();
                }
                reset() {
                    this._map = new Map();
                    this._preloadMap = new Map();
                }
                preload(object, force = false) {
                    const objKey = this.computeObjectKey(object);
                    if (this._preloadMap.has(objKey)) {
                        return this._preloadMap.get(objKey);
                    }
                    const entry = this._map.get(objKey);
                    const currentHash = this.computeObjectHash(object);
                    if (entry) {
                        if (!force && entry.contentHash === currentHash) {
                            return colibri.ui.controls.Controls.resolveNothingLoaded();
                        }
                        const promise2 = this._backendGetContent(object, force)
                            .then((content) => {
                            this._preloadMap.delete(objKey);
                            entry.contentHash = this.computeObjectHash(object);
                            entry.content = content;
                            return Promise.resolve(colibri.ui.controls.PreloadResult.RESOURCES_LOADED);
                        });
                        this._preloadMap.set(objKey, promise2);
                        return promise2;
                    }
                    const promise = this._backendGetContent(object, force)
                        .then((content) => {
                        this._preloadMap.delete(objKey);
                        this._map.set(objKey, new ContentEntry(content, currentHash));
                        return colibri.ui.controls.PreloadResult.RESOURCES_LOADED;
                    });
                    this._preloadMap.set(objKey, promise);
                    return promise;
                }
                getContent(obj) {
                    const objKey = this.computeObjectKey(obj);
                    const entry = this._map.get(objKey);
                    return entry ? entry.content : null;
                }
                async setContent(object, content) {
                    const objectKey = this.computeObjectKey(object);
                    let entry = this._map.get(objectKey);
                    const currentHash = this.computeObjectHash(object);
                    if (entry) {
                        entry.content = content;
                    }
                    else {
                        this._map.set(objectKey, entry = new ContentEntry(content, currentHash));
                    }
                    if (this._backendSetContent) {
                        await this._backendSetContent(object, content);
                    }
                    entry.contentHash = currentHash;
                }
                hasObject(object) {
                    const key = this.computeObjectKey(object);
                    return this._map.has(key);
                }
            }
            io.ContentCache = ContentCache;
            class ContentEntry {
                content;
                contentHash;
                constructor(content, contentHash) {
                    this.content = content;
                    this.contentHash = contentHash;
                }
            }
            io.ContentEntry = ContentEntry;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
/// <reference path="./ContentCache.ts"/>
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FileContentCache extends io.ContentCache {
                computeObjectHash(file) {
                    return file.getModTime().toString();
                }
                computeObjectKey(file) {
                    return file.getFullName();
                }
            }
            io.FileContentCache = FileContentCache;
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
            _resolvers;
            _cache;
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
            async preloadAndGetContentType(file) {
                await this.preload(file);
                return this.getCachedContentType(file);
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
            _id;
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
        class ContentTypeResolverByExtension extends colibri.core.ContentTypeResolver {
            _map;
            constructor(id, defs) {
                super(id);
                this._map = new Map();
                for (const def of defs) {
                    this._map.set(def[0].toUpperCase(), def[1]);
                }
            }
            computeContentType(file) {
                const ext = file.getExtension().toUpperCase();
                if (this._map.has(ext)) {
                    return Promise.resolve(this._map.get(ext));
                }
                return Promise.resolve(colibri.core.CONTENT_TYPE_ANY);
            }
        }
        core.ContentTypeResolverByExtension = ContentTypeResolverByExtension;
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
        core.CONTENT_TYPE_PUBLIC_ROOT = "colibri.core.PublicRootContentType";
        class PublicRootContentTypeResolver extends core.ContentTypeResolver {
            static ID = "colibri.core.PublicRootContentTypeResolver";
            constructor() {
                super(PublicRootContentTypeResolver.ID);
            }
            async computeContentType(file) {
                return file.getName() === "publicroot" ? core.CONTENT_TYPE_PUBLIC_ROOT : core.CONTENT_TYPE_ANY;
            }
        }
        core.PublicRootContentTypeResolver = PublicRootContentTypeResolver;
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var debug;
    (function (debug) {
        function getEditorSelectedObject() {
            return getEditorSelection()[0];
        }
        debug.getEditorSelectedObject = getEditorSelectedObject;
        function getEditorSelection() {
            return colibri.Platform.getWorkbench().getActiveEditor().getSelection();
        }
        debug.getEditorSelection = getEditorSelection;
        function getPartSelection() {
            return colibri.Platform.getWorkbench().getActivePart().getSelection();
        }
        debug.getPartSelection = getPartSelection;
        function getPartSelectedObject() {
            return getPartSelection()[0];
        }
        debug.getPartSelectedObject = getPartSelectedObject;
    })(debug = colibri.debug || (colibri.debug = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FileBinaryCache extends io.FileContentCache {
                constructor(storage) {
                    super(file => storage.getFileBinary(file), (file, content) => {
                        throw new Error("Not implemented yet.");
                    });
                }
            }
            io.FileBinaryCache = FileBinaryCache;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var core;
    (function (core) {
        var io;
        (function (io) {
            class FilePath {
                _parent;
                _name;
                _nameWithoutExtension;
                _isFile;
                _files;
                _ext;
                _modTime;
                _fileSize;
                _alive;
                constructor(parent, fileData) {
                    this._parent = parent;
                    this._isFile = fileData.isFile;
                    this._fileSize = fileData.size;
                    this._modTime = fileData.modTime;
                    this._alive = true;
                    this._setName(fileData.name);
                    if (fileData.children) {
                        this._files = [];
                        for (const child of fileData.children) {
                            this._files.push(new FilePath(this, child));
                        }
                        this._sort();
                    }
                    else {
                        this._files = [];
                    }
                }
                static join(path1, path2) {
                    let result = path1;
                    if (!path1.endsWith("/")) {
                        result += "/";
                    }
                    if (path2.startsWith("/")) {
                        result += path2.substring(1);
                    }
                    else {
                        result += path2;
                    }
                    return result;
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
                    if (this.isFile()) {
                        return this._fileSize;
                    }
                    let size = 0;
                    for (const file of this.getFiles()) {
                        size += file.getSize();
                    }
                    return size;
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
                getProjectRelativeName() {
                    if (this._parent) {
                        return this._parent.getProjectRelativeName() + "/" + this._name;
                    }
                    return "";
                }
                getUrl() {
                    let relName = this.getProjectRelativeName();
                    if (this.isFile()) {
                        relName += "?m=" + this.getModTime();
                    }
                    return `./project${relName}`;
                }
                getExternalUrl() {
                    return `./external${this.getProjectRelativeName()}`;
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
                isRoot() {
                    return this._parent === null || this._parent === undefined;
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
                visit(visitor) {
                    visitor(this);
                    for (const file of this._files) {
                        file.visit(visitor);
                    }
                }
                async visitAsync(visitor) {
                    await visitor(this);
                    for (const file of this._files) {
                        await file.visitAsync(visitor);
                    }
                }
                _add(file) {
                    file._remove();
                    file._parent = this;
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
                        for (const file of this._files) {
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
            let FileStorageChangeCause;
            (function (FileStorageChangeCause) {
                FileStorageChangeCause[FileStorageChangeCause["WINDOW_FOCUS"] = 0] = "WINDOW_FOCUS";
                FileStorageChangeCause[FileStorageChangeCause["OTHER"] = 1] = "OTHER";
            })(FileStorageChangeCause = io.FileStorageChangeCause || (io.FileStorageChangeCause = {}));
            class FileStorageChange {
                _renameRecords_fromPath;
                _renameRecords_toPath;
                _renameFromToMap;
                _deletedRecords;
                _addedRecords;
                _modifiedRecords;
                _fullProjectReload;
                _cause;
                constructor(cause = FileStorageChangeCause.OTHER) {
                    this._renameRecords_fromPath = new Set();
                    this._renameRecords_toPath = new Set();
                    this._deletedRecords = new Set();
                    this._addedRecords = new Set();
                    this._modifiedRecords = new Set();
                    this._renameFromToMap = new Map();
                    this._cause = cause;
                }
                getCause() {
                    return this._cause;
                }
                fullProjectLoaded() {
                    this._fullProjectReload = true;
                }
                isFullProjectReload() {
                    return this._fullProjectReload;
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
            class FileStorageExtension extends colibri.Extension {
                static POINT_ID = "colibri.core.io.FileStorageExtension";
                _storageId;
                constructor(storageId, priority = 10) {
                    super(FileStorageExtension.POINT_ID, priority);
                    this._storageId = storageId;
                }
                getStorageId() {
                    return this._storageId;
                }
            }
            io.FileStorageExtension = FileStorageExtension;
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
            class HTTPServerFileStorageExtension extends io.FileStorageExtension {
                constructor() {
                    super("HttpServerFileStorage");
                }
                createStorage() {
                    return new io.HTTPServerFileStorage();
                }
            }
            io.HTTPServerFileStorageExtension = HTTPServerFileStorageExtension;
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
                            method,
                            body
                        })
                    });
                    const json = await resp.json();
                    // This could happens in servers with session handling.
                    // If the session expired, then the server send a redirect message.
                    if (json.redirect) {
                        document.location.href = json.redirect;
                    }
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
            class HTTPServerFileStorage {
                _root;
                _changeListeners;
                _hash;
                constructor() {
                    this._root = null;
                    this._hash = "";
                    this._changeListeners = [];
                    this.registerDocumentVisibilityListener();
                }
                registerDocumentVisibilityListener() {
                    colibri.Platform.getWorkbench().eventWindowFocused.addListener(async () => {
                        await this.detectServerChangesOnWindowsFocus();
                    });
                }
                async detectServerChangesOnWindowsFocus() {
                    const hashData = await apiRequest("GetProjectFilesHash", {});
                    if (hashData.error) {
                        alert(hashData.error);
                        return;
                    }
                    const hash = hashData.hash;
                    if (hash === this._hash) {
                        // nothing to do!
                        console.log("Server files not changed (hash=" + hash + ")");
                        return;
                    }
                    this._hash = hash;
                    const data = await apiRequest("GetProjectFiles", {});
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
                    if (data.projectNumberOfFiles > data.maxNumberOfFiles) {
                        this.showMaxNumberOfFilesDialog(data.projectNumberOfFiles, data.maxNumberOfFiles);
                        return;
                    }
                    const change = new io.FileStorageChange(io.FileStorageChangeCause.WINDOW_FOCUS);
                    const localFiles = this._root.flatTree([], true);
                    const serverFiles = new io.FilePath(null, data.rootFile).flatTree([], true);
                    const filesToContentTypePreload = [];
                    const localFilesMap = new Map();
                    for (const file of localFiles) {
                        localFilesMap.set(file.getFullName(), file);
                    }
                    const serverFilesMap = new Map();
                    for (const file of serverFiles) {
                        serverFilesMap.set(file.getFullName(), file);
                    }
                    // compute modified files
                    {
                        for (const file of localFiles) {
                            const fileFullName = file.getFullName();
                            const serverFile = serverFilesMap.get(fileFullName);
                            if (serverFile) {
                                if (serverFile.getModTime() !== file.getModTime() || serverFile.getSize() !== file.getSize()) {
                                    console.log("Modified - " + fileFullName);
                                    file._setModTime(serverFile.getModTime());
                                    file._setSize(serverFile.getSize());
                                    change.recordModify(fileFullName);
                                    filesToContentTypePreload.push(file);
                                }
                            }
                        }
                    }
                    // compute deleted files
                    {
                        const deletedFilesNamesSet = new Set();
                        for (const file of localFiles) {
                            const fileFullName = file.getFullName();
                            if (deletedFilesNamesSet.has(fileFullName)) {
                                // when a parent folder was reported as deleted
                                continue;
                            }
                            if (!serverFilesMap.has(fileFullName)) {
                                console.log("Deleted " + fileFullName);
                                file._remove();
                                change.recordDelete(fileFullName);
                                if (file.isFolder()) {
                                    for (const child of file.getFiles()) {
                                        deletedFilesNamesSet.add(child.getFullName());
                                    }
                                }
                            }
                        }
                    }
                    // compute added files
                    {
                        const addedFilesNamesSet = new Set();
                        for (const file of serverFiles) {
                            const fileFullName = file.getFullName();
                            if (addedFilesNamesSet.has(fileFullName)) {
                                // when a parent folder was reported as added
                                continue;
                            }
                            if (!localFilesMap.has(fileFullName)) {
                                console.log("Added " + fileFullName);
                                const localParentFile = localFilesMap.get(file.getParent().getFullName());
                                localParentFile._add(file);
                                file.visit(f => {
                                    localFilesMap.set(f.getFullName(), f);
                                    filesToContentTypePreload.push(f);
                                });
                                change.recordAdd(fileFullName);
                                if (file.isFolder()) {
                                    for (const child of file.getFiles()) {
                                        addedFilesNamesSet.add(child.getFullName());
                                    }
                                }
                            }
                        }
                    }
                    const reg = colibri.Platform.getWorkbench().getContentTypeRegistry();
                    for (const file of filesToContentTypePreload) {
                        await reg.preload(file);
                    }
                    this.fireChange(change);
                }
                showMaxNumberOfFilesDialog(projectNumberOfFiles, maxNumberOfFiles) {
                    alert(`
                    Your project exceeded the maximum number of files allowed (${projectNumberOfFiles} > ${maxNumberOfFiles}).
                    Please, check the
                    <a href="https://help.phasereditor2d.com/v3/misc/resources-filtering.html" target="_blank">Resources Filtering</a>
                    documentation.
                `);
                }
                addChangeListener(listener) {
                    this._changeListeners.push(listener);
                }
                addFirstChangeListener(listener) {
                    this._changeListeners.unshift(listener);
                }
                removeChangeListener(listener) {
                    const i = this._changeListeners.indexOf(listener);
                    this._changeListeners.splice(i, 1);
                }
                getRoot() {
                    return this._root;
                }
                async openProject() {
                    this._root = null;
                    this._hash = "";
                    await this.reload();
                    const root = this.getRoot();
                    const change = new io.FileStorageChange();
                    change.fullProjectLoaded();
                    this.fireChange(change);
                    return root;
                }
                async reload() {
                    const data = await apiRequest("GetProjectFiles", {});
                    let newRoot;
                    if (data.projectNumberOfFiles > data.maxNumberOfFiles) {
                        newRoot = new io.FilePath(null, {
                            name: "Unavailable",
                            modTime: 0,
                            size: 0,
                            children: [],
                            isFile: false
                        });
                        this.showMaxNumberOfFilesDialog(data.projectNumberOfFiles, data.maxNumberOfFiles);
                    }
                    else {
                        newRoot = new io.FilePath(null, data.rootFile);
                    }
                    this._hash = data.hash;
                    this._root = newRoot;
                }
                async fireChange(change) {
                    for (const listener of this._changeListeners) {
                        try {
                            const result = listener(change);
                            if (result instanceof Promise) {
                                await result;
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
                async createFile(folder, fileName, content) {
                    const file = new io.FilePath(folder, {
                        children: [],
                        isFile: true,
                        name: fileName,
                        size: 0,
                        modTime: 0
                    });
                    await this.server_setFileString(file, content);
                    folder._add(file);
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    change.recordAdd(file.getFullName());
                    await this.fireChange(change);
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
                    const path = io.FilePath.join(container.getFullName(), folderName);
                    const data = await apiRequest("CreateFolder", {
                        path
                    });
                    if (data.error) {
                        alert(`Cannot create folder at '${path}'`);
                        throw new Error(data.error);
                    }
                    newFolder["_modTime"] = data["modTime"];
                    container["_files"].push(newFolder);
                    container._sort();
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    change.recordAdd(newFolder.getFullName());
                    this.fireChange(change);
                    return newFolder;
                }
                async getFileBinary(file) {
                    const content = await this.server_getFileBinary(file);
                    return content;
                }
                async server_getFileBinary(file) {
                    const resp = await fetch(file.getUrl(), {
                        method: "GET",
                        cache: "force-cache"
                    });
                    const content = await resp.arrayBuffer();
                    if (!resp.ok) {
                        alert(`Cannot get the content of file '${file.getFullName()}'.`);
                        return null;
                    }
                    return content;
                }
                async server_getFileString(file) {
                    const resp = await fetch(file.getUrl(), {
                        method: "GET",
                        cache: "force-cache"
                    });
                    const content = await resp.text();
                    if (!resp.ok) {
                        alert(`Cannot get the content of file '${file.getFullName()}'.`);
                        return null;
                    }
                    return content;
                }
                async getFileString(file) {
                    const content = await this.server_getFileString(file);
                    return content;
                }
                async setFileString(file, content) {
                    await this.server_setFileString(file, content);
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    change.recordModify(file.getFullName());
                    this.fireChange(change);
                }
                async server_setFileString(file, content) {
                    const data = await apiRequest("SetFileString", {
                        path: file.getFullName(),
                        content
                    });
                    if (data.error) {
                        alert(`Cannot set file content to '${file.getFullName()}'`);
                        throw new Error(data.error);
                    }
                    const fileData = data;
                    file._setModTime(fileData.modTime);
                    file._setSize(fileData.size);
                }
                async server_deleteFiles(files) {
                    const data = await apiRequest("DeleteFiles", {
                        paths: files.map(file => file.getFullName())
                    });
                    if (data.error) {
                        alert(`Cannot delete the files.`);
                        throw new Error(data.error);
                    }
                }
                async deleteFiles(files) {
                    await this.server_deleteFiles(files);
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
                    this._hash = "";
                    this.fireChange(change);
                }
                async server_renameFile(file, newName) {
                    const data = await apiRequest("RenameFile", {
                        oldPath: file.getFullName(),
                        newPath: io.FilePath.join(file.getParent().getFullName(), newName)
                    });
                    if (data.error) {
                        alert(`Cannot rename the file.`);
                        throw new Error(data.error);
                    }
                }
                async renameFile(file, newName) {
                    await this.server_renameFile(file, newName);
                    const fromPath = file.getFullName();
                    file._setName(newName);
                    file.getParent()._sort();
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    change.recordRename(fromPath, file.getFullName());
                    this.fireChange(change);
                }
                async copyFile(fromFile, toFolder) {
                    const base = fromFile.getNameWithoutExtension();
                    let ext = fromFile.getExtension();
                    if (ext) {
                        ext = "." + ext;
                    }
                    let suffix = "";
                    while (toFolder.getFile(base + suffix + ext)) {
                        suffix += "_copy";
                    }
                    const newName = base + suffix + ext;
                    const fileData = await this.server_copyFile(fromFile, toFolder, newName);
                    const newFile = new io.FilePath(null, fileData);
                    toFolder._add(newFile);
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    change.recordAdd(newFile.getFullName());
                    this.fireChange(change);
                    return newFile;
                }
                async server_copyFile(fromFile, toFolder, newName) {
                    const data = await apiRequest("CopyFile", {
                        fromPath: fromFile.getFullName(),
                        toPath: io.FilePath.join(toFolder.getFullName(), newName)
                    });
                    if (data.error) {
                        alert(`Cannot copy the file ${fromFile.getFullName()}`);
                        throw new Error(data.error);
                    }
                    const fileData = data.file;
                    return fileData;
                }
                async moveFiles(movingFiles, moveTo) {
                    await this.server_moveFiles(movingFiles, moveTo);
                    const records = movingFiles.map(file => {
                        return {
                            from: file.getFullName(),
                            to: io.FilePath.join(moveTo.getFullName(), file.getName())
                        };
                    });
                    for (const srcFile of movingFiles) {
                        const i = srcFile.getParent().getFiles().indexOf(srcFile);
                        srcFile.getParent().getFiles().splice(i, 1);
                        moveTo._add(srcFile);
                    }
                    this._hash = "";
                    const change = new io.FileStorageChange();
                    for (const record of records) {
                        change.recordRename(record.from, record.to);
                    }
                    this.fireChange(change);
                }
                async server_moveFiles(movingFiles, moveTo) {
                    const data = await apiRequest("MoveFiles", {
                        movingPaths: movingFiles.map(file => file.getFullName()),
                        movingToPath: moveTo.getFullName()
                    });
                    if (data.error) {
                        alert(`Cannot move the files.`);
                        throw new Error(data.error);
                    }
                }
                async server_uploadFile(uploadFolder, htmlFile) {
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
                    return data.file;
                }
                async uploadFile(uploadFolder, htmlFile) {
                    const fileData = await this.server_uploadFile(uploadFolder, htmlFile);
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
                    this._hash = "";
                    this.fireChange(change);
                    return file;
                }
                async getImageSize(file) {
                    const key = "GetImageSize_" + file.getFullName() + "@" + file.getModTime();
                    const cache = localStorage.getItem(key);
                    if (cache) {
                        return JSON.parse(cache);
                    }
                    const data = await colibri.core.io.apiRequest("GetImageSize", {
                        path: file.getFullName()
                    });
                    if (data.error) {
                        return null;
                    }
                    const size = {
                        width: data.width,
                        height: data.height
                    };
                    window.localStorage.setItem(key, JSON.stringify(size));
                    return size;
                }
            }
            io.HTTPServerFileStorage = HTTPServerFileStorage;
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
                _getContent;
                _map;
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
                    const fileModTime = file.getModTime().toString();
                    if (entry) {
                        if (entry.contentHash === fileModTime) {
                            return entry.content;
                        }
                        const content2 = this._getContent(file);
                        entry.contentHash = fileModTime;
                        entry.content = content2;
                        return content2;
                    }
                    const content = this._getContent(file);
                    this._map.set(filename, new io.ContentEntry(content, fileModTime));
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
            function copy(data) {
                return JSON.parse(JSON.stringify(data));
            }
            json.copy = copy;
            function getDataValue(data, key) {
                let result = data;
                const keys = key.split(".");
                for (const key2 of keys) {
                    if (result !== undefined) {
                        result = result[key2];
                    }
                }
                return result;
            }
            json.getDataValue = getDataValue;
            function setDataValue(data, key, value) {
                const keys = key.split(".");
                const lastKey = keys[keys.length - 1];
                for (let i = 0; i < keys.length - 1; i++) {
                    const key2 = keys[i];
                    if (key2 in data) {
                        data = data[key2];
                    }
                    else {
                        data = (data[key2] = {});
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
                _preferencesSpace;
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
                    const data = this.readData();
                    return data[key] ?? defaultValue;
                }
            }
            preferences.Preferences = Preferences;
        })(preferences = core.preferences || (core.preferences = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Action {
                _text;
                _tooltip;
                _commandId;
                _icon;
                _enabled;
                _showText;
                _selected;
                _callback;
                eventActionChanged = new controls.ListenerList();
                constructor(config) {
                    this._text = config.text ?? "";
                    this._tooltip = config.tooltip ?? "";
                    this._showText = config.showText !== false;
                    this._icon = config.icon ?? null;
                    this._enabled = config.enabled === undefined || config.enabled;
                    this._callback = config.callback ?? null;
                    this._commandId = config.commandId ?? null;
                    this._selected = config.selected ?? false;
                    if (this._commandId) {
                        const manager = colibri.Platform.getWorkbench().getCommandManager();
                        const command = manager.getCommand(this._commandId);
                        if (command) {
                            this._text = this._text || command.getName();
                            this._tooltip = this._tooltip || command.getTooltip();
                            this._icon = this._icon || command.getIcon();
                            this._enabled = config.enabled === undefined
                                ? manager.canRunCommand(command.getId())
                                : config.enabled;
                        }
                    }
                }
                isSelected() {
                    return this._selected;
                }
                setSelected(selected) {
                    this._selected = selected;
                    this.eventActionChanged.fire();
                }
                getCommandId() {
                    return this._commandId;
                }
                getCommandKeyString() {
                    if (!this._commandId) {
                        return "";
                    }
                    const manager = colibri.Platform.getWorkbench().getCommandManager();
                    return manager.getCommandKeyString(this._commandId);
                }
                isEnabled() {
                    return this._enabled;
                }
                isShowText() {
                    return this._showText;
                }
                getText() {
                    return this._text;
                }
                getTooltip() {
                    return this._tooltip;
                }
                getIcon() {
                    return this._icon;
                }
                run(e) {
                    if (this._callback) {
                        this._callback(e, this);
                        return;
                    }
                    if (this._commandId) {
                        colibri.Platform.getWorkbench().getCommandManager().executeCommand(this._commandId);
                    }
                }
            }
            controls.Action = Action;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            /**
             * Reads an image from an atlas. The atlas is in the JSON (Hash) format.
             */
            class AtlasImage {
                _plugin;
                _frame;
                constructor(plugin, frame) {
                    this._plugin = plugin;
                    this._frame = frame;
                }
                paint(context, x, y, w, h, center) {
                    const frameData = this.getFrameData();
                    const atlasImage = this._plugin.getIconsAtlasImage();
                    const frame = frameData.frame;
                    const sprite = frameData.spriteSourceSize;
                    const factor = controls.ICON_SIZE === 32 ? 0.5 : 1;
                    const ox = sprite.x * factor;
                    const oy = sprite.y * factor;
                    const ow = sprite.w * factor;
                    const oh = sprite.h * factor;
                    atlasImage.paintFrame(context, frame.x, frame.y, frame.w, frame.h, x + ox, y + oy, ow, oh);
                }
                getFrameData() {
                    return this._plugin.getFrameDataFromIconsAtlas(this._frame);
                }
                paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    // not implemented
                }
                preload() {
                    // delegates resources loading
                    // to the clients of this class
                    return controls.Controls.resolveResourceLoaded();
                }
                getWidth() {
                    return this.getFrameData().sourceSize.w;
                }
                getHeight() {
                    return this.getFrameData().sourceSize.h;
                }
                preloadSize() {
                    // delegates resources loading
                    // to the clients of this class
                    return controls.Controls.resolveResourceLoaded();
                }
            }
            controls.AtlasImage = AtlasImage;
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
                _canvas;
                _context;
                _padding;
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
                    this.style.width = Math.floor(b.width - this._padding * 2) + "px";
                    this.style.height = Math.floor(b.height - this._padding * 2) + "px";
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
                    this._context.font = `${controls.getCanvasFontHeight()}px sans-serif`;
                }
                paint() {
                    // nothing
                }
                ;
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
            class CanvasProgressMonitor {
                _canvas;
                _total;
                _progress;
                _ctx;
                constructor(canvas) {
                    this._canvas = canvas;
                    this._progress = 0;
                    this._total = 0;
                    this._ctx = this._canvas.getContext("2d");
                }
                addTotal(total) {
                    this._total = total;
                    this.render();
                }
                step() {
                    this._progress += 1;
                    this.render();
                }
                render() {
                    const ctx = this._ctx;
                    const w = this._canvas.width / (window.devicePixelRatio || 1);
                    const h = this._canvas.height / (window.devicePixelRatio || 1);
                    const margin = w * 0.4;
                    const y = h * 0.5;
                    const f = Math.min(1, this._progress / this._total);
                    const len = f * (w - margin * 2);
                    ctx.clearRect(0, 0, w, h);
                    ctx.save();
                    ctx.fillStyle = "#ffffff44";
                    ctx.fillRect(margin, y - 1, w - margin * 2, 2);
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(margin, y - 1, len, 2);
                    ctx.fillStyle = "#ffffffaa";
                    ctx.fillText("loading", margin, y - 10);
                    ctx.restore();
                }
            }
            controls.CanvasProgressMonitor = CanvasProgressMonitor;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ColorPickerManager {
                static _currentPicker;
                static _set = false;
                static createPicker() {
                    this.setupPicker();
                    this._currentPicker = new Picker(document.body);
                    return this._currentPicker;
                }
                static isActivePicker() {
                    const picker = ColorPickerManager._currentPicker;
                    if (picker) {
                        const elem = picker.domElement;
                        return elem.isConnected;
                    }
                    return false;
                }
                static closeActive() {
                    const picker = ColorPickerManager._currentPicker;
                    if (picker) {
                        this._currentPicker = null;
                        picker.onClose(null);
                        picker.destroy();
                    }
                }
                static setupPicker() {
                    if (this._set) {
                        return;
                    }
                    window.addEventListener("keydown", e => {
                        if (e.code === "Escape") {
                            const picker = ColorPickerManager._currentPicker;
                            if (picker) {
                                if (ColorPickerManager.isActivePicker()) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    ColorPickerManager.closeActive();
                                }
                            }
                        }
                    });
                }
            }
            controls.ColorPickerManager = ColorPickerManager;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class Colors {
                static parseColor(htmlColor) {
                    if (htmlColor.startsWith("0x")) {
                        htmlColor = "#" + htmlColor.substring(2);
                    }
                    const vanillaColor = window["VanillaColor"];
                    const rgba = new vanillaColor(htmlColor).rgba;
                    return {
                        r: rgba[0],
                        g: rgba[1],
                        b: rgba[2],
                        a: rgba[3],
                    };
                }
            }
            controls.Colors = Colors;
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
                _ready;
                _error;
                _url;
                _imageElement;
                _requestPromise;
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
                    const naturalWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
                    const naturalHeight = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
                    const renderHeight = h;
                    const renderWidth = w;
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
                    const scale = imgW / naturalWidth;
                    const imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
                    const imgY = y + renderHeight / 2 - imgH / 2;
                    const imgDstW = naturalWidth * scale;
                    const imgDstH = naturalHeight * scale;
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
            controls.EMPTY_PROGRESS_MONITOR = {
                addTotal: (n) => {
                    // nothing
                },
                step: () => {
                    // nothing
                }
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
                _padding = 0;
                constructor(padding = 0) {
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
                index;
                src;
                dst;
                srcSize;
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
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class IconControl {
                _icon;
                _context;
                _canvas;
                static _themeListenerRegistered = false;
                constructor(icon, isButtonStyle = false) {
                    const size = controls.RENDER_ICON_SIZE;
                    this._canvas = document.createElement("canvas");
                    this._canvas["__IconControl"] = this;
                    this._canvas.classList.add("IconControlCanvas");
                    this._canvas.width = this._canvas.height = size;
                    this._canvas.style.width = this._canvas.style.height = size + "px";
                    this._context = this._canvas.getContext("2d");
                    this._context.imageSmoothingEnabled = false;
                    controls.Controls.adjustCanvasDPI(this._canvas, size, size);
                    this.setIcon(icon);
                    if (isButtonStyle) {
                        this._canvas.classList.add("IconButton");
                    }
                    if (!IconControl._themeListenerRegistered) {
                        IconControl._themeListenerRegistered = true;
                        colibri.Platform.getWorkbench().eventThemeChanged.addListener(() => {
                            const result = document.getElementsByClassName("IconControlCanvas");
                            for (let i = 0; i < result.length; i++) {
                                const elem = result.item(i);
                                const control = IconControl.getIconControlOf(elem);
                                control.repaint();
                            }
                        });
                    }
                }
                static getIconControlOf(element) {
                    return element["__IconControl"];
                }
                repaint() {
                    if (this._icon) {
                        const size = controls.RENDER_ICON_SIZE;
                        this._context.clearRect(0, 0, size, size);
                        this._icon.paint(this._context, 0, 0, size, size, true);
                    }
                }
                getCanvas() {
                    return this._canvas;
                }
                getIcon() {
                    return this._icon;
                }
                setIcon(icon, repaint = true) {
                    this._icon = icon;
                    if (repaint) {
                        this.repaint();
                    }
                }
            }
            controls.IconControl = IconControl;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class IconDescriptor {
                iconPlugin;
                iconName;
                constructor(iconPlugin, iconName) {
                    this.iconPlugin = iconPlugin;
                    this.iconName = iconName;
                }
                getIcon() {
                    return this.iconPlugin.getIcon(this.iconName);
                }
            }
            controls.IconDescriptor = IconDescriptor;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class IconImage {
                _darkImage;
                _lightImage;
                constructor(lightImage, darkImage) {
                    this._lightImage = lightImage;
                    this._darkImage = darkImage;
                }
                getNegativeThemeImage() {
                    const img = this.getThemeImage();
                    if (img === this._lightImage) {
                        return this._darkImage;
                    }
                    return this._lightImage;
                }
                getLightImage() {
                    return this._lightImage;
                }
                getDarkImage() {
                    return this._darkImage;
                }
                getThemeImage() {
                    if (controls.Controls.getTheme().dark) {
                        return this._darkImage;
                    }
                    return this._lightImage;
                }
                paint(context, x, y, w, h, center) {
                    this.getThemeImage().paint(context, x, y, w, h, center);
                }
                paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    this.getThemeImage().paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
                }
                async preload() {
                    await this._darkImage.preload();
                    return await this._lightImage.preload();
                }
                getWidth() {
                    return this.getThemeImage().getWidth();
                }
                getHeight() {
                    return this.getThemeImage().getHeight();
                }
                async preloadSize() {
                    await this._darkImage.preloadSize();
                    return await this._lightImage.preloadSize();
                }
            }
            controls.IconImage = IconImage;
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
                _image;
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
                _name;
                _image;
                _frameData;
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
                    const imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
                    const imgY = y + renderHeight / 2 - imgH / 2;
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
                _imageElement;
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
                        if (this._imageElement instanceof HTMLImageElement) {
                            return this._imageElement.naturalWidth;
                        }
                        return this._imageElement.width;
                    }
                    return 0;
                }
                getHeight() {
                    if (this._imageElement) {
                        if (this._imageElement instanceof HTMLImageElement) {
                            return this._imageElement.naturalHeight;
                        }
                        return this._imageElement.height;
                    }
                    return 0;
                }
                getImageElement() {
                    return this._imageElement;
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
            controls.CANCEL_EVENT = "colibri.ui.controls.CANCEL_EVENT";
            class ListenerList {
                _listeners;
                constructor() {
                    this._listeners = [];
                }
                addListener(listener) {
                    const list = [...this._listeners];
                    list.push(listener);
                    this._listeners = list;
                }
                removeListener(listener) {
                    const list = this._listeners.filter(l => l !== listener);
                    this._listeners = list;
                }
                fire(listenerArgs) {
                    for (const l of this._listeners) {
                        const result = l(listenerArgs);
                        if (result === controls.CANCEL_EVENT) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            controls.ListenerList = ListenerList;
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
                _text;
                _items;
                _element;
                _bgElement;
                _menuCloseCallback;
                static _activeMenu = null;
                _subMenu;
                _parentMenu;
                _lastItemElementSelected;
                _icon;
                constructor(text, icon) {
                    this._items = [];
                    this._text = text;
                    this._icon = icon;
                }
                getIcon() {
                    return this._icon;
                }
                setIcon(icon) {
                    this._icon = icon;
                }
                setMenuClosedCallback(callback) {
                    this._menuCloseCallback = callback;
                }
                add(action) {
                    this._items.push(action);
                }
                addAction(actionConfig) {
                    this.add(new controls.Action(actionConfig));
                }
                addMenu(subMenu) {
                    subMenu._parentMenu = this;
                    this._items.push(subMenu);
                }
                addCommand(commandId, config) {
                    if (!config) {
                        config = {};
                    }
                    config.commandId = commandId;
                    this.add(new controls.Action(config));
                }
                addExtension(menuId) {
                    const exts = colibri.Platform.getExtensions(controls.MenuExtension.POINT_ID);
                    for (const ext of exts) {
                        if (ext.getMenuId() === menuId) {
                            ext.fillMenu(this);
                        }
                    }
                }
                addSeparator() {
                    this._items.push(null);
                }
                isEmpty() {
                    return this._items.length === 0;
                }
                getElement() {
                    return this._element;
                }
                static closeAll() {
                    if (this._activeMenu) {
                        this._activeMenu.closeAll();
                    }
                }
                static getActiveMenu() {
                    if (this._activeMenu && !this._activeMenu._element.isConnected) {
                        this._activeMenu = undefined;
                    }
                    return this._activeMenu;
                }
                create(x, y, modal, openLeft) {
                    if (this._items.length === 0) {
                        return;
                    }
                    Menu._activeMenu = this;
                    this._element = document.createElement("div");
                    this._element.classList.add("Menu");
                    let lastIsSeparator = true;
                    let hasIcon = false;
                    for (const item of this._items) {
                        if (item === null) {
                            if (!lastIsSeparator) {
                                lastIsSeparator = true;
                                const sepElement = document.createElement("div");
                                sepElement.classList.add("MenuItemSeparator");
                                this._element.appendChild(sepElement);
                            }
                            continue;
                        }
                        lastIsSeparator = false;
                        const itemElement = document.createElement("div");
                        itemElement.classList.add("MenuItem");
                        const icon = item.getIcon();
                        if (item instanceof controls.Action) {
                            if (item.isSelected()) {
                                const checkElement = document.createElement("span");
                                checkElement.innerHTML = "&check;";
                                checkElement.classList.add("MenuItemCheckedIcon");
                                itemElement.appendChild(checkElement);
                            }
                            if (icon) {
                                this.createIconPart(icon, itemElement);
                                hasIcon = true;
                            }
                            const labelElement = document.createElement("label");
                            labelElement.classList.add("MenuItemText");
                            labelElement.innerText = item.getText();
                            itemElement.appendChild(labelElement);
                            const keyString = item.getCommandKeyString();
                            if (keyString) {
                                const keyElement = document.createElement("span");
                                keyElement.innerText = keyString;
                                keyElement.classList.add("MenuItemKeyString");
                                itemElement.appendChild(keyElement);
                            }
                            if (item.isEnabled()) {
                                itemElement.addEventListener("click", ev => {
                                    this.closeAll();
                                    item.run();
                                });
                            }
                            else {
                                itemElement.classList.add("MenuItemDisabled");
                            }
                            itemElement.addEventListener("mouseenter", e => {
                                this.closeSubMenu();
                            });
                        }
                        else {
                            const subMenu = item;
                            if (icon) {
                                this.createIconPart(subMenu.getIcon(), itemElement);
                                hasIcon = true;
                            }
                            const labelElement = document.createElement("label");
                            labelElement.classList.add("MenuItemText");
                            labelElement.innerText = subMenu.getText();
                            itemElement.appendChild(labelElement);
                            itemElement.addEventListener("mouseenter", e => {
                                this.closeSubMenu();
                                itemElement.classList.add("MenuItemSelected");
                                const menuRect = this._element.getClientRects().item(0);
                                const subMenuX = menuRect.right;
                                const subMenuY = menuRect.top;
                                subMenu.create(subMenuX - 5, subMenuY + itemElement.offsetTop, false);
                                if (subMenu._element) {
                                    const subMenuRect = subMenu._element.getClientRects()[0];
                                    if (Math.floor(subMenuRect.left) < Math.floor(menuRect.right) - 5) {
                                        subMenu._element.style.left = menuRect.left - subMenuRect.width + 5 + "px";
                                    }
                                }
                                this._subMenu = subMenu;
                                this._lastItemElementSelected = itemElement;
                            });
                            const keyElement = document.createElement("span");
                            keyElement.innerHTML = "&RightTriangle;";
                            keyElement.classList.add("MenuItemKeyString");
                            itemElement.appendChild(keyElement);
                        }
                        this._element.appendChild(itemElement);
                    }
                    if (!hasIcon) {
                        this._element.classList.add("MenuNoIcon");
                    }
                    if (modal) {
                        this._bgElement = document.createElement("div");
                        this._bgElement.classList.add("MenuContainer");
                        const stop = (e) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        };
                        this._bgElement.addEventListener("contextmenu", stop);
                        this._bgElement.addEventListener("mouseup", stop);
                        this._bgElement.addEventListener("mousedown", (ev) => {
                            stop(ev);
                            this.closeAll();
                        });
                        document.body.appendChild(this._bgElement);
                    }
                    document.body.appendChild(this._element);
                    const rect = this._element.getClientRects()[0];
                    if (y + rect.height > window.innerHeight) {
                        y = window.innerHeight - rect.height - 10;
                    }
                    if (x + rect.width > window.innerWidth || openLeft) {
                        x -= rect.width;
                    }
                    this._element.style.left = x + "px";
                    this._element.style.top = y + "px";
                }
                createIconPart(icon, itemElement) {
                    {
                        const iconControl = new controls.IconControl(icon);
                        iconControl.getCanvas().classList.add("MenuItemIcon", "ThemeMenuItemIcon");
                        itemElement.appendChild(iconControl.getCanvas());
                    }
                    {
                        if (icon instanceof controls.IconImage) {
                            icon = icon.getNegativeThemeImage();
                        }
                        const iconControl = new controls.IconControl(icon);
                        iconControl.getCanvas().classList.add("MenuItemIcon", "NegativeMenuItemIcon");
                        itemElement.appendChild(iconControl.getCanvas());
                    }
                }
                closeSubMenu() {
                    if (this._lastItemElementSelected) {
                        this._lastItemElementSelected.classList.remove("MenuItemSelected");
                    }
                    if (this._subMenu) {
                        this._subMenu.close();
                        this._subMenu = null;
                    }
                }
                createWithEvent(e, openLeft = false, alignToElement = false) {
                    e.preventDefault();
                    if (Menu._activeMenu) {
                        Menu._activeMenu.closeAll();
                    }
                    let x = e.clientX;
                    let y = e.clientY;
                    let element = e.target;
                    const isToolbarItem = controls.ToolbarManager.isToolbarItem(element);
                    if (isToolbarItem) {
                        element = controls.ToolbarManager.findToolbarItem(element);
                    }
                    alignToElement = element instanceof HTMLButtonElement
                        || isToolbarItem
                        || element.classList.contains("IconButton")
                        || alignToElement;
                    const targetRect = element.getBoundingClientRect();
                    if (alignToElement) {
                        x = targetRect.x;
                        y = targetRect.bottom + 2;
                    }
                    this.create(x, y, true, openLeft);
                    if (alignToElement && this._element) {
                        const menuRect = this._element.getBoundingClientRect();
                        if (menuRect.width < targetRect.width) {
                            this._element.style.width = targetRect.width + "px";
                        }
                        if (menuRect.width > window.innerWidth - x || openLeft) {
                            this._element.style.left = Math.max(0, targetRect.right - menuRect.width) + "px";
                        }
                        if (menuRect.height > window.innerHeight - y) {
                            y = targetRect.top - menuRect.height;
                            if (y < 0) {
                                y = 10;
                                this._element.style.maxHeight = targetRect.top - y - 4 + "px";
                                this._element.style.overflowY = "auto";
                            }
                            this._element.style.top = y - 2 + "px";
                        }
                    }
                }
                getText() {
                    return this._text;
                }
                close() {
                    Menu._activeMenu = this._parentMenu;
                    if (this._bgElement) {
                        this._bgElement.remove();
                    }
                    if (this._element) {
                        this._element.remove();
                    }
                    if (this._menuCloseCallback) {
                        this._menuCloseCallback();
                    }
                    if (this._subMenu) {
                        this._subMenu.close();
                    }
                }
                closeAll() {
                    if (this._parentMenu) {
                        this._parentMenu.closeAll();
                        this._parentMenu = undefined;
                    }
                    this.close();
                }
            }
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
            class MenuExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.controls.menus";
                _menuId;
                _configList;
                constructor(menuId, ...configs) {
                    super(MenuExtension.POINT_ID);
                    this._menuId = menuId;
                    this._configList = configs;
                }
                getMenuId() {
                    return this._menuId;
                }
                fillMenu(menu) {
                    for (const config of this._configList) {
                        if (config.separator) {
                            menu.addSeparator();
                        }
                        else if (config.command) {
                            menu.addCommand(config.command);
                        }
                    }
                }
            }
            controls.MenuExtension = MenuExtension;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class MultiImage {
                _width;
                _height;
                _images;
                constructor(images, width, height) {
                    this._images = images;
                    this._width = width;
                    this._height = height;
                }
                paint(context, x, y, w, h, center) {
                    const imageCount = this._images.length;
                    if (imageCount === 1) {
                        const img = this._images[0];
                        img.paint(context, x, y, w, h, center);
                        return;
                    }
                    let size = Math.floor(Math.sqrt(w * h / imageCount) * 0.7) + 1;
                    if (imageCount === 1) {
                        size = Math.min(w, h);
                    }
                    const cols = Math.floor(w / size);
                    const rows = imageCount / cols + (imageCount % cols === 0 ? 0 : 1);
                    const marginX = Math.floor(Math.max(0, (w - cols * size) / 2));
                    const marginY = Math.floor(Math.max(0, (h - rows * size) / 2));
                    let x2 = x + marginX;
                    let y2 = y + marginY;
                    for (const img of this._images) {
                        img.paint(context, x2, y2, size, size, true);
                        x2 += size;
                        if (x2 + size >= w) {
                            x2 = x + marginX;
                            y2 += size + 1;
                        }
                    }
                }
                paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                    // nothing
                }
                async preload() {
                    let result = controls.PreloadResult.NOTHING_LOADED;
                    for (const image of this._images) {
                        result = Math.max(result, await image.preload());
                    }
                    return result;
                }
                resize(width, height) {
                    this._width = width;
                    this._height = height;
                }
                getWidth() {
                    return this._width;
                }
                getHeight() {
                    return this._height;
                }
                async preloadSize() {
                    return controls.PreloadResult.NOTHING_LOADED;
                }
            }
            controls.MultiImage = MultiImage;
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
                x;
                y;
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
                x;
                y;
                w;
                h;
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
                _clientControl;
                _scrollBar;
                _scrollHandler;
                _clientContentHeight = 0;
                constructor(clientControl) {
                    super("div", "ScrollPane");
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
                    return this._clientControl.getViewer();
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
                        //this.getViewer().repaint();
                        this.layout(false);
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
                    y -= e.deltaY;
                    this.setClientScrollY(y);
                }
                setClientScrollY(y) {
                    const b = this.getBounds();
                    y = Math.max(-this._clientContentHeight + b.height, y);
                    y = Math.min(0, y);
                    this.getViewer().setScrollY(y);
                    this.layout();
                }
                _startDragY = -1;
                _startScrollY = 0;
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
                layout(forceClientLayout = true) {
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
                    if (forceClientLayout) {
                        this._clientControl.layout();
                    }
                    else {
                        this._clientControl.getViewer().repaint();
                    }
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
                _leftControl;
                _rightControl;
                _horizontal;
                _splitPosition;
                _splitFactor;
                _splitWidth;
                _startDrag = -1;
                _startPos;
                constructor(left, right, horizontal = true) {
                    super("div", "split");
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
                    const inside = Math.abs(offset - this._splitPosition)
                        <= controls.SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);
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
                    const inside = Math.abs(offset - this._splitPosition)
                        <= controls.SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);
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
                    const b = this.getBounds();
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
            class CloseIconManager {
                _iconControl;
                _icon;
                _overIcon;
                constructor() {
                    this._iconControl = new controls.IconControl();
                    this._iconControl.getCanvas().classList.add("TabPaneLabelCloseIcon");
                    this._iconControl.getCanvas().addEventListener("mouseenter", e => {
                        this._iconControl.setIcon(this._overIcon);
                    });
                    this._iconControl.getCanvas().addEventListener("mouseleave", e => {
                        this._iconControl.setIcon(this._icon);
                    });
                }
                static setManager(element, manager) {
                    element["__CloseIconManager"] = manager;
                }
                static getManager(element) {
                    return element["__CloseIconManager"];
                }
                setDefaultIcon(icon) {
                    this._icon = icon;
                    this._iconControl.setIcon(icon);
                }
                setOverIcon(icon) {
                    this._overIcon = icon;
                }
                repaint() {
                    this._iconControl.repaint();
                }
                getElement() {
                    return this._iconControl.getCanvas();
                }
            }
            class TabIconManager {
                _icon;
                _canvas;
                constructor(canvas, icon) {
                    this._canvas = canvas;
                    this._icon = icon;
                }
                static createElement(icon, size) {
                    const canvas = document.createElement("canvas");
                    canvas.classList.add("TabIconImage");
                    const manager = new TabIconManager(canvas, icon);
                    canvas["__TabIconManager"] = manager;
                    manager.resize(size);
                    return canvas;
                }
                resize(size) {
                    size = Math.max(size, controls.RENDER_ICON_SIZE);
                    if (this._icon && this._icon instanceof controls.IconImage) {
                        size = controls.RENDER_ICON_SIZE;
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
                    controls.Controls.adjustCanvasDPI(this._canvas);
                    const ctx = this._canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = false;
                    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                    if (!this._icon) {
                        return;
                    }
                    const w = this._icon.getWidth();
                    const h = this._icon.getHeight();
                    const canvasWidth = this._canvas.width / controls.DEVICE_PIXEL_RATIO;
                    const canvasHeight = this._canvas.height / controls.DEVICE_PIXEL_RATIO;
                    if (w === controls.ICON_SIZE && h === controls.ICON_SIZE) {
                        // is a real, fixed size icon image
                        this._icon.paint(ctx, (canvasWidth - controls.RENDER_ICON_SIZE) / 2, (canvasHeight - controls.RENDER_ICON_SIZE) / 2, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, false);
                    }
                    else {
                        // is a scalable icon image
                        this._icon.paint(ctx, 0, 0, canvasWidth, canvasHeight, true);
                    }
                }
            }
            // export const EVENT_TAB_CLOSED = "tabClosed";
            // export const EVENT_TAB_SELECTED = "tabSelected";
            // export const EVENT_TAB_LABEL_RESIZED = "tabResized";
            class TabPane extends controls.Control {
                eventTabClosed = new controls.ListenerList();
                eventTabSelected = new controls.ListenerList();
                eventTabLabelResized = new controls.ListenerList();
                eventTabSectionSelected = new controls.ListenerList();
                _titleBarElement;
                _contentAreaElement;
                _iconSize;
                static _selectedTimeCounter = 0;
                _themeListener;
                constructor(...classList) {
                    super("div", "TabPane", ...classList);
                    this._titleBarElement = document.createElement("div");
                    this._titleBarElement.classList.add("TabPaneTitleBar");
                    this.getElement().appendChild(this._titleBarElement);
                    this._contentAreaElement = document.createElement("div");
                    this._contentAreaElement.classList.add("TabPaneContentArea");
                    this.getElement().appendChild(this._contentAreaElement);
                    this._iconSize = controls.RENDER_ICON_SIZE;
                    this.registerThemeListener();
                }
                registerThemeListener() {
                    this._themeListener = () => {
                        if (this.getElement().isConnected) {
                            const result = this.getElement().getElementsByClassName("TabIconImage");
                            for (let i = 0; i < result.length; i++) {
                                const e = result.item(i);
                                const manager = TabIconManager.getManager(e);
                                manager.repaint();
                            }
                        }
                        else {
                            colibri.Platform.getWorkbench().eventThemeChanged.removeListener(this._themeListener);
                        }
                    };
                    colibri.Platform.getWorkbench().eventThemeChanged.addListener(this._themeListener);
                }
                findSectionElement(label, section) {
                    const sectionElements = label.querySelectorAll(".TabPaneLabelSection");
                    for (let i = 0; i < sectionElements.length; i++) {
                        const element = sectionElements.item(i);
                        if (element.id === "section-" + section) {
                            return element;
                        }
                    }
                    return undefined;
                }
                removeTabSection(label, section) {
                    const element = this.findSectionElement(label, section);
                    if (element) {
                        element.remove();
                        this.eventTabSectionSelected.fire(undefined);
                    }
                }
                removeAllSections(label, notify = true) {
                    const sectionsElement = label.querySelectorAll(".TabPaneLabelSections")[0];
                    sectionsElement.innerHTML = "";
                    if (notify) {
                        this.eventTabSectionSelected.fire(undefined);
                    }
                }
                addTabSection(label, section, tabId) {
                    const sectionsElement = label.querySelectorAll(".TabPaneLabelSections")[0];
                    let visible = true;
                    if (sectionsElement.children.length === 0) {
                        const expandIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_SECTION_EXPAND);
                        const collapseIcon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_SECTION_COLLAPSE_LEFT);
                        const storageKey = `TabPane[${tabId}].expanded`;
                        let icon = expandIcon;
                        if (tabId) {
                            visible = (localStorage.getItem(storageKey) || "expanded") === "expanded";
                            icon = visible ? expandIcon : collapseIcon;
                        }
                        const iconControl = new controls.IconControl(icon);
                        iconControl.getCanvas().classList.add("CollapseIcon");
                        iconControl["__expanded"] = visible;
                        sectionsElement.appendChild(iconControl.getCanvas());
                        iconControl.getCanvas().addEventListener("click", e => {
                            if (iconControl.getIcon() === expandIcon) {
                                iconControl.setIcon(collapseIcon);
                            }
                            else {
                                iconControl.setIcon(expandIcon);
                            }
                            visible = iconControl.getIcon() === expandIcon;
                            iconControl["__expanded"] = visible;
                            const sections = sectionsElement.querySelectorAll(".TabPaneLabelSection");
                            for (let i = 0; i < sections.length; i++) {
                                const elem = sections.item(i);
                                elem.style.display = visible ? "block" : "none";
                            }
                            if (tabId) {
                                localStorage.setItem(storageKey, visible ? "expanded" : "collapsed");
                            }
                        });
                    }
                    else {
                        const iconControl = controls.IconControl.getIconControlOf(sectionsElement.firstChild);
                        visible = iconControl["__expanded"];
                    }
                    const sectionElement = document.createElement("div");
                    sectionElement.classList.add("TabPaneLabelSection");
                    sectionElement.id = "section-" + section;
                    sectionElement.style.display = visible ? "block" : "none";
                    sectionElement.innerHTML = section;
                    sectionsElement.appendChild(sectionElement);
                    sectionElement.addEventListener("click", e => {
                        if (sectionElement.classList.contains("selected")) {
                            sectionElement.classList.remove("selected");
                            this.eventTabSectionSelected.fire(undefined);
                        }
                        else {
                            for (let i = 0; i < sectionsElement.children.length; i++) {
                                const elem = sectionsElement.children.item(i);
                                elem.classList.remove("selected");
                            }
                            sectionElement.classList.add("selected");
                            this.eventTabSectionSelected.fire(section);
                        }
                    });
                }
                selectTabSection(label, section) {
                    const sectionElements = label.querySelectorAll(".TabPaneLabelSection");
                    let found = false;
                    for (let i = 0; i < sectionElements.length; i++) {
                        const element = sectionElements.item(i);
                        element.classList.remove("selected");
                        if (section && element.id === "section-" + section) {
                            element.classList.add("selected");
                            found = true;
                        }
                    }
                    this.eventTabSectionSelected.fire(found ? section : undefined);
                }
                addTab(label, icon, content, closeable = false, selectIt = true) {
                    const labelElement = this.makeLabel(label, icon, closeable);
                    this._titleBarElement.appendChild(labelElement);
                    labelElement.addEventListener("mousedown", e => {
                        if (e.button !== 0) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            return;
                        }
                        if (TabPane.isTabCloseIcon(e.target)) {
                            return;
                        }
                        this.selectTab(labelElement);
                    });
                    if (closeable) {
                        labelElement.addEventListener("mouseup", e => {
                            if (e.button === 1) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                this.closeTabLabel(labelElement);
                                return;
                            }
                        });
                    }
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
                    this._iconSize = Math.max(controls.RENDER_ICON_SIZE, size);
                    for (let i = 0; i < this._titleBarElement.children.length; i++) {
                        const label = this._titleBarElement.children.item(i);
                        const iconCanvas = label.firstChild;
                        TabIconManager.getManager(iconCanvas).resize(this._iconSize);
                        this.layout();
                    }
                    this.eventTabLabelResized.fire();
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
                    const sectionsElement = document.createElement("div");
                    sectionsElement.classList.add("TabPaneLabelSections");
                    labelElement.appendChild(sectionsElement);
                    if (closeable) {
                        const manager = new CloseIconManager();
                        manager.setDefaultIcon(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE));
                        manager.repaint();
                        manager.getElement().addEventListener("click", e => {
                            e.stopImmediatePropagation();
                            this.closeTabLabel(labelElement);
                        });
                        labelElement.appendChild(manager.getElement());
                        labelElement.classList.add("closeable");
                        CloseIconManager.setManager(labelElement, manager);
                    }
                    labelElement.addEventListener("contextmenu", e => this.showTabLabelMenu(e, labelElement));
                    return labelElement;
                }
                showTabLabelMenu(e, labelElement) {
                    e.preventDefault();
                    const menu = new controls.Menu();
                    this.fillTabMenu(menu, labelElement);
                    menu.createWithEvent(e);
                }
                fillTabMenu(menu, labelElement) {
                    // nothing
                }
                setTabCloseIcons(labelElement, icon, overIcon) {
                    const manager = CloseIconManager.getManager(labelElement);
                    if (manager) {
                        manager.setDefaultIcon(icon);
                        manager.setOverIcon(overIcon);
                        manager.repaint();
                    }
                }
                setTabReadOnly(labelElement, readOnly) {
                    if (readOnly) {
                        labelElement.classList.add("ReadOnly");
                    }
                    else {
                        labelElement.classList.remove("ReadOnly");
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
                }
                closeTabLabel(labelElement) {
                    {
                        const content = TabPane.getContentFromLabel(labelElement);
                        if (!this.eventTabClosed.fire(content)) {
                            return;
                        }
                    }
                    const selectedLabel = this.getSelectedLabelElement();
                    this._titleBarElement.removeChild(labelElement);
                    const contentArea = labelElement["__contentArea"];
                    this._contentAreaElement.removeChild(contentArea);
                    if (selectedLabel === labelElement) {
                        let toSelectLabel = null;
                        let maxTime = -1;
                        for (let j = 0; j < this._titleBarElement.children.length; j++) {
                            const label = this._titleBarElement.children.item(j);
                            const time = label["__selected_time"] || 0;
                            if (time > maxTime) {
                                toSelectLabel = label;
                                maxTime = time;
                            }
                        }
                        if (toSelectLabel) {
                            this.selectTab(toSelectLabel);
                        }
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
                    if (toSelectLabel) {
                        toSelectLabel["__selected_time"] = TabPane._selectedTimeCounter++;
                    }
                    const selectedLabelElement = this.getSelectedLabelElement();
                    if (selectedLabelElement) {
                        if (selectedLabelElement === toSelectLabel) {
                            return;
                        }
                        selectedLabelElement.classList.remove("selected");
                        const selectedContentArea = TabPane.getContentAreaFromLabel(selectedLabelElement);
                        selectedContentArea.classList.remove("selected");
                    }
                    toSelectLabel.classList.add("selected");
                    const toSelectContentArea = TabPane.getContentAreaFromLabel(toSelectLabel);
                    toSelectContentArea.classList.add("selected");
                    toSelectLabel.scrollIntoView();
                    this.eventTabSelected.fire(TabPane.getContentFromLabel(toSelectLabel));
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
                isSelectedLabel(labelElement) {
                    return labelElement === this.getSelectedLabelElement();
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
                    for (let i = 0; i < this._titleBarElement.childElementCount; i++) {
                        const label = this._titleBarElement.children.item(i);
                        if (label.classList.contains("selected")) {
                            return label;
                        }
                    }
                    return undefined;
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
                _toolbarElement;
                _actionDataMap;
                constructor(toolbarElement) {
                    this._toolbarElement = toolbarElement;
                    this._actionDataMap = new Map();
                }
                static isToolbarItem(element) {
                    return this.findToolbarItem(element) !== undefined;
                }
                static findToolbarItem(element) {
                    if (!element) {
                        return undefined;
                    }
                    if (element.classList.contains("ToolbarItem")) {
                        return element;
                    }
                    return this.findToolbarItem(element.parentElement);
                }
                addCommand(commandId, config = {}) {
                    config.commandId = commandId;
                    this.add(new controls.Action(config));
                }
                addAction(config) {
                    const action = new controls.Action(config);
                    this.add(action);
                    return action;
                }
                add(action) {
                    const btnElement = document.createElement("div");
                    btnElement.classList.add("ToolbarItem");
                    btnElement.addEventListener("click", e => {
                        action.run(e);
                    });
                    if (action.getIcon()) {
                        const iconControl = new controls.IconControl(action.getIcon());
                        btnElement.appendChild(iconControl.getCanvas());
                    }
                    const textElement = document.createElement("div");
                    textElement.classList.add("ToolbarItemText");
                    btnElement.appendChild(textElement);
                    btnElement["__text"] = textElement;
                    if (action.isShowText()) {
                        if (action.getIcon()) {
                            btnElement.classList.add("ToolbarItemHasTextAndIcon");
                        }
                    }
                    else {
                        btnElement.classList.add("ToolbarItemHideText");
                    }
                    const tooltip = action.getTooltip() || action.getText() || "";
                    const keyString = action.getCommandKeyString();
                    if (tooltip) {
                        controls.Tooltip.tooltipWithKey(btnElement, keyString, tooltip);
                    }
                    this._toolbarElement.appendChild(btnElement);
                    const listener = () => this.updateButtonWithAction(btnElement, action);
                    action.eventActionChanged.addListener(listener);
                    this.updateButtonWithAction(btnElement, action);
                    this._actionDataMap.set(action, {
                        btnElement: btnElement,
                        listener: listener
                    });
                }
                dispose() {
                    for (const [action, data] of this._actionDataMap.entries()) {
                        action.eventActionChanged.removeListener(data.listener);
                        data.btnElement.remove();
                    }
                }
                updateButtonWithAction(btn, action) {
                    const textElement = btn["__text"];
                    textElement.innerText = action.getText();
                    if (action.isSelected()) {
                        btn.classList.add("ActionSelected");
                    }
                    else {
                        btn.classList.remove("ActionSelected");
                    }
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
            class TooltipManager {
                _element;
                _enterTime;
                _token;
                _tooltip;
                _mousePosition;
                constructor(element, tooltip) {
                    this._element = element;
                    this._tooltip = tooltip;
                    this._element["__TooltipManager"] = this;
                    this._token = 0;
                    this._element.addEventListener("mouseenter", e => {
                        this.start();
                    });
                    const listenToClose = (e) => {
                        this._enterTime = 0;
                        this._token++;
                        TooltipManager.closeTooltip();
                    };
                    this._element.addEventListener("mouseleave", listenToClose);
                    this._element.addEventListener("mousedown", listenToClose);
                    this._element.addEventListener("mousemove", (e) => {
                        this._mousePosition = { x: e.clientX, y: e.clientY };
                        if (Date.now() - this._enterTime > 500) {
                            this._token++;
                            this.start();
                        }
                    });
                }
                getTooltipMessage() {
                    return this._tooltip;
                }
                setTooltipMessage(tooltip) {
                    this._tooltip = tooltip;
                }
                static getTooltipManager(element) {
                    return element["__TooltipManager"];
                }
                start() {
                    this._enterTime = Date.now();
                    const token = this._token;
                    setTimeout(() => {
                        if (token !== this._token) {
                            return;
                        }
                        if (this._mousePosition) {
                            TooltipManager.showTooltip(this._mousePosition.x, this._mousePosition.y, this._tooltip);
                        }
                    }, 1000);
                }
                static _tooltipElement;
                static showTooltip(mouseX, mouseY, html) {
                    this.closeTooltip();
                    this._tooltipElement = document.createElement("div");
                    this._tooltipElement.classList.add("Tooltip");
                    this._tooltipElement.innerHTML = html;
                    document.body.append(this._tooltipElement);
                    const bounds = this._tooltipElement.getBoundingClientRect();
                    let left = mouseX - bounds.width / 2;
                    let top = mouseY - bounds.height - 10;
                    if (left < 0) {
                        left = 5;
                    }
                    if (left + bounds.width > window.innerWidth) {
                        left = window.innerWidth - bounds.width - 5;
                    }
                    if (top < 0) {
                        top = mouseY + 20;
                    }
                    this._tooltipElement.style.left = left + "px";
                    this._tooltipElement.style.top = top + "px";
                }
                static closeTooltip() {
                    if (this._tooltipElement) {
                        this._tooltipElement.remove();
                        this._tooltipElement = null;
                    }
                }
            }
            class Tooltip {
                static tooltip(element, tooltip) {
                    const manager = TooltipManager.getTooltipManager(element);
                    if (manager) {
                        manager.setTooltipMessage(tooltip);
                        return;
                    }
                    // tslint:disable-next-line:no-unused-expression
                    new TooltipManager(element, tooltip);
                }
                static tooltipWithKey(element, keyString, tooltip) {
                    if (keyString) {
                        return this.tooltip(element, this.renderTooltip(keyString, tooltip));
                    }
                    return this.tooltip(element, tooltip);
                }
                static renderTooltip(keyString, tooltip) {
                    return "<span class='TooltipKeyString'>(" + keyString + ")</span> " + tooltip;
                }
            }
            controls.Tooltip = Tooltip;
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            class ZoomControl {
                _element;
                _callback;
                constructor(args) {
                    this._element = document.createElement("div");
                    this._element.classList.add("ZoomControl");
                    // zoom in
                    const zoomIn = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_ZOOM_IN), true);
                    this._element.appendChild(zoomIn.getCanvas());
                    zoomIn.getCanvas().addEventListener("click", e => {
                        if (this._callback) {
                            this._callback(1);
                        }
                    });
                    // zoom out
                    const zoomOut = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_ZOOM_OUT), true);
                    this._element.appendChild(zoomOut.getCanvas());
                    zoomOut.getCanvas().addEventListener("click", e => {
                        if (this._callback) {
                            this._callback(-1);
                        }
                    });
                    // reset
                    if (args.showReset) {
                        const zoomReset = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_ZOOM_RESET), true);
                        this._element.appendChild(zoomReset.getCanvas());
                        zoomReset.getCanvas().addEventListener("click", e => {
                            if (this._callback) {
                                this._callback(0);
                            }
                        });
                    }
                }
                setCallback(callback) {
                    this._callback = callback;
                }
                getElement() {
                    return this._element;
                }
            }
            controls.ZoomControl = ZoomControl;
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
            controls.FONT_OFFSET = 2;
            controls.FONT_FAMILY = "Arial, Helvetica, sans-serif";
            controls.ACTION_WIDTH = 20;
            controls.PANEL_BORDER_SIZE = 5;
            controls.PANEL_TITLE_HEIGHT = 22;
            controls.FILTERED_VIEWER_FILTER_HEIGHT = 30;
            controls.SPLIT_OVER_ZONE_WIDTH = 6;
            const DEFAULT_FONT_HEIGHT = 14;
            let fontHeight = (() => {
                const size = Number.parseInt(window.localStorage.getItem("canvasFontSize"), 10);
                if (isNaN(size)) {
                    return DEFAULT_FONT_HEIGHT;
                }
                return size;
            })();
            function getCanvasFontHeight() {
                return fontHeight;
            }
            controls.getCanvasFontHeight = getCanvasFontHeight;
            function incrementFontHeight(delta) {
                fontHeight = Math.max(DEFAULT_FONT_HEIGHT, fontHeight + delta);
                localStorage.setItem("canvasFontSize", fontHeight.toString());
                colibri.Platform.getWorkbench().eventThemeChanged.fire(controls.Controls.getTheme());
            }
            controls.incrementFontHeight = incrementFontHeight;
            function resetFontHeight() {
                fontHeight = DEFAULT_FONT_HEIGHT;
                localStorage.setItem("canvasFontSize", fontHeight.toString());
                colibri.Platform.getWorkbench().eventThemeChanged.fire(controls.Controls.getTheme());
            }
            controls.resetFontHeight = resetFontHeight;
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
                    eventDialogClose = new controls.ListenerList();
                    _containerElement;
                    _buttonPaneElement;
                    _titlePaneElement;
                    _width;
                    _height;
                    static _dialogs = [];
                    static _firstTime = true;
                    _parentDialog;
                    _closeWithEscapeKey;
                    constructor(...classList) {
                        super("div", "Dialog", ...classList);
                        this._closeWithEscapeKey = true;
                        this.setSize(400, 300, true);
                        this._parentDialog = Dialog._dialogs.length === 0 ?
                            null : Dialog._dialogs[Dialog._dialogs.length - 1];
                        if (Dialog._firstTime) {
                            Dialog._firstTime = false;
                            window.addEventListener("keydown", e => {
                                if (e.code === "Escape") {
                                    if (Dialog._dialogs.length > 0) {
                                        const dlg = Dialog._dialogs[Dialog._dialogs.length - 1];
                                        if (dlg.isCloseWithEscapeKey()) {
                                            if (controls.Menu.getActiveMenu() || controls.ColorPickerManager.isActivePicker()) {
                                                controls.Menu.closeAll();
                                                controls.ColorPickerManager.closeActive();
                                            }
                                            else {
                                                e.preventDefault();
                                                e.stopImmediatePropagation();
                                                dlg.close();
                                            }
                                        }
                                    }
                                }
                            });
                            colibri.Platform.getWorkbench().eventThemeChanged.addListener(() => {
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
                    processKeyCommands() {
                        return false;
                    }
                    static closeAllDialogs() {
                        for (const dlg of this._dialogs) {
                            dlg.close();
                        }
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
                    create(hideParentDialog = true) {
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
                        if (this._parentDialog && hideParentDialog) {
                            this._parentDialog._containerElement.style.display = "none";
                            this._parentDialog.style.display = "none";
                        }
                    }
                    setTitle(title) {
                        this._titlePaneElement.innerText = title;
                    }
                    addCancelButton(callback) {
                        return this.addButton("Cancel", () => {
                            this.close();
                            if (callback) {
                                callback();
                            }
                        });
                    }
                    addButton(text, callback) {
                        const btn = document.createElement("button");
                        btn.innerText = text;
                        btn.addEventListener("click", e => callback(e));
                        this._buttonPaneElement.appendChild(btn);
                        return btn;
                    }
                    addElementToButtonPanel(element) {
                        this._buttonPaneElement.appendChild(element);
                    }
                    connectInputWithButton(inputElement, btnElement) {
                        inputElement.addEventListener("keyup", e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                btnElement.click();
                            }
                        });
                    }
                    createDialogArea() {
                        // nothing
                    }
                    resize() {
                        this.setBounds({
                            x: window.innerWidth / 2 - this._width / 2,
                            y: Math.min(window.innerHeight / 2 - this._height / 2, window.innerHeight * 0.2),
                            width: this._width,
                            height: this._height
                        });
                    }
                    setSize(width, height, keep1080pRatio = false) {
                        if (width !== undefined) {
                            if (keep1080pRatio) {
                                this._width = Math.max(width, Math.floor(width / 1920 * window.innerWidth));
                            }
                            else {
                                this._width = width;
                            }
                        }
                        if (height !== undefined) {
                            if (keep1080pRatio) {
                                this._height = Math.max(height, Math.floor(height / 1080 * window.innerHeight));
                            }
                            else {
                                this._height = height;
                            }
                        }
                        const margin = window.innerHeight * 0.2;
                        if (this._width > window.innerWidth) {
                            this._width = window.innerWidth - 10;
                        }
                        if (this._height > window.innerHeight - margin) {
                            this._height = window.innerHeight - margin - 10;
                        }
                    }
                    getSize() {
                        return { width: this._width, height: this._height };
                    }
                    close() {
                        Dialog._dialogs = Dialog._dialogs.filter(d => d !== this);
                        this._containerElement.remove();
                        this.getElement().remove();
                        this.eventDialogClose.fire();
                        if (this._parentDialog) {
                            this._parentDialog._containerElement.style.display = "block";
                            this._parentDialog.style.display = "grid";
                            this._parentDialog.goFront();
                        }
                    }
                    isClosed() {
                        return !this.getElement().isConnected;
                    }
                    goFront() {
                        // nothing
                    }
                    closeAll() {
                        this.close();
                        if (this._parentDialog) {
                            this._parentDialog.closeAll();
                        }
                    }
                }
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
                class AbstractViewerDialog extends dialogs.Dialog {
                    _viewer;
                    _filteredViewer;
                    _showZoomControls;
                    constructor(viewer, showZoomControls) {
                        super("AbstractViewerDialog");
                        this._viewer = viewer;
                        this._showZoomControls = showZoomControls;
                    }
                    createFilteredViewer() {
                        this._filteredViewer = this.newFilteredViewer();
                    }
                    newFilteredViewer() {
                        return new controls.viewers.FilteredViewer(this._viewer, this._showZoomControls);
                    }
                    getViewer() {
                        return this._viewer;
                    }
                    getFilteredViewer() {
                        return this._filteredViewer;
                    }
                    goFront() {
                        this.resize();
                        if (this._viewer) {
                            this._viewer.repaint();
                        }
                    }
                    enableButtonOnlyWhenOneElementIsSelected(btn, filter) {
                        this.getViewer().eventSelectionChanged.addListener(() => {
                            btn.disabled = this.getViewer().getSelection().length !== 1;
                            if (!btn.disabled && filter) {
                                btn.disabled = !filter(this.getViewer().getSelectionFirstElement());
                            }
                        });
                        btn.disabled = this.getViewer().getSelection().length !== 1;
                        return btn;
                    }
                    addOpenButton(text, callback, allowSelectEmpty = false) {
                        const callback2 = () => {
                            callback(this.getViewer().getSelection());
                            this.close();
                        };
                        this.getViewer().eventOpenItem.addListener(callback2);
                        const btn = this.addButton(text, callback2);
                        if (!allowSelectEmpty) {
                            this.getViewer().eventSelectionChanged.addListener(() => {
                                btn.disabled = this.getViewer().getSelection().length === 0;
                            });
                            btn.disabled = true;
                        }
                        const inputElement = this.getFilteredViewer().getFilterControl().getElement();
                        const listener = e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                const sel = this.getViewer().getSelection();
                                if (sel.length === 0) {
                                    if (!allowSelectEmpty) {
                                        const elements = this.getViewer().getVisibleElements();
                                        if (elements.length === 1) {
                                            this.getViewer().setSelection(elements);
                                            btn.click();
                                        }
                                    }
                                }
                                else {
                                    btn.click();
                                }
                            }
                        };
                        inputElement.addEventListener("keyup", listener);
                        this.getViewer().getElement().addEventListener("keyup", listener);
                        return btn;
                    }
                }
                dialogs.AbstractViewerDialog = AbstractViewerDialog;
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
                    _messageElement;
                    static _currentDialog;
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
                            this.close();
                        });
                    }
                    close() {
                        super.close();
                        AlertDialog._currentDialog = null;
                    }
                    setMessage(text) {
                        this._messageElement.innerHTML = text;
                    }
                    static replaceConsoleAlert() {
                        window["__alert"] = window.alert;
                        window.alert = (msg) => {
                            if (!this._currentDialog) {
                                const dlg = new AlertDialog();
                                dlg.create();
                                this._currentDialog = dlg;
                            }
                            const preElement = document.createElement("div");
                            preElement.style.overflow = "wrap";
                            preElement.innerHTML = msg;
                            preElement.style.userSelect = "all";
                            this._currentDialog._messageElement.innerHTML = "";
                            this._currentDialog._messageElement.appendChild(preElement);
                        };
                    }
                }
                dialogs.AlertDialog = AlertDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./AbstractViewerDialog.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class ViewerDialog extends dialogs.AbstractViewerDialog {
                    constructor(viewer, showZoomControls) {
                        super(viewer, showZoomControls);
                    }
                    createDialogArea() {
                        this.createFilteredViewer();
                        this.getFilteredViewer().addClass("DialogClientArea");
                        this.add(this.getFilteredViewer());
                        this.getFilteredViewer().getFilterControl().getFilterElement().focus();
                        this.getFilteredViewer().setMenuProvider(new controls.viewers.DefaultViewerMenuProvider((viewer, menu) => {
                            this.fillContextMenu(menu);
                        }));
                    }
                    fillContextMenu(menu) {
                        // nothing
                    }
                }
                dialogs.ViewerDialog = ViewerDialog;
            })(dialogs = controls.dialogs || (controls.dialogs = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./ViewerDialog.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var dialogs;
            (function (dialogs) {
                class CommandDialog extends controls.dialogs.ViewerDialog {
                    constructor() {
                        super(new controls.viewers.TreeViewer("colibri.ui.controls.dialogs.CommandDialog"), false);
                        const size = this.getSize();
                        this.setSize(size.width * 1.5, size.height * 1.5);
                    }
                    create() {
                        const manager = colibri.Platform.getWorkbench().getCommandManager();
                        const viewer = this.getViewer();
                        viewer.setStyledLabelProvider(new CommandStyledLabelProvider());
                        viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(args => new controls.viewers.IconImageCellRenderer(colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_KEYMAP))));
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setInput(manager.getActiveCommands());
                        super.create();
                        this.setTitle("Command Palette");
                        this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Execute", sel => {
                            manager.executeCommand(sel[0].getId(), true);
                        }));
                        this.addCancelButton();
                        // this.addButton("Show All", () => {
                        //     viewer.setInput(manager.getCommands());
                        //     viewer.repaint();
                        // });
                    }
                }
                dialogs.CommandDialog = CommandDialog;
                class CommandStyledLabelProvider {
                    getStyledTexts(obj, dark) {
                        const cmd = obj;
                        const manager = colibri.Platform.getWorkbench().getCommandManager();
                        const label = manager.getCategory(cmd.getCategoryId()).name
                            + ": " + cmd.getName();
                        const keys = manager.getCommandKeyString(cmd.getId());
                        const theme = controls.Controls.getTheme();
                        if (keys) {
                            return [
                                {
                                    text: label,
                                    color: theme.viewerForeground
                                },
                                {
                                    text: " (" + keys + ")",
                                    color: theme.viewerForeground + "90"
                                }
                            ];
                        }
                        return [
                            {
                                text: label,
                                color: theme.viewerForeground
                            }
                        ];
                    }
                }
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
                class CommentDialog extends dialogs.Dialog {
                    constructor() {
                        super("CommentDialog");
                    }
                    createDialogArea() {
                        this.getElement().style.width = "auto";
                        this.getElement().style.height = "auto";
                        const clientAreaElement = document.createElement("div");
                        clientAreaElement.classList.add("DialogClientArea");
                        this.getElement().appendChild(clientAreaElement);
                        const inputElement = document.createElement("input");
                        inputElement.style.width = "32px";
                        inputElement.style.background = "transparent";
                        inputElement.style.fontSize = "32px";
                        inputElement.style.fontFamily = "monospace";
                        inputElement.style.border = "none";
                        inputElement.addEventListener("keydown", e => {
                            setTimeout(() => {
                                const size = 20 * inputElement.value.length + 10;
                                inputElement.style.width = Math.max(size, 50) + "px";
                                this.resize();
                            }, 10);
                        });
                        clientAreaElement.appendChild(inputElement);
                        setTimeout(() => inputElement.focus(), 10);
                    }
                    resize() {
                        const w = this.getElement().getBoundingClientRect().width;
                        this.setLocation(window.innerWidth / 2 - w / 2, window.innerHeight * 0.2);
                    }
                }
                dialogs.CommentDialog = CommentDialog;
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
                class ConfirmDialog extends dialogs.Dialog {
                    _messageElement;
                    _confirmBtn;
                    _confirmCallback;
                    constructor() {
                        super("ConfirmDialog");
                    }
                    createDialogArea() {
                        this._messageElement = document.createElement("div");
                        this._messageElement.classList.add("DialogClientArea", "DialogSection");
                        this.getElement().appendChild(this._messageElement);
                    }
                    create() {
                        super.create();
                        this.setTitle("Confirm");
                        this.addButton("Cancel", () => {
                            if (this._confirmCallback) {
                                this._confirmCallback(false);
                            }
                            this.close();
                        });
                        this._confirmBtn = this.addButton("Confirm", () => {
                            if (this._confirmCallback) {
                                this._confirmCallback(true);
                            }
                            this.close();
                        });
                    }
                    getConfirmButton() {
                        return this._confirmBtn;
                    }
                    setConfirmCallback(callback) {
                        this._confirmCallback = callback;
                    }
                    setMessage(text) {
                        this._messageElement.innerHTML = text;
                    }
                    static async show(message, confirmBtnText = "Confirm") {
                        const dlg = new ConfirmDialog();
                        dlg.create();
                        dlg.getConfirmButton().textContent = confirmBtnText;
                        dlg.setMessage(message);
                        return new Promise((resolve, reject) => {
                            dlg.setConfirmCallback(ok => {
                                resolve(ok);
                            });
                        });
                    }
                }
                dialogs.ConfirmDialog = ConfirmDialog;
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
                class FormDialog extends dialogs.Dialog {
                    _formElement;
                    _formBuilder;
                    constructor() {
                        super();
                    }
                    createDialogArea() {
                        const clientArea = document.createElement("div");
                        clientArea.classList.add("DialogClientArea");
                        clientArea.style.display = "grid";
                        clientArea.style.alignItems = "center";
                        clientArea.style.gridTemplateColumns = "auto 1fr";
                        clientArea.style.rowGap = "5px";
                        clientArea.style.columnGap = "5px";
                        clientArea.style.height = "min-content";
                        this.getElement().appendChild(clientArea);
                        this._formElement = clientArea;
                        this._formBuilder = new controls.properties.EasyFormBuilder(this._formElement);
                    }
                    layout() {
                        super.layout();
                        this.getElement().style.height = "auto";
                    }
                    getBuilder() {
                        return this._formBuilder;
                    }
                    getFormElement() {
                        return this._formElement;
                    }
                }
                dialogs.FormDialog = FormDialog;
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
                    _textElement;
                    _messageElement;
                    _acceptButton;
                    _validator;
                    _resultCallback;
                    constructor() {
                        super("InputDialog");
                    }
                    getAcceptButton() {
                        return this._acceptButton;
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
                        this.connectInputWithButton(this._textElement, this._acceptButton);
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
                    _progressElement;
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
                    _dialog;
                    _total;
                    _step;
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
            var viewers;
            (function (viewers) {
                class LabelCellRenderer {
                    renderCell(args) {
                        const img = this.getImage(args.obj);
                        const x = args.x;
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
                    _singleImage;
                    constructor(singleImage) {
                        this._singleImage = singleImage;
                    }
                    getImage(obj) {
                        if (this._singleImage) {
                            return this._singleImage;
                        }
                        return obj;
                    }
                    renderCell(args) {
                        const img = this.getImage(args.obj);
                        if (img) {
                            img.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
                        }
                        else {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
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
                class Viewer extends controls.Control {
                    eventOpenItem = new controls.ListenerList();
                    eventDeletePressed = new controls.ListenerList();
                    _contentProvider;
                    _cellRendererProvider;
                    _labelProvider = null;
                    _styledLabelProvider;
                    _input;
                    _cellSize;
                    _expandedObjects;
                    _selectedObjects;
                    _context;
                    _paintItems;
                    _lastSelectedItemIndex = -1;
                    _contentHeight = 0;
                    _filterText;
                    _filterIncludeSet;
                    _filterMatches;
                    _highlightMatches;
                    _viewerId;
                    _preloadEnabled = true;
                    _filterOnRepaintEnabled = true;
                    _searchEngine;
                    constructor(id, ...classList) {
                        super("canvas", "Viewer");
                        this._viewerId = id;
                        this._filterText = "";
                        this._cellSize = 48;
                        this.getElement().tabIndex = 1;
                        this.getElement().draggable = true;
                        this.initContext();
                        this._input = null;
                        this._expandedObjects = new Set();
                        this._selectedObjects = new Set();
                        this._filterIncludeSet = new Set();
                        this._filterMatches = new Map();
                        this._highlightMatches = true;
                        this._searchEngine = new viewers.MultiWordSearchEngine();
                        this.initListeners();
                        this.restoreCellSize();
                    }
                    isHighlightMatches() {
                        return this._highlightMatches;
                    }
                    setHighlightMatches(highlightMatches) {
                        this._highlightMatches = highlightMatches;
                    }
                    getSearchEngine() {
                        return this._searchEngine;
                    }
                    setSearchEngine(engine) {
                        this._searchEngine = engine;
                    }
                    getViewerId() {
                        return this._viewerId;
                    }
                    restoreCellSize() {
                        const key = "Viewer.cellSize." + this._viewerId;
                        const value = localStorage.getItem(key);
                        if (value) {
                            const size = Number.parseInt(value, 10);
                            if (!isNaN(size)) {
                                this._cellSize = size;
                            }
                        }
                    }
                    saveCellSize() {
                        const key = "Viewer.cellSize." + this._viewerId;
                        localStorage.setItem(key, this._cellSize.toString());
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
                        switch (e.key) {
                            case "ArrowUp":
                            case "ArrowLeft":
                                this.moveCursor(-1);
                                break;
                            case "ArrowDown":
                            case "ArrowRight":
                                this.moveCursor(1);
                                break;
                            case "Delete":
                            case "Backspace":
                                this.eventDeletePressed.fire(this.getSelection());
                                break;
                        }
                    }
                    moveCursor(dir) {
                        const elem = this.getSelectionFirstElement();
                        if (!elem) {
                            return;
                        }
                        let i = this._paintItems.findIndex(item => item.data === elem);
                        if (i >= 0) {
                            i += dir;
                            if (i >= 0 && i < this._paintItems.length) {
                                const data = this._paintItems[i].data;
                                const newSel = [data];
                                this.setSelection(newSel);
                                this.reveal(data);
                            }
                        }
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
                    getLabelProvider() {
                        return this._labelProvider;
                    }
                    setLabelProvider(labelProvider) {
                        this._labelProvider = labelProvider;
                    }
                    getStyledLabelProvider() {
                        return this._styledLabelProvider;
                    }
                    setStyledLabelProvider(styledLabelProvider) {
                        this._styledLabelProvider = styledLabelProvider;
                        if (!this._labelProvider && styledLabelProvider) {
                            this._labelProvider = new viewers.LabelProviderFromStyledLabelProvider(styledLabelProvider);
                        }
                    }
                    setFilterText(filterText) {
                        this._filterText = filterText.toLowerCase();
                    }
                    getFilterText() {
                        return this._filterText;
                    }
                    prepareFiltering(updateScroll) {
                        if (updateScroll) {
                            this.setScrollY(0);
                        }
                        this._filterIncludeSet.clear();
                        this._filterMatches.clear();
                        this._searchEngine.prepare(this.getFilterText());
                        this.buildFilterIncludeMap();
                    }
                    isFilterIncluded(obj) {
                        return this._filterIncludeSet.has(obj) || this._filterText.length === 0;
                    }
                    matches(obj) {
                        const labelProvider = this.getLabelProvider();
                        if (labelProvider === null) {
                            return true;
                        }
                        const label = labelProvider.getLabel(obj);
                        const result = this._searchEngine.matches(label);
                        if (this._highlightMatches) {
                            if (result.matches) {
                                this._filterMatches.set(label, result);
                            }
                            else {
                                this._filterMatches.delete(label);
                            }
                        }
                        return result.matches;
                    }
                    getMatchesResult(label) {
                        return this._filterMatches.get(label);
                    }
                    getPaintItemAt(e) {
                        for (const item of this._paintItems) {
                            if (item.contains(e.offsetX, e.offsetY)) {
                                return item;
                            }
                        }
                        return null;
                    }
                    getSelection() {
                        const sel = [...this._selectedObjects];
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
                        this.eventSelectionChanged.fire(this.getSelection());
                    }
                    escape() {
                        if (this._selectedObjects.size > 0) {
                            this._selectedObjects.clear();
                            this.repaint();
                            this.fireSelectionChanged();
                        }
                    }
                    onWheel(e) {
                        e.preventDefault();
                        if (!e.shiftKey) {
                            return;
                        }
                        this.setCellSize(this.getCellSize() - e.deltaY / 2);
                        // if (e.deltaY < 0) {
                        //    this.setCellSize(this.getCellSize() + ROW_HEIGHT);
                        // } else if (this._cellSize > ICON_SIZE) {
                        //     this.setCellSize(this.getCellSize() - ROW_HEIGHT);
                        // }
                        this.saveCellSize();
                        this.repaint();
                    }
                    onDoubleClick(e) {
                        const item = this.getPaintItemAt(e);
                        if (item) {
                            this.eventOpenItem.fire(item.data);
                        }
                    }
                    onMouseUp(e) {
                        if (controls.Controls.getMouseDownElement() !== e.target) {
                            return;
                        }
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
                            if (e.button === 2 && this._selectedObjects.size === 1) {
                                this._selectedObjects = new Set([data]);
                                selChanged = true;
                            }
                            else {
                                if (e.button === 2) {
                                    this._selectedObjects.add(data);
                                    selChanged = true;
                                }
                                else if (e.ctrlKey || e.metaKey) {
                                    if (this._selectedObjects.has(data)) {
                                        this._selectedObjects.delete(data);
                                    }
                                    else {
                                        this._selectedObjects.add(data);
                                    }
                                    selChanged = true;
                                }
                                else if (e.shiftKey) {
                                    if (this._lastSelectedItemIndex >= 0 && this._lastSelectedItemIndex !== item.index) {
                                        const start = Math.min(this._lastSelectedItemIndex, item.index);
                                        const end = Math.max(this._lastSelectedItemIndex, item.index);
                                        this.repaintNow(true);
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
                        this._context.font = `${controls.getCanvasFontHeight()}px sans-serif`;
                        controls.Controls.adjustCanvasDPI(this.getCanvas());
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
                        this.setScrollY(0);
                    }
                    isSelected(obj) {
                        return this._selectedObjects.has(obj);
                    }
                    setFilterOnRepaintDisabled() {
                        this._filterOnRepaintEnabled = false;
                    }
                    setPreloadDisabled() {
                        this._preloadEnabled = false;
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
                    async repaint(fullRepaint = false) {
                        if (this._filterOnRepaintEnabled) {
                            this.prepareFiltering(fullRepaint);
                        }
                        this.repaintNow(fullRepaint);
                        if (this._preloadEnabled) {
                            this.preload(this._paintItems).then(result => {
                                if (result === controls.PreloadResult.RESOURCES_LOADED) {
                                    this.repaintNow(fullRepaint);
                                }
                            });
                        }
                        this.updateScrollPane();
                    }
                    updateScrollPane() {
                        const pane = this.getContainer()?.getContainer();
                        if (pane instanceof controls.ScrollPane) {
                            pane.updateScroll(this._contentHeight);
                        }
                    }
                    repaintNow(fullRepaint) {
                        this._paintItems = [];
                        const canvas = this.getCanvas();
                        this._context.clearRect(0, 0, canvas.width, canvas.height);
                        if (this._cellRendererProvider && this._contentProvider && this._input !== null) {
                            this.paint(fullRepaint);
                        }
                        else {
                            this._contentHeight = 0;
                        }
                    }
                    async preload(paintItems) {
                        const viewer = this;
                        const rendererProvider = this.getCellRendererProvider();
                        let result = controls.PreloadResult.NOTHING_LOADED;
                        for (const paintItem of paintItems) {
                            const obj = paintItem.data;
                            const renderer = rendererProvider.getCellRenderer(obj);
                            const itemResult = await renderer.preload(new viewers.PreloadCellArgs(obj, viewer));
                            result = Math.max(itemResult, result);
                        }
                        return result;
                    }
                    paintItemBackground(obj, x, y, w, h, radius = 0) {
                        let fillStyle = null;
                        if (this.isSelected(obj)) {
                            fillStyle = controls.Controls.getTheme().viewerSelectionBackground;
                        }
                        if (fillStyle != null) {
                            this._context.save();
                            this._context.strokeStyle = fillStyle;
                            this._context.fillStyle = fillStyle;
                            if (radius > 0) {
                                this._context.lineJoin = "round";
                                this._context.lineWidth = radius;
                                this._context.fillRect(Math.floor(x + (radius / 2)), Math.floor(y + (radius / 2)), Math.ceil(w - radius), Math.ceil(h - radius));
                                this._context.strokeRect(Math.floor(x + (radius / 2)), Math.floor(y + (radius / 2)), Math.ceil(w - radius), Math.ceil(h - radius));
                            }
                            else {
                                this._context.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
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
                                width: Math.floor(b.width),
                                height: Math.floor(b.height)
                            });
                        }
                        else {
                            ui.controls.setElementBounds(this.getElement(), {
                                width: Math.floor(b.width),
                                height: Math.floor(b.height)
                            });
                        }
                        const canvas = this.getCanvas();
                        canvas.width = Math.floor(b.width);
                        canvas.height = Math.floor(b.height);
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
                    setCellSize(cellSize, restoreSavedSize = false) {
                        this._cellSize = Math.max(controls.ROW_HEIGHT, cellSize);
                        if (restoreSavedSize) {
                            this.restoreCellSize();
                        }
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
                    selectFirst() {
                        const input = this.getInput();
                        if (Array.isArray(input) && input.length > 0) {
                            this.setSelection([input[0]]);
                        }
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
                        if (state.filterText !== this.getFilterText()) {
                            this.setFilterText(state.filterText);
                        }
                        if (state.cellSize !== this.getCellSize()) {
                            this.setCellSize(state.cellSize);
                        }
                    }
                    selectAll() {
                        // first, compute all paintItems
                        this.repaintNow(true);
                        this.setSelection(this._paintItems.map(item => item.data));
                    }
                }
                viewers.Viewer = Viewer;
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
                viewers.TREE_ICON_SIZE = controls.RENDER_ICON_SIZE;
                viewers.LABEL_MARGIN = viewers.TREE_ICON_SIZE + 0;
                class TreeViewer extends viewers.Viewer {
                    _treeRenderer;
                    _treeIconList;
                    constructor(id, ...classList) {
                        super(id, "TreeViewer", ...classList);
                        this.getCanvas().addEventListener("click", e => this.onClick(e));
                        this._treeRenderer = new viewers.TreeViewerRenderer(this);
                        this._treeIconList = [];
                        this.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
                    }
                    expandRoots(repaint = true) {
                        const roots = this.getContentProvider().getRoots(this.getInput());
                        for (const root of roots) {
                            this.setExpanded(root, true);
                        }
                        if (repaint) {
                            this.repaint();
                        }
                    }
                    setExpandWhenOpenParentItem() {
                        this.eventOpenItem.addListener(obj => {
                            if (this.getContentProvider().getChildren(obj).length > 0) {
                                this.setExpanded(obj, !this.isExpanded(obj));
                                this.repaint();
                            }
                        });
                    }
                    async expandCollapseBranch() {
                        const obj = this.getSelectionFirstElement();
                        if (obj) {
                            const children = this.getContentProvider().getChildren(obj);
                            if (children.length > 0) {
                                this.setExpanded(obj, !this.isExpanded(obj));
                                this.repaint();
                            }
                            else {
                                const path = this.getObjectPath(obj);
                                // pop obj
                                path.pop();
                                // pop parent
                                const parent = path.pop();
                                if (parent) {
                                    await this.reveal(parent);
                                    this.setExpanded(parent, false);
                                    this.setSelection([parent]);
                                }
                            }
                        }
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
                    async revealAndSelect(...objects) {
                        await this.reveal(...objects);
                        this.setSelection(objects);
                    }
                    async reveal(...objects) {
                        if (objects.length === 0) {
                            return;
                        }
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
                        const paintResult = this.getTreeRenderer().paint(true);
                        const objSet = new Set(objects);
                        let found = false;
                        let y = -this._contentHeight;
                        const b = this.getBounds();
                        const items = paintResult.paintItems;
                        items.sort((i1, i2) => i1.y - i2.y);
                        for (const item of items) {
                            if (objSet.has(item.data)) {
                                y = (item.y - b.height / 2 + item.h / 2) - this.getScrollY();
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            this.setScrollY(-y);
                            this.repaint();
                            scrollPane.layout();
                        }
                    }
                    revealPath(path) {
                        for (let i = 0; i < path.length - 1; i++) {
                            this.setExpanded(path[i], true);
                        }
                    }
                    findElementByLabel(label) {
                        const list = this.getContentProvider().getRoots(this.getInput());
                        return this.findElementByLabel_inList(list, label);
                    }
                    findElementByLabel_inList(list, label) {
                        if (list) {
                            for (const child of list) {
                                const found = this.findElementByLabel_inElement(child, label);
                                if (found) {
                                    return found;
                                }
                            }
                        }
                        return undefined;
                    }
                    findElementByLabel_inElement(elem, label) {
                        const elemLabel = this.getLabelProvider().getLabel(elem);
                        if (label === elemLabel) {
                            return elem;
                        }
                        const list = this.getContentProvider().getChildren(elem);
                        return this.findElementByLabel_inList(list, label);
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
                            const newChildren = contentProvider.getChildren(child);
                            const found = this.getObjectPath2(obj, path, newChildren);
                            if (found) {
                                return true;
                            }
                            path.pop();
                        }
                        return false;
                    }
                    getTreeIconAtPoint(e) {
                        for (const icon of this._treeIconList) {
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
                        for (const obj of objects) {
                            visitor(obj);
                            if (this.isExpanded(obj) || this.getFilterText() !== "") {
                                const list = this.getContentProvider().getChildren(obj);
                                this.visitObjects2(list, visitor);
                            }
                        }
                    }
                    paint(fullPaint) {
                        const result = this._treeRenderer.paint(fullPaint);
                        this._contentHeight = result.contentHeight;
                        this._paintItems = result.paintItems;
                        this._treeIconList = result.treeIconList;
                    }
                    getFirstVisibleElement() {
                        if (this._paintItems && this._paintItems.length > 0) {
                            return this._paintItems[0].data;
                        }
                    }
                    getVisibleElements() {
                        if (this._paintItems) {
                            return this._paintItems.map(item => item.data);
                        }
                        return [];
                    }
                    setFilterText(filter) {
                        super.setFilterText(filter);
                        this.maybeFilter();
                    }
                    _filterTime = 0;
                    _token = 0;
                    _delayOnManyChars = 100;
                    _delayOnFewChars = 200;
                    _howMuchIsFewChars = 3;
                    setFilterDelay(delayOnManyChars, delayOnFewChars, howMuchIsFewChars) {
                        this._delayOnManyChars = delayOnManyChars;
                        this._delayOnFewChars = delayOnFewChars;
                        this._howMuchIsFewChars = howMuchIsFewChars;
                    }
                    maybeFilter() {
                        const now = Date.now();
                        const count = this.getFilterText().length;
                        const delay = count <= this._howMuchIsFewChars ? this._delayOnFewChars : this._delayOnManyChars;
                        if (now - this._filterTime > delay) {
                            this._filterTime = now;
                            this._token++;
                            this.filterNow();
                        }
                        else {
                            const token = this._token;
                            requestAnimationFrame(() => {
                                if (token === this._token) {
                                    this.maybeFilter();
                                }
                            });
                        }
                    }
                    filterNow() {
                        this.prepareFiltering(true);
                        if (this.getFilterText().length > 0) {
                            this.expandFilteredParents(this.getContentProvider().getRoots(this.getInput()));
                        }
                        this.repaint();
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
        var controls;
        (function (controls) {
            var viewers;
            (function (viewers) {
                class LabelProvider {
                    _getLabel;
                    constructor(getLabel) {
                        this._getLabel = getLabel;
                    }
                    getLabel(obj) {
                        if (this._getLabel) {
                            return this._getLabel(obj);
                        }
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
/// <reference path="../viewers/TreeViewer.ts"/>
/// <reference path="../viewers/LabelProvider.ts"/>
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls_1) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class ThemesDialog extends controls.dialogs.ViewerDialog {
                    constructor() {
                        super(new ThemeViewer(), false);
                        this.setSize(400, 400, true);
                    }
                    create() {
                        super.create();
                        this.setTitle("Themes");
                        this.addButton("Close", () => this.close());
                    }
                }
                dialogs.ThemesDialog = ThemesDialog;
                class ThemeViewer extends controls_1.viewers.TreeViewer {
                    constructor() {
                        super("ThemeViewer");
                        this.setLabelProvider(new ThemeLabelProvider());
                        this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        this.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(e => new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_COLOR))));
                        this.setInput(colibri.Platform
                            .getExtensions(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                            .map(ext => ext.getTheme())
                            .sort((a, b) => a.displayName.localeCompare(b.displayName)));
                    }
                }
                class ThemeLabelProvider extends controls.viewers.LabelProvider {
                    getLabel(theme) {
                        return theme.displayName;
                    }
                }
            })(dialogs = controls_1.dialogs || (controls_1.dialogs = {}));
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
                class ViewerFormDialog extends dialogs.AbstractViewerDialog {
                    constructor(viewer, showZoomControls) {
                        super(viewer, showZoomControls);
                    }
                    createDialogArea() {
                        const clientArea = document.createElement("div");
                        clientArea.classList.add("DialogClientArea");
                        clientArea.style.display = "grid";
                        clientArea.style.gridTemplateRows = "1fr auto";
                        clientArea.style.gridRowGap = "5px";
                        this.createFilteredViewer();
                        clientArea.appendChild(this.getFilteredViewer().getElement());
                        const formArea = document.createElement("div");
                        formArea.classList.add("DialogSection");
                        formArea.style.display = "grid";
                        formArea.style.gridTemplateColumns = "auto 1fr";
                        formArea.style.gridTemplateRows = "auto";
                        formArea.style.columnGap = "5px";
                        formArea.style.rowGap = "10px";
                        formArea.style.alignItems = "center";
                        this.createFormArea(formArea);
                        clientArea.appendChild(formArea);
                        this.getElement().appendChild(clientArea);
                    }
                    newFilteredViewer() {
                        return new controls.viewers.FilteredViewerInElement(this.getViewer(), this._showZoomControls);
                    }
                    getFilteredViewer() {
                        return super.getFilteredViewer();
                    }
                    layout() {
                        super.layout();
                        this.getFilteredViewer().resizeTo();
                    }
                    createFormArea(formArea) {
                        // nothing
                    }
                }
                dialogs.ViewerFormDialog = ViewerFormDialog;
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
                class WizardDialog extends dialogs.Dialog {
                    _pageDescArea;
                    _pageArea;
                    _clientArea;
                    _pageTitleLabel;
                    _pages;
                    _activePageIndex;
                    _finishButton;
                    _cancelButton;
                    _nextButton;
                    _backButton;
                    constructor(...classList) {
                        super("WizardDialog", ...classList);
                        this._pages = [];
                        this._activePageIndex = 0;
                    }
                    addPages(...pages) {
                        for (const page of pages) {
                            page.setWizard(this);
                        }
                        this._pages.push(...pages);
                    }
                    createActivePage() {
                        if (!this.hasPages()) {
                            return;
                        }
                        const page = this.getActivePage();
                        page.saveState();
                        this._pageArea.innerHTML = "";
                        page.createElements(this._pageArea);
                        this._pageTitleLabel.textContent = page.getTitle();
                        this._pageDescArea.innerHTML = page.getDescription();
                        this.updateWizardButtons();
                    }
                    updateWizardButtons() {
                        if (!this.hasPages()) {
                            return;
                        }
                        const page = this.getActivePage();
                        this._finishButton.disabled = !this.canFinishWizard();
                        this._backButton.disabled = !page.canGoBack() || this._activePageIndex === 0;
                        this._nextButton.disabled = !page.canGoNext() || this._activePageIndex === this._pages.length - 1;
                    }
                    canFinishWizard() {
                        for (const page of this._pages) {
                            if (!page.canFinish()) {
                                return false;
                            }
                        }
                        return true;
                    }
                    hasPages() {
                        return this._pages.length > 0;
                    }
                    getPages() {
                        return this._pages;
                    }
                    getActivePageIndex() {
                        return this._activePageIndex;
                    }
                    getActivePage() {
                        return this._pages[this._activePageIndex];
                    }
                    create() {
                        super.create();
                        this._finishButton = this.addButton("Finish", () => {
                            this.finishButtonPressed();
                            this.close();
                        });
                        this._cancelButton = this.addCancelButton(() => {
                            this.cancelButtonPressed();
                        });
                        this._nextButton = this.addButton("Next >", () => {
                            this._activePageIndex++;
                            this.createActivePage();
                        });
                        this._backButton = this.addButton("< Back", () => {
                            this._activePageIndex--;
                            this.createActivePage();
                        });
                        this.createActivePage();
                    }
                    createDialogArea() {
                        this._clientArea = document.createElement("div");
                        this._clientArea.classList.add("DialogClientArea");
                        this.getElement().appendChild(this._clientArea);
                        this._pageTitleLabel = document.createElement("label");
                        this._pageTitleLabel.textContent = "The title";
                        this._pageTitleLabel.classList.add("PageTitleLabel");
                        this._clientArea.appendChild(this._pageTitleLabel);
                        this._pageDescArea = document.createElement("div");
                        this._pageDescArea.classList.add("PageDescArea");
                        this._clientArea.appendChild(this._pageDescArea);
                        this._pageArea = document.createElement("div");
                        this._pageArea.classList.add("PageArea");
                        this._pageArea.innerHTML = "page area";
                        this._clientArea.appendChild(this._pageArea);
                    }
                    cancelButtonPressed() {
                        // nothing
                    }
                    finishButtonPressed() {
                        // nothing
                    }
                }
                dialogs.WizardDialog = WizardDialog;
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
                class WizardPage {
                    _title;
                    _description;
                    _wizard;
                    constructor(title, description) {
                        this._title = title;
                        this._description = description;
                    }
                    getWizard() {
                        return this._wizard;
                    }
                    setWizard(wizard) {
                        this._wizard = wizard;
                    }
                    getDescription() {
                        return this._description;
                    }
                    setDescription(description) {
                        this._description = description;
                    }
                    getTitle() {
                        return this._title;
                    }
                    setTitle(title) {
                        this._title = title;
                    }
                    createElements(parent) {
                        // nothing
                    }
                    canFinish() {
                        return true;
                    }
                    canGoNext() {
                        return true;
                    }
                    canGoBack() {
                        return true;
                    }
                    saveState() {
                        // nothing
                    }
                }
                dialogs.WizardPage = WizardPage;
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
                class EasyFormBuilder {
                    _formBuilder = new properties.FormBuilder();
                    _parent;
                    constructor(parent) {
                        this._parent = parent;
                    }
                    createLabel(text, tooltip) {
                        return this._formBuilder.createLabel(this._parent, text, tooltip);
                    }
                    createButton(text, callback) {
                        return this._formBuilder.createButton(this._parent, text, callback);
                    }
                    createMenuButton(text, getItems, callback) {
                        return this._formBuilder.createMenuButton(this._parent, text, getItems, callback);
                    }
                    createText(readOnly) {
                        return this._formBuilder.createText(this._parent, readOnly);
                    }
                    createTextDialog(dialogTitle, readOnly) {
                        return this._formBuilder.createTextDialog(this._parent, dialogTitle, readOnly);
                    }
                    createColor(readOnly, allowAlpha) {
                        return this._formBuilder.createColor(this._parent, readOnly, allowAlpha);
                    }
                    createTextArea(readOnly) {
                        return this._formBuilder.createTextArea(this._parent, readOnly);
                    }
                }
                properties.EasyFormBuilder = EasyFormBuilder;
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
                function clamp(value, min, max) {
                    if (min !== undefined && value < min) {
                        return min;
                    }
                    if (max !== undefined && value > max) {
                        return max;
                    }
                    return value;
                }
                properties.clamp = clamp;
                function defaultNumberValueComputer(value, increment, min, max) {
                    if (!increment) {
                        return value;
                    }
                    const num = parseFloat(value);
                    if (isNaN(num)) {
                        return value;
                    }
                    return clamp(num + increment, min, max).toFixed(2);
                }
                properties.defaultNumberValueComputer = defaultNumberValueComputer;
                function fontSizeValueComputer(value, increment, min, max) {
                    if (!increment) {
                        return value;
                    }
                    const num = parseFloat(value);
                    if (isNaN(num)) {
                        return value;
                    }
                    return clamp(num + increment, min, max).toFixed(2);
                }
                properties.fontSizeValueComputer = fontSizeValueComputer;
                class FormBuilder {
                    createSeparator(parent, text, gridColumn) {
                        const label = document.createElement("label");
                        label.classList.add("formSeparator");
                        label.innerText = text;
                        if (gridColumn) {
                            label.style.gridColumn = gridColumn;
                        }
                        parent.appendChild(label);
                        return label;
                    }
                    createLabel(parent, text = "", tooltip = "") {
                        const label = document.createElement("label");
                        label.classList.add("formLabel");
                        label.innerText = text;
                        if (tooltip) {
                            controls.Tooltip.tooltip(label, tooltip);
                        }
                        parent.appendChild(label);
                        return label;
                    }
                    createLink(parent, textOrIcon, callback) {
                        const btn = document.createElement("a");
                        btn.href = "#";
                        btn.innerText = textOrIcon;
                        btn.addEventListener("click", e => callback(e));
                        if (parent) {
                            parent.appendChild(btn);
                        }
                        return btn;
                    }
                    createButton(parent, textOrIcon, callback) {
                        const btn = document.createElement("button");
                        if (typeof textOrIcon === "string") {
                            btn.innerText = textOrIcon;
                        }
                        else {
                            const iconControl = new controls.IconControl(textOrIcon);
                            btn.appendChild(iconControl.getCanvas());
                        }
                        btn.addEventListener("click", e => callback(e));
                        if (parent) {
                            parent.appendChild(btn);
                        }
                        return btn;
                    }
                    createMenuButton(parent, text, getItems, callback) {
                        const btn = this.createButton(parent, text, e => {
                            const menu = new controls.Menu();
                            for (const item of getItems()) {
                                menu.add(new controls.Action({
                                    text: item.name,
                                    icon: item.icon,
                                    callback: () => {
                                        callback(item.value);
                                    }
                                }));
                            }
                            menu.createWithEvent(e);
                        });
                        return btn;
                    }
                    createLabelToTextNumericLink(label, text, increment, min, max, valueComputer) {
                        if (!valueComputer) {
                            valueComputer = defaultNumberValueComputer;
                        }
                        label.style.cursor = "ew-resize";
                        label.draggable = true;
                        const updatePosition = (e) => {
                            const delta = e.movementX * increment;
                            text.value = valueComputer(text.value, delta, min, max);
                            text.dispatchEvent(new Event("preview"));
                        };
                        label.addEventListener("mousedown", e => {
                            label.requestPointerLock({
                                unadjustedMovement: true
                            });
                            document.addEventListener("mousemove", updatePosition);
                            document.addEventListener("mouseup", () => {
                                document.exitPointerLock();
                                document.removeEventListener("mousemove", updatePosition);
                                text.dispatchEvent(new Event("focusout"));
                            });
                            text.dispatchEvent(new Event("focusin"));
                        });
                    }
                    createIncrementableText(parent, readOnly = false, increment, min, max, valueComputer) {
                        valueComputer = valueComputer || defaultNumberValueComputer;
                        const text = this.createText(parent, readOnly);
                        if (increment !== undefined) {
                            text.addEventListener("focusout", e => {
                                text.removeAttribute("__editorWheel");
                                const initText = text.getAttribute("__editorInitText");
                                if (text.value !== initText) {
                                    text.dispatchEvent(new CustomEvent("change", {
                                        detail: {
                                            initText
                                        }
                                    }));
                                }
                            });
                            text.addEventListener("focusin", () => {
                                text.setAttribute("__editorInitText", text.value);
                            });
                            text.addEventListener("wheel", e => {
                                text.setAttribute("__editorWheel", "1");
                                if (document.activeElement === text) {
                                    e.preventDefault();
                                    const delta = increment * Math.sign(e.deltaY);
                                    text.value = valueComputer(text.value, delta, min, max);
                                    text.dispatchEvent(new Event("preview"));
                                }
                            });
                            text.addEventListener("keydown", e => {
                                let delta = undefined;
                                switch (e.code) {
                                    case "ArrowUp":
                                        delta = increment;
                                        break;
                                    case "ArrowDown":
                                        delta = -increment;
                                        break;
                                }
                                if (delta !== undefined) {
                                    if (e.shiftKey) {
                                        delta *= 10;
                                    }
                                    text.value = valueComputer(text.value, delta, min, max);
                                    text.dispatchEvent(new Event("preview"));
                                    e.preventDefault();
                                }
                            });
                        }
                        return text;
                    }
                    createText(parent, readOnly = false) {
                        const text = document.createElement("input");
                        text.type = "text";
                        text.classList.add("formText");
                        text.readOnly = readOnly;
                        parent.appendChild(text);
                        return text;
                    }
                    createButtonDialog(args) {
                        const iconControl = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                        const buttonElement = document.createElement("button");
                        buttonElement.appendChild(iconControl.getCanvas());
                        buttonElement.addEventListener("click", async (e) => {
                            const value = args.getValue();
                            const viewer = await args.createDialogViewer(value);
                            const dlg = new controls.dialogs.ViewerDialog(viewer, true);
                            dlg.setSize(undefined, window.innerHeight * 2 / 3);
                            dlg.create();
                            dlg.setTitle(args.dialogTittle);
                            dlg.enableButtonOnlyWhenOneElementIsSelected(dlg.addOpenButton("Select", sel => {
                                const obj = sel[0];
                                const value = args.dialogElementToString(viewer, obj);
                                args.onValueSelected(value);
                                if (args.updateIconCallback) {
                                    args.updateIconCallback(iconControl, value);
                                }
                            }));
                            dlg.addCancelButton();
                            controls.viewers.GridTreeViewerRenderer.expandSections(viewer);
                        });
                        const updateDialogButtonIcon = () => {
                            if (args.updateIconCallback) {
                                const value = args.getValue();
                                args.updateIconCallback(iconControl, value);
                            }
                        };
                        updateDialogButtonIcon();
                        return { buttonElement, updateDialogButtonIcon };
                    }
                    createTextDialog(parent, dialogTitle, readOnly = false) {
                        const text = this.createTextArea(parent, false);
                        text.rows = 1;
                        const btn = document.createElement("button");
                        btn.textContent = "...";
                        btn.addEventListener("click", () => {
                            const dlg = new properties.StringDialog();
                            dlg.create();
                            dlg.setTitle(dialogTitle);
                            dlg.addButton("Accept", () => {
                                text.value = dlg.getValue();
                                text.dispatchEvent(new Event("change"));
                                dlg.close();
                            });
                            dlg.addCancelButton();
                            dlg.setValue(text.value);
                        });
                        const container = document.createElement("div");
                        container.classList.add("StringDialogField");
                        container.appendChild(text);
                        container.appendChild(btn);
                        parent.appendChild(container);
                        return { container, text, btn };
                    }
                    createColor(parent, readOnly = false, allowAlpha = true) {
                        const text = document.createElement("input");
                        text.type = "text";
                        text.classList.add("formText");
                        text.readOnly = readOnly;
                        const btn = document.createElement("button");
                        // btn.textContent = "...";
                        btn.classList.add("ColorButton");
                        btn.appendChild(new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_COLOR)).getCanvas());
                        const colorElement = document.createElement("div");
                        colorElement.style.display = "grid";
                        colorElement.style.gridTemplateColumns = "1fr auto";
                        colorElement.style.gap = "5px";
                        colorElement.style.alignItems = "center";
                        colorElement.appendChild(text);
                        colorElement.appendChild(btn);
                        if (parent) {
                            parent.appendChild(colorElement);
                        }
                        btn.addEventListener("mousedown", e => {
                            if (text.readOnly) {
                                return;
                            }
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (controls.ColorPickerManager.isActivePicker()) {
                                controls.ColorPickerManager.closeActive();
                                return;
                            }
                            const picker = controls.ColorPickerManager.createPicker();
                            btn["__picker"] = picker;
                            const initialColor = text.value;
                            picker.setOptions({
                                popup: "left",
                                editor: false,
                                alpha: allowAlpha,
                                onClose: () => {
                                    text.value = initialColor;
                                    btn.style.background = initialColor;
                                    text.dispatchEvent(new CustomEvent("preview"));
                                    controls.ColorPickerManager.closeActive();
                                },
                                onDone: (color) => {
                                    text.value = allowAlpha ? color.hex : color.hex.substring(0, 7);
                                    btn.style.background = text.value;
                                    text.dispatchEvent(new CustomEvent("change"));
                                },
                                onChange: (color) => {
                                    text.value = allowAlpha ? color.hex : color.hex.substring(0, 7);
                                    btn.style.background = text.value;
                                    text.dispatchEvent(new CustomEvent("preview"));
                                }
                            });
                            try {
                                picker.setColour(text.value, false);
                            }
                            catch (e) {
                                picker.setColour("#fff", false);
                            }
                            picker.show();
                            const pickerElement = picker.domElement;
                            const pickerBounds = pickerElement.getBoundingClientRect();
                            const textBounds = text.getBoundingClientRect();
                            pickerElement.getElementsByClassName("picker_arrow")[0].remove();
                            let top = textBounds.top - pickerBounds.height;
                            if (top + pickerBounds.height > window.innerHeight) {
                                top = window.innerHeight - pickerBounds.height;
                            }
                            if (top < 0) {
                                top = textBounds.bottom;
                            }
                            let left = textBounds.left;
                            if (left + pickerBounds.width > window.innerWidth) {
                                left = window.innerWidth - pickerBounds.width;
                            }
                            pickerElement.style.top = top + "px";
                            pickerElement.style.left = left + "px";
                        });
                        return {
                            element: colorElement,
                            text: text,
                            btn: btn
                        };
                    }
                    createTextArea(parent, readOnly = false) {
                        const text = document.createElement("textarea");
                        text.classList.add("formText");
                        text.readOnly = readOnly;
                        parent.appendChild(text);
                        return text;
                    }
                    static NEXT_ID = 0;
                    createCheckbox(parent, label) {
                        const check = document.createElement("input");
                        if (label) {
                            const id = (properties.PropertySection.NEXT_ID++).toString();
                            label.htmlFor = id;
                            check.setAttribute("id", id);
                        }
                        check.type = "checkbox";
                        check.classList.add("formCheckbox");
                        parent.appendChild(check);
                        return check;
                    }
                    createMenuIcon(parent, menuProvider) {
                        const icon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_SMALL_MENU));
                        icon.getCanvas().classList.add("IconButton");
                        parent.appendChild(icon.getCanvas());
                        icon.getCanvas().addEventListener("click", e => {
                            const menu = menuProvider();
                            menu.createWithEvent(e);
                        });
                        return icon;
                    }
                    createIcon(parent, iconImage, isButtonStyle) {
                        const icon = new controls.IconControl(iconImage, isButtonStyle);
                        parent.appendChild(icon.getCanvas());
                        return icon;
                    }
                }
                properties.FormBuilder = FormBuilder;
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
                class PropertyPage extends controls.Control {
                    _sectionProvider;
                    _sectionPanes;
                    _sectionPaneMap;
                    _selection;
                    constructor() {
                        super("div");
                        this.addClass("PropertyPage");
                        this._sectionPanes = [];
                        this._sectionPaneMap = new Map();
                        this._selection = [];
                    }
                    getSections() {
                        return this._sectionPanes.map(pane => pane.getSection());
                    }
                    getSection(sectionId) {
                        return this.getSections().find(section => section.getId() === sectionId);
                    }
                    build() {
                        if (this._sectionProvider) {
                            const list = [];
                            this._sectionProvider.addSections(this, list);
                            for (const section of list) {
                                if (!this._sectionPaneMap.has(section.getId())) {
                                    const pane = new properties.PropertySectionPane(this, section);
                                    if (section.getTypeHash()) {
                                        this.removePanesWithSameTypeHash(section.getTypeHash());
                                    }
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
                    removePanesWithSameTypeHash(typeHash) {
                        for (const pane of this._sectionPanes) {
                            const section = pane.getSection();
                            if (section.getTypeHash() === typeHash) {
                                this.remove(pane);
                            }
                        }
                        this._sectionPanes = this._sectionPanes
                            .filter(pane => pane.getSection().getTypeHash() !== typeHash);
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
                        let n = this._selection.length;
                        let selection = this._selection;
                        if (n === 0) {
                            const obj = this._sectionProvider.getEmptySelectionObject();
                            if (obj) {
                                selection = [obj];
                                n = 1;
                            }
                            else {
                                const array = this._sectionProvider.getEmptySelectionArray();
                                if (array) {
                                    selection = array;
                                    n = selection.length;
                                }
                            }
                        }
                        this._selection = selection;
                        for (const pane of this._sectionPanes) {
                            const section = pane.getSection();
                            let show = section.canEditNumber(n);
                            if (show) {
                                for (const obj of selection) {
                                    if (!section.canEdit(obj, n)) {
                                        show = false;
                                        break;
                                    }
                                }
                                if (show && !section.canEditAll(selection)) {
                                    show = false;
                                }
                            }
                            show = show && sectionIdSet.has(section.getId());
                            if (show) {
                                pane.getElement().style.display = "grid";
                                pane.createSection();
                                section.updateWithSelection();
                                if (section.isDynamicTitle()) {
                                    pane.updateTitle();
                                }
                            }
                            else {
                                section.onSectionHidden();
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
                                pane.createSection();
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
                    setSelection(sel, update = true) {
                        this._selection = sel;
                        if (update) {
                            this.updateWithSelection();
                        }
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
/// <reference path="./FormBuilder.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var controls;
        (function (controls) {
            var properties;
            (function (properties) {
                class PropertySection extends properties.FormBuilder {
                    _id;
                    _title;
                    _page;
                    _updaters;
                    _fillSpace;
                    _collapsedByDefault;
                    _icon;
                    _typeHash;
                    constructor(page, id, title, fillSpace = false, collapsedByDefault = false, icon, typeHash) {
                        super();
                        this._page = page;
                        this._id = id;
                        this._title = title;
                        this._fillSpace = fillSpace;
                        this._collapsedByDefault = collapsedByDefault;
                        this._icon = icon;
                        this._typeHash = typeHash;
                        this._updaters = [];
                        const localTabSection = localStorage.getItem(this.localStorageKey("tabSection"));
                    }
                    onSectionHidden() {
                        // nothing
                    }
                    canEditAll(selection) {
                        return true;
                    }
                    localStorageKey(prop) {
                        return "PropertySection[" + this._id + "]." + prop;
                    }
                    createMenu(menu) {
                        // empty by default
                    }
                    hasMenu() {
                        return false;
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
                    isCollapsedByDefault() {
                        return this._collapsedByDefault;
                    }
                    getPage() {
                        return this._page;
                    }
                    getSelection() {
                        return this._page.getSelection();
                    }
                    getSelectionFirstElement() {
                        return this.getSelection()[0];
                    }
                    getId() {
                        return this._id;
                    }
                    getTitle() {
                        return this._title;
                    }
                    isDynamicTitle() {
                        return false;
                    }
                    getIcon() {
                        return this._icon;
                    }
                    getTypeHash() {
                        return this._typeHash;
                    }
                    create(parent) {
                        this.createForm(parent);
                    }
                    flatValues_Number(values) {
                        const set = new Set(values);
                        if (set.size === 1) {
                            const value = set.values().next().value;
                            return value.toString();
                        }
                        return "";
                    }
                    flatValues_StringJoin(values) {
                        return values.join(",");
                    }
                    flatValues_StringJoinDifferent(values) {
                        const set = new Set(values);
                        return [...set].join(",");
                    }
                    flatValues_StringOneOrNothing(values) {
                        const set = new Set(values);
                        return set.size === 1 ? values[0] : `(${values.length} selected)`;
                    }
                    flatValues_BooleanAnd(values) {
                        for (const value of values) {
                            if (!value) {
                                return false;
                            }
                        }
                        return true;
                    }
                    parseNumberExpressionString(expr, isInteger = false) {
                        let value;
                        const parser = new exprEval.Parser();
                        try {
                            value = parser.evaluate(expr);
                            if (typeof value === "number") {
                                if (isInteger) {
                                    return Math.floor(value);
                                }
                                return value;
                            }
                        }
                        catch (e) {
                            // nothing, wrong syntax
                        }
                        if (isInteger) {
                            return Number.parseInt(expr, 10);
                        }
                        return Number.parseFloat(expr);
                    }
                    parseNumberExpression(textElement, isInteger = false) {
                        const expr = textElement.value;
                        const value = this.parseNumberExpressionString(expr, isInteger);
                        if (typeof value === "number") {
                            textElement.value = value.toString();
                        }
                        return value;
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
                class PropertySectionPane extends controls.Control {
                    _section;
                    _titleArea;
                    _formArea;
                    _page;
                    _menuIcon;
                    _expandIconControl;
                    _titleLabel;
                    constructor(page, section) {
                        super();
                        this._page = page;
                        this._section = section;
                        this.addClass("PropertySectionPane");
                        const hashType = section.getTypeHash();
                        if (hashType) {
                            this.getElement().setAttribute("type-hash", section.getTypeHash());
                        }
                    }
                    createSection() {
                        if (!this._formArea) {
                            this._titleArea = document.createElement("div");
                            this._titleArea.classList.add("PropertyTitleArea");
                            this._titleArea.addEventListener("click", () => this.toggleSection());
                            this._expandIconControl = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_COLLAPSE));
                            this._expandIconControl.getCanvas().classList.add("expanded");
                            this._expandIconControl.getCanvas().addEventListener("click", e => {
                                e.stopImmediatePropagation();
                                this.toggleSection();
                            });
                            this._titleArea.appendChild(this._expandIconControl.getCanvas());
                            const icon = this._section.getIcon();
                            if (icon) {
                                const iconControl = new controls.IconControl(icon);
                                iconControl.getCanvas().classList.add("PropertySectionIcon");
                                this._titleArea.appendChild(iconControl.getCanvas());
                                this._titleArea.classList.add("PropertyTitleAreaWithIcon");
                            }
                            this._titleLabel = document.createElement("label");
                            this._titleLabel.classList.add("TitleLabel");
                            this.updateTitle();
                            this._titleArea.appendChild(this._titleLabel);
                            this._menuIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_SMALL_MENU));
                            this._menuIcon.getCanvas().classList.add("IconButton");
                            this._menuIcon.getCanvas().style.visibility = this._section.hasMenu() ? "visible" : "hidden";
                            this._menuIcon.getCanvas().addEventListener("click", e => {
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                if (this._section.hasMenu()) {
                                    const menu = new controls.Menu();
                                    this._section.createMenu(menu);
                                    menu.createWithEvent(e);
                                }
                            });
                            this._titleArea.appendChild(this._menuIcon.getCanvas());
                            this._formArea = document.createElement("div");
                            this._formArea.classList.add("PropertyFormArea");
                            this._section.create(this._formArea);
                            this.getElement().appendChild(this._titleArea);
                            this.getElement().appendChild(this._formArea);
                            this.updateExpandIcon();
                            let collapsed = this.getCollapsedStateInStorage();
                            if (collapsed === undefined) {
                                this.setCollapsedStateInStorage(this._section.isCollapsedByDefault());
                                collapsed = this.getCollapsedStateInStorage();
                            }
                            if (collapsed === "true") {
                                this.toggleSection();
                            }
                        }
                    }
                    getCollapsedStateInStorage() {
                        return window.localStorage[this.getLocalStorageKey() + ".collapsed"];
                    }
                    setCollapsedStateInStorage(collapsed) {
                        return window.localStorage[this.getLocalStorageKey() + ".collapsed"] = collapsed ? "true" : "false";
                    }
                    getLocalStorageKey() {
                        return `colibri.ui.controls.properties.PropertySection[${this._section.getId()}]`;
                    }
                    isExpanded() {
                        return this._expandIconControl.getCanvas().classList.contains("expanded");
                    }
                    toggleSection() {
                        if (this.isExpanded()) {
                            this._formArea.style.display = "none";
                            this._expandIconControl.getCanvas().classList.remove("expanded");
                        }
                        else {
                            this._formArea.style.display = "grid";
                            this._expandIconControl.getCanvas().classList.add("expanded");
                        }
                        this._page.updateExpandStatus();
                        this.getContainer().dispatchLayoutEvent();
                        this.updateExpandIcon();
                        this.setCollapsedStateInStorage(!this.isExpanded());
                    }
                    updateTitle() {
                        if (this._titleLabel) {
                            this._titleLabel.innerHTML = this._section.getTitle();
                        }
                    }
                    updateExpandIcon() {
                        const icon = this.isExpanded() ? colibri.ICON_CONTROL_SECTION_COLLAPSE : colibri.ICON_CONTROL_SECTION_EXPAND;
                        const image = colibri.ColibriPlugin.getInstance().getIcon(icon);
                        this._expandIconControl.setIcon(image);
                    }
                    getSection() {
                        return this._section;
                    }
                }
                properties.PropertySectionPane = PropertySectionPane;
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
                    _id;
                    constructor(id) {
                        this._id = id;
                    }
                    sortSections(sections) {
                        sections.sort((a, b) => {
                            const aa = a.isFillSpace() ? 1 : 0;
                            const bb = b.isFillSpace() ? 1 : 0;
                            return aa - bb;
                        });
                    }
                    getEmptySelectionObject() {
                        return null;
                    }
                    getEmptySelectionArray() {
                        return null;
                    }
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
            var properties;
            (function (properties) {
                class StringDialog extends controls.dialogs.Dialog {
                    _textArea;
                    createDialogArea() {
                        this._textArea = document.createElement("textarea");
                        this._textArea.classList.add("DialogClientArea");
                        this._textArea.style.boxSizing = "border-box";
                        this._textArea.style.resize = "none";
                        this.getElement().appendChild(this._textArea);
                    }
                    setValue(value) {
                        this._textArea.value = value;
                    }
                    getValue() {
                        return this._textArea.value;
                    }
                }
                properties.StringDialog = StringDialog;
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
                        if (!Array.isArray(input)) {
                            return [];
                        }
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
                class DefaultViewerMenuProvider {
                    builder;
                    constructor(builder) {
                        this.builder = builder;
                    }
                    fillMenu(viewer, menu) {
                        if (this.builder) {
                            this.builder(viewer, menu);
                            menu.addSeparator();
                        }
                        menu.addAction({
                            commandId: ui.ide.actions.CMD_COLLAPSE_ALL,
                            callback: () => viewer.collapseAll()
                        });
                        menu.addAction({
                            commandId: ui.ide.actions.CMD_EXPAND_COLLAPSE_BRANCH,
                            callback: () => viewer.expandCollapseBranch()
                        });
                    }
                }
                viewers.DefaultViewerMenuProvider = DefaultViewerMenuProvider;
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
                    static instance = new EmptyCellRenderer(false);
                    _variableSize;
                    constructor(variableSize = true) {
                        this._variableSize = variableSize;
                    }
                    isVariableSize() {
                        return this._variableSize;
                    }
                    renderCell(args) {
                        // nothing
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
                    _getRenderer;
                    static withIcon(icon) {
                        return new EmptyCellRendererProvider(() => new viewers.IconImageCellRenderer(icon));
                    }
                    constructor(getRenderer) {
                        this._getRenderer = getRenderer ?? ((e) => new viewers.EmptyCellRenderer());
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
                class FilterControl extends controls.Control {
                    _filterElement;
                    _menuIcon;
                    _filteredViewer;
                    _inputIcon;
                    constructor(filterViewer) {
                        super("div", "FilterControl");
                        this._filteredViewer = filterViewer;
                        this.setLayoutChildren(false);
                        this._filterElement = document.createElement("input");
                        this.getElement().appendChild(this._filterElement);
                        this._inputIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE));
                        this._inputIcon.getCanvas().classList.add("FilterControlInputIcon");
                        this._filterElement.addEventListener("keyup", () => this.updateInputIcon());
                        this._filterElement.addEventListener("change", () => this.updateInputIcon());
                        this._inputIcon.getCanvas().addEventListener("click", () => this.clearFilter());
                        this.getElement().appendChild(this._inputIcon.getCanvas());
                        this._menuIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_SMALL_MENU));
                        this._menuIcon.getCanvas().classList.add("IconButton");
                        this.getElement().appendChild(this._menuIcon.getCanvas());
                    }
                    clearFilter() {
                        this.getFilteredViewer().clearFilter();
                        this.updateInputIcon();
                    }
                    updateInputIcon() {
                        this._inputIcon.getCanvas().style.display = this._filterElement.value === "" ? "none" : "block";
                    }
                    getFilteredViewer() {
                        return this._filteredViewer;
                    }
                    getFilterElement() {
                        return this._filterElement;
                    }
                    getMenuIcon() {
                        return this._menuIcon;
                    }
                }
                viewers.FilterControl = FilterControl;
                class ViewerContainer extends controls.Control {
                    _viewer;
                    _zoomControl;
                    _filteredViewer;
                    constructor(filteredViewer, zoom = true) {
                        super("div", "ViewerContainer");
                        this._viewer = filteredViewer.getViewer();
                        this._filteredViewer = filteredViewer;
                        this.add(this._viewer);
                        if (zoom) {
                            this.addZoomControl();
                        }
                        requestAnimationFrame(() => this.layout());
                    }
                    addZoomControl() {
                        this._zoomControl = new controls.ZoomControl({
                            showReset: false
                        });
                        this.getElement().appendChild(this._zoomControl.getElement());
                        this._zoomControl.setCallback(z => {
                            const viewer = this.getViewer();
                            viewer.setCellSize(viewer.getCellSize() + controls.ICON_SIZE * z);
                            viewer.saveCellSize();
                            viewer.repaint();
                        });
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
                    _viewer;
                    _viewerContainer;
                    _filterControl;
                    _scrollPane;
                    _menuProvider;
                    constructor(viewer, showZoomControls, ...classList) {
                        super("div", "FilteredViewer", ...classList);
                        this._viewer = viewer;
                        this._filterControl = new FilterControl(this);
                        this.add(this._filterControl);
                        this._viewerContainer = new ViewerContainer(this, showZoomControls);
                        this._scrollPane = new controls.ScrollPane(this._viewerContainer);
                        this.add(this._scrollPane);
                        this.setLayoutChildren(false);
                        this.registerListeners();
                        requestAnimationFrame(() => this._scrollPane.layout());
                        this.registerContextMenu();
                    }
                    registerContextMenu() {
                        this._menuProvider = new viewers.DefaultViewerMenuProvider();
                        const makeListener = (openLeft) => {
                            return (e) => {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                if (!this._menuProvider) {
                                    return;
                                }
                                this._viewer.onMouseUp(e);
                                const menu = new controls.Menu();
                                this._menuProvider.fillMenu(this._viewer, menu);
                                menu.createWithEvent(e, openLeft);
                            };
                        };
                        this._viewer.getElement().addEventListener("contextmenu", makeListener(false));
                        this._filterControl.getMenuIcon().getCanvas().addEventListener("click", makeListener(true));
                    }
                    getMenuProvider() {
                        return this._menuProvider;
                    }
                    setMenuProvider(menuProvider) {
                        this._menuProvider = menuProvider;
                    }
                    getScrollPane() {
                        return this._scrollPane;
                    }
                    registerListeners() {
                        this._filterControl.getFilterElement().addEventListener("input", e => this.onFilterInput(e));
                        this._filterControl.getFilterElement().addEventListener("keyup", e => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                const viewer = this.getViewer();
                                viewer.getElement().focus();
                                const sel = viewer.getSelection();
                                const selVisible = viewer.getVisibleElements().filter(elem => sel.indexOf(elem) > 0).length > 0;
                                if (!selVisible) {
                                    const obj = viewer.getFirstVisibleElement();
                                    if (obj) {
                                        viewer.setSelection([obj]);
                                    }
                                }
                                viewer.reveal(viewer.getSelection());
                            }
                        });
                        this.getViewer().getElement().addEventListener("keyup", e => {
                            if (e.key === "ArrowUp") {
                                if (this.getViewer().getSelection().length === 1) {
                                    const elem = this.getViewer().getSelectionFirstElement();
                                    const visibleElem = this.getViewer().getFirstVisibleElement();
                                    if (visibleElem === elem) {
                                        this._filterControl.getFilterElement().focus();
                                    }
                                }
                            }
                        });
                    }
                    clearFilter() {
                        this._filterControl.getFilterElement().value = "";
                        this.onFilterInput();
                        this.getViewer().reveal(...this.getViewer().getSelection());
                    }
                    onFilterInput(e) {
                        const value = this._filterControl.getFilterElement().value;
                        this._viewer.setFilterText(value);
                        // this._viewer.repaint();
                    }
                    filterText(value) {
                        this._filterControl.getFilterElement().value = value;
                        this.onFilterInput();
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
                    constructor(viewer, showZoomControls, ...classList) {
                        super(viewer, showZoomControls, ...classList);
                        this.setHandlePosition(false);
                        this.style.position = "relative";
                        this.style.height = "100%";
                        this.resizeTo();
                        setTimeout(() => this.resizeTo(), 10);
                    }
                    resizeTo() {
                        const parent = this.getElement().parentElement;
                        if (parent) {
                            this.setBounds({
                                width: parent.clientWidth,
                                height: parent.clientHeight
                            });
                        }
                        this.getViewer().repaint();
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
                    _maxCount;
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
                        const icon = ui.ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER);
                        icon.paint(args.canvasContext, args.x, args.y, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, true);
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
                            if (frameCount === 0) {
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
                            let size = Math.floor(Math.sqrt(width * height / frameCount) * 0.8) + 1;
                            if (frameCount === 1) {
                                size = Math.min(width, height);
                            }
                            const cols = Math.floor(width / size);
                            const rows = frameCount / cols + (frameCount % cols === 0 ? 0 : 1);
                            const marginX = Math.floor(Math.max(0, (width - cols * size) / 2));
                            const marginY = Math.floor(Math.max(0, (height - rows * size) / 2));
                            let itemX = 0;
                            let itemY = 0;
                            const startX = args.x + marginX;
                            const startY = 2 + args.y + marginY;
                            for (let i = 0; i < frameCount; i++) {
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
                    _viewer;
                    _contentHeight;
                    _fullPaint;
                    _itemIndex;
                    constructor(viewer, cellSize = controls.ROW_HEIGHT) {
                        this._viewer = viewer;
                        this._viewer.setCellSize(cellSize);
                        this._viewer.restoreCellSize();
                    }
                    getViewer() {
                        return this._viewer;
                    }
                    paint(fullPaint) {
                        const viewer = this._viewer;
                        this._fullPaint = fullPaint;
                        this._itemIndex = 0;
                        const x = 0;
                        const y = viewer.getScrollY();
                        const contentProvider = viewer.getContentProvider();
                        const roots = contentProvider.getRoots(viewer.getInput());
                        const treeIconList = [];
                        const paintItems = [];
                        this._contentHeight = Number.MIN_SAFE_INTEGER;
                        this.paintItems(roots, treeIconList, paintItems, null, x, y);
                        // for (const paintItem of paintItems) {
                        //     contentHeight = Math.max(paintItem.y + paintItem.h, contentHeight);
                        // }
                        this._contentHeight -= viewer.getScrollY();
                        return {
                            contentHeight: this._contentHeight,
                            treeIconList: treeIconList,
                            paintItems: paintItems
                        };
                    }
                    paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y) {
                        const viewer = this._viewer;
                        const context = viewer.getContext();
                        const b = viewer.getBounds();
                        for (const obj of objects) {
                            const children = viewer.getContentProvider().getChildren(obj);
                            const expanded = viewer.isExpanded(obj);
                            let newParentPaintItem = null;
                            if (viewer.isFilterIncluded(obj)) {
                                const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);
                                const args = new viewers.RenderCellArgs(context, x + viewers.LABEL_MARGIN, y, b.width - x - viewers.LABEL_MARGIN, 0, obj, viewer);
                                const cellHeight = renderer.cellHeight(args);
                                args.h = cellHeight;
                                viewer.paintItemBackground(obj, 0, y, b.width, cellHeight);
                                let isItemVisible = false;
                                if (y > -viewer.getCellSize() && y < b.height) {
                                    // render tree icon
                                    if (children.length > 0) {
                                        const iconY = y + (cellHeight - viewers.TREE_ICON_SIZE) / 2;
                                        const themeIcon = colibri.ColibriPlugin.getInstance()
                                            .getIcon(expanded ? colibri.ICON_CONTROL_TREE_COLLAPSE : colibri.ICON_CONTROL_TREE_EXPAND);
                                        let treeIcon = themeIcon;
                                        if (viewer.isSelected(obj)) {
                                            treeIcon = themeIcon.getNegativeThemeImage();
                                        }
                                        treeIcon.paint(context, x, iconY, viewers.TREE_ICON_SIZE, viewers.TREE_ICON_SIZE, false);
                                        treeIconList.push({
                                            rect: new controls.Rect(x, iconY, viewers.TREE_ICON_SIZE, viewers.TREE_ICON_SIZE),
                                            obj: obj
                                        });
                                    }
                                    isItemVisible = true;
                                    this.renderTreeCell(args, renderer);
                                }
                                if (isItemVisible || this._fullPaint) {
                                    const item = new viewers.PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);
                                    item.set(args.x, args.y, args.w, args.h);
                                    paintItems.push(item);
                                    newParentPaintItem = item;
                                }
                                this._itemIndex++;
                                this._contentHeight = Math.max(this._contentHeight, args.y + args.h);
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
                        let x = args.x;
                        let y = args.y;
                        const ctx = args.canvasContext;
                        ctx.fillStyle = controls.Controls.getTheme().viewerForeground;
                        let args2;
                        const renderCell = !(renderer instanceof viewers.EmptyCellRenderer);
                        if (args.h <= controls.ROW_HEIGHT) {
                            args2 = new viewers.RenderCellArgs(args.canvasContext, args.x, args.y, viewers.TREE_ICON_SIZE, args.h, args.obj, args.viewer);
                            if (renderCell) {
                                x += 20;
                            }
                            y += 15;
                        }
                        else if (renderer.layout === "full-width" && args.h > controls.ROW_HEIGHT * 2) {
                            args2 = new viewers.RenderCellArgs(args.canvasContext, args.x, args.y, args.w, args.h - 20, args.obj, args.viewer);
                            y += args2.h + 15;
                        }
                        else {
                            args2 = new viewers.RenderCellArgs(args.canvasContext, args.x, args.y, args.h, args.h, args.obj, args.viewer);
                            if (renderCell) {
                                x += args.h + 4;
                                y += args.h / 2 + controls.getCanvasFontHeight() / 2;
                            }
                            else {
                                y += 15;
                            }
                        }
                        ctx.save();
                        this.prepareContextForRenderCell(args2);
                        if (renderCell) {
                            renderer.renderCell(args2);
                        }
                        ctx.restore();
                        ctx.save();
                        this.prepareContextForText(args);
                        this.renderLabel(args, x, y);
                        if (args.viewer.isHighlightMatches() && args.viewer.getFilterText().length > 0) {
                            this.defaultRenderMatchHighlight(args, x, y);
                        }
                        ctx.restore();
                    }
                    renderMatchHighlight(args, x, y, label) {
                        const result = args.viewer.getMatchesResult(label);
                        if (result && result.matches) {
                            const start = this.measureText(args, result.measureStart);
                            const width = this.measureText(args, result.measureMatch);
                            const cellRight = args.x + args.w;
                            if (x + start > cellRight) {
                                return;
                            }
                            const ctx = args.canvasContext;
                            ctx.save();
                            const selected = args.viewer.isSelected(args.obj);
                            const theme = controls.Controls.getTheme();
                            ctx.strokeStyle = selected ? theme.viewerSelectionForeground : theme.viewerForeground;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(x + start, y + 2 + 0.5);
                            ctx.lineTo(Math.min(cellRight - 2, x + start + width), y + 2 + 0.5);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }
                    }
                    defaultRenderMatchHighlight(args, x, y) {
                        const label = args.viewer.getLabelProvider().getLabel(args.obj);
                        this.renderMatchHighlight(args, x, y, label);
                    }
                    renderLabel(args, x, y) {
                        const styledProvider = this._viewer.getStyledLabelProvider();
                        const selected = this._viewer.isSelected(args.obj);
                        if (!selected && styledProvider) {
                            this.renderStyledLabel(args, x, y, styledProvider);
                        }
                        else {
                            this.renderPlainLabel(args, x, y);
                        }
                    }
                    renderPlainLabel(args, x, y) {
                        const label = args.viewer.getLabelProvider().getLabel(args.obj);
                        args.canvasContext.fillText(label, x, y);
                    }
                    renderStyledLabel(args, x, y, styledProvider, maxLength = -1) {
                        const dark = controls.Controls.getTheme().dark;
                        const parts = styledProvider.getStyledTexts(args.obj, dark);
                        let cursor = x;
                        const ctx = args.canvasContext;
                        ctx.save();
                        let len = 0;
                        for (const part of parts) {
                            ctx.fillStyle = part.color;
                            let text = part.text;
                            if (maxLength > 0 && len + part.text.length > maxLength) {
                                text = text.substring(0, maxLength - len - 2) + "..";
                            }
                            ctx.fillText(text, cursor, y);
                            const width = this.measureText(args, text);
                            cursor += width;
                            len += text.length;
                            if (maxLength > 0 && len >= maxLength) {
                                break;
                            }
                        }
                        ctx.restore();
                    }
                    measureText(args, text) {
                        return args.canvasContext.measureText(text).width;
                    }
                    prepareContextForRenderCell(args) {
                        // nothing by default
                    }
                    prepareContextForText(args) {
                        args.canvasContext.font = controls.getCanvasFontHeight() + "px " + controls.FONT_FAMILY;
                        if (args.viewer.isSelected(args.obj)) {
                            args.canvasContext.fillStyle = controls.Controls.getTheme().viewerSelectionForeground;
                        }
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
                const DARK_FILL_COLOR = "rgba(255, 255, 255, 0.05)";
                const DARK_BORDER_COLOR = "rgba(255, 255, 255, 0)";
                const LIGHT_FILL_COLOR = "rgba(255, 255, 255, 0.3)";
                const LIGHT_BORDER_COLOR = "rgba(255, 255, 255, 0.3)";
                const DARK_SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
                const DARK_CHILD_SHADOW_COLOR = "rgba(0, 0, 0, 0.4)";
                const DARK_CHILD_SHADOW_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";
                const LIGHT_SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";
                const LIGHT_CHILD_SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
                const LIGHT_CHILD_SHADOW_BORDER_COLOR = "rgba(255, 255, 255, 1)";
                class GridTreeViewerRenderer extends viewers.TreeViewerRenderer {
                    _center;
                    _flat;
                    _isSectionCriteria;
                    _isShadowChildCriteria;
                    _paintItemShadow;
                    constructor(viewer, flat = false, center = false) {
                        super(viewer);
                        viewer.setCellSize(128);
                        viewer.restoreCellSize();
                        this._center = center;
                        this._flat = flat;
                        this._paintItemShadow = false;
                    }
                    static expandSections(viewer) {
                        const renderer = viewer.getTreeRenderer();
                        if (renderer instanceof GridTreeViewerRenderer) {
                            for (const root of viewer.getContentProvider().getRoots(viewer.getInput())) {
                                if (renderer.isSection(root)) {
                                    viewer.setExpanded(root, true);
                                }
                            }
                        }
                        viewer.repaint();
                    }
                    setPaintItemShadow(paintShadow) {
                        this._paintItemShadow = paintShadow;
                        this.getViewer().setCellSize(64, true);
                        return this;
                    }
                    isPaintItemShadow() {
                        return this._paintItemShadow;
                    }
                    setSectionCriteria(sectionCriteria) {
                        this._isSectionCriteria = sectionCriteria;
                        return this;
                    }
                    getSectionCriteria() {
                        return this._isSectionCriteria;
                    }
                    setShadowChildCriteria(shadowChildCriteria) {
                        this._isShadowChildCriteria = shadowChildCriteria;
                        return this;
                    }
                    getShadowChildCriteria() {
                        return this._isShadowChildCriteria;
                    }
                    isSection(obj) {
                        return this._isSectionCriteria ? this._isSectionCriteria(obj) : false;
                    }
                    isFlat() {
                        return this._flat;
                    }
                    paint(fullPaint) {
                        const result = super.paint(fullPaint);
                        result.contentHeight += 10;
                        return result;
                    }
                    paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y) {
                        const viewer = this.getViewer();
                        let cellSize = viewer.getCellSize();
                        if (this._flat) {
                            const limit = 64;
                            if (cellSize < limit) {
                                cellSize = limit;
                                viewer.setCellSize(cellSize);
                            }
                        }
                        else {
                            if (cellSize <= 48) {
                                return super.paintItems(objects, treeIconList, paintItems, parentPaintItem, x, y);
                            }
                        }
                        const b = viewer.getBounds();
                        const offset = this._center ?
                            Math.floor(b.width % (viewer.getCellSize() + viewers.TREE_RENDERER_GRID_PADDING) / 2)
                            : (this._isSectionCriteria === undefined ? viewers.TREE_RENDERER_GRID_PADDING : viewers.TREE_RENDERER_GRID_PADDING * 3);
                        this._contentHeight = Number.MIN_SAFE_INTEGER;
                        this.paintGrid(objects, treeIconList, paintItems, null, x + offset, y + viewers.TREE_RENDERER_GRID_PADDING, offset, 0, undefined, undefined);
                    }
                    paintGrid(objects, treeIconList, paintItems, parentPaintItem, x, y, offset, depth, sectionStart, sectionEnd) {
                        const theme = controls.Controls.getTheme();
                        const hasSections = this._isSectionCriteria !== undefined;
                        const viewer = this.getViewer();
                        const labelProvider = viewer.getLabelProvider();
                        const cellSize = Math.max(controls.ROW_HEIGHT, viewer.getCellSize());
                        const ctx = viewer.getContext();
                        const b = viewer.getBounds();
                        const included = objects.filter(obj => viewer.isFilterIncluded(obj));
                        const lastObj = included.length === 0 ? null : included[included.length - 1];
                        for (const obj of objects) {
                            const children = viewer.getContentProvider().getChildren(obj);
                            const expanded = viewer.isExpanded(obj);
                            const isSection = this.isSection(obj);
                            const canPaintChildren = isSection || !this._flat;
                            let newParentPaintItem = null;
                            if (viewer.isFilterIncluded(obj)) {
                                if (isSection) {
                                    // drawing section
                                    if (children.length > 0) {
                                        if (paintItems.length > 0) {
                                            if (x > offset) {
                                                if (hasSections) {
                                                    y += cellSize + viewers.TREE_RENDERER_GRID_PADDING * 3; // add new line
                                                }
                                            }
                                            else {
                                                y += viewers.TREE_RENDERER_GRID_PADDING * 2; // add new line
                                            }
                                        }
                                        y += 20; // a text is rendered using the base, from bottom to top.
                                        const rectY = y - 18;
                                        const rectHeight = 25;
                                        let isItemVisible = false;
                                        // paint only if needed
                                        if (y > -cellSize && rectY <= b.height) {
                                            const label = labelProvider.getLabel(obj);
                                            if (expanded) {
                                                this.drawPanelTop(ctx, 5, rectY, b.width - 10, rectHeight);
                                            }
                                            else {
                                                this.drawPanelCollapsed(ctx, 5, rectY, b.width - 10, rectHeight);
                                            }
                                            if (children.length > 0) {
                                                const iconY = rectY + rectHeight / 2 - controls.RENDER_ICON_SIZE / 2 + 1;
                                                const iconInfo = this.paintIcon(ctx, obj, 5, iconY, expanded, treeIconList);
                                                iconInfo.rect.set(0, rectY, b.width, rectHeight);
                                            }
                                            ctx.save();
                                            ctx.fillStyle = theme.viewerForeground + "aa";
                                            ctx.fillText(label, viewers.TREE_RENDERER_GRID_PADDING * 2 + 16, y);
                                            ctx.restore();
                                            isItemVisible = true;
                                        }
                                        sectionStart = rectY + rectHeight;
                                        sectionEnd = sectionStart;
                                        const item = new viewers.PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);
                                        item.set(0, rectY, b.width, rectHeight);
                                        this._itemIndex++;
                                        paintItems.push(item);
                                        newParentPaintItem = item;
                                        if (expanded) {
                                            y += viewers.TREE_RENDERER_GRID_PADDING * 3;
                                        }
                                        else {
                                            // no idea why!
                                            y += 2;
                                        }
                                        x = offset;
                                    }
                                    this._contentHeight = Math.max(this._contentHeight, y);
                                    // end drawing section
                                }
                                else {
                                    const renderer = viewer.getCellRendererProvider().getCellRenderer(obj);
                                    const args = new viewers.RenderCellArgs(ctx, x, y, cellSize, cellSize, obj, viewer, true);
                                    let isItemVisible = false;
                                    if (y > -cellSize && y < b.height) {
                                        // render section row
                                        if (y + cellSize > sectionEnd) {
                                            const bottom = y + cellSize + viewers.TREE_RENDERER_GRID_PADDING * 2;
                                            ctx.save();
                                            // ctx.fillRect(5, sectionEnd, b.width - 10, bottom - sectionEnd);
                                            this.drawPanelRow(ctx, 5, sectionEnd, b.width - 10, bottom - sectionEnd);
                                            ctx.restore();
                                            sectionEnd = bottom;
                                        }
                                        isItemVisible = true;
                                        this.renderGridCell(args, renderer, depth, obj === lastObj);
                                        // render tree icon
                                        if (children.length > 0 && canPaintChildren) {
                                            const iconY = y + (cellSize - viewers.TREE_ICON_SIZE) / 2;
                                            this.paintIcon(ctx, obj, x - 5, iconY, expanded, treeIconList);
                                        }
                                    }
                                    if (isItemVisible || this._fullPaint) {
                                        const item = new viewers.PaintItem(this._itemIndex, obj, parentPaintItem, isItemVisible);
                                        item.set(args.x, args.y, args.w, args.h);
                                        paintItems.push(item);
                                        newParentPaintItem = item;
                                    }
                                    this._itemIndex++;
                                    this._contentHeight = Math.max(this._contentHeight, args.y + args.h);
                                    x += cellSize + viewers.TREE_RENDERER_GRID_PADDING;
                                    const areaWidth = b.width - (hasSections ? viewers.TREE_RENDERER_GRID_PADDING * 3 : viewers.TREE_RENDERER_GRID_PADDING);
                                    if (x + cellSize > areaWidth) {
                                        y += cellSize + viewers.TREE_RENDERER_GRID_PADDING;
                                        x = offset;
                                    }
                                }
                            }
                            if (expanded && canPaintChildren) {
                                const result = this.paintGrid(children, treeIconList, paintItems, newParentPaintItem, x, y, offset, depth + 1, sectionStart, sectionEnd);
                                y = result.y;
                                x = result.x;
                                this._contentHeight = Math.max(this._contentHeight, y);
                                if (sectionEnd !== result.sectionEnd && depth === 0) {
                                    this.drawPanelBottom(ctx, 5, result.sectionEnd, b.width - 10);
                                }
                                sectionStart = result.sectionStart;
                                sectionEnd = result.sectionEnd;
                            }
                        }
                        return {
                            x,
                            y,
                            sectionStart,
                            sectionEnd
                        };
                    }
                    paintIcon(ctx, obj, x, y, expanded, treeIconList) {
                        const viewer = this.getViewer();
                        const isSection = this.isSection(obj);
                        const themeIcon = colibri.ColibriPlugin.getInstance().getIcon(expanded ?
                            (isSection ? colibri.ICON_CONTROL_SECTION_COLLAPSE : colibri.ICON_CONTROL_TREE_COLLAPSE_LEFT)
                            : (isSection ? colibri.ICON_CONTROL_SECTION_EXPAND : colibri.ICON_CONTROL_TREE_EXPAND_LEFT));
                        let icon = themeIcon;
                        if (!isSection && viewer.isSelected(obj)) {
                            icon = themeIcon.getNegativeThemeImage();
                        }
                        ctx.save();
                        let iconX;
                        if (isSection) {
                            iconX = x + 5;
                        }
                        else {
                            const cellSize = this.getViewer().getCellSize();
                            iconX = x + cellSize - controls.RENDER_ICON_SIZE + 5;
                        }
                        icon.paint(ctx, iconX, y, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, false);
                        ctx.restore();
                        const iconInfo = {
                            rect: new controls.Rect(iconX, y, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE),
                            obj: obj
                        };
                        treeIconList.push(iconInfo);
                        return iconInfo;
                    }
                    renderGridCell(args, renderer, depth, isLastChild) {
                        const cellSize = args.viewer.getCellSize();
                        const b = args.viewer.getBounds();
                        const lineHeight = 20;
                        const x = args.x;
                        const ctx = args.canvasContext;
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
                            this.prepareContextForText(args);
                            const labelProvider = args.viewer.getLabelProvider();
                            const styledLabelProvider = args.viewer.getStyledLabelProvider();
                            const label = labelProvider.getLabel(args.obj);
                            const trimLabel = this.trimLabel(ctx, label, args.w - 10);
                            const x2 = Math.max(x, x + args.w / 2 - trimLabel.textWidth / 2);
                            const y2 = args.y + args.h - 5;
                            if (styledLabelProvider && !selected) {
                                this.renderStyledLabel(args, x2, y2, styledLabelProvider, trimLabel.text.length);
                            }
                            else {
                                ctx.fillText(trimLabel.text, x2, y2);
                            }
                            ctx.restore();
                            if (args.viewer.isHighlightMatches() && args.viewer.getFilterText().length > 0) {
                                this.renderMatchHighlight(args, x2, y2, label);
                            }
                        }
                    }
                    trimLabel(ctx, label, maxWidth) {
                        let text = "";
                        let textWidth = 0;
                        for (const c of label) {
                            const test = text + c;
                            textWidth = controls.Controls.measureTextWidth(ctx, test);
                            if (textWidth > maxWidth) {
                                if (text.length > 2) {
                                    text = text.substring(0, text.length - 2) + "..";
                                }
                                break;
                            }
                            else {
                                text += c;
                            }
                        }
                        return {
                            text,
                            textWidth
                        };
                    }
                    renderCellBack(args, selected, isLastChild) {
                        const theme = controls.Controls.getTheme();
                        // originally was (0, 0, 0, 0.2)
                        const shadowColor = theme.dark ? DARK_SHADOW_COLOR : LIGHT_SHADOW_COLOR;
                        const childShadowColor = theme.dark ? DARK_CHILD_SHADOW_COLOR : LIGHT_CHILD_SHADOW_COLOR;
                        const childShadowBorderColor = theme.dark ? DARK_CHILD_SHADOW_BORDER_COLOR : LIGHT_CHILD_SHADOW_BORDER_COLOR;
                        if (selected) {
                            const ctx = args.canvasContext;
                            ctx.save();
                            ctx.fillStyle = controls.Controls.getTheme().viewerSelectionBackground + "88";
                            controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h);
                            ctx.restore();
                        }
                        if (this._paintItemShadow) {
                            const shadowAsChild = this._isShadowChildCriteria && this._isShadowChildCriteria(args.obj);
                            const expanded = args.viewer.isExpanded(args.obj);
                            if (shadowAsChild) {
                                const margin = controls.viewers.TREE_RENDERER_GRID_PADDING;
                                const ctx = args.canvasContext;
                                ctx.save();
                                ctx.fillStyle = childShadowColor;
                                ctx.strokeStyle = childShadowBorderColor;
                                if (isLastChild) {
                                    controls.Controls.drawRoundedRect(ctx, args.x - margin, args.y, args.w + margin, args.h, false, 0, 5, 5, 0);
                                }
                                else {
                                    ctx.beginPath();
                                    ctx.moveTo(args.x + args.w, args.y + 2);
                                    ctx.lineTo(args.x + args.w, args.y + args.h - 4);
                                    ctx.stroke();
                                    controls.Controls.drawRoundedRect(ctx, args.x - margin, args.y, args.w + margin, args.h, false, 0, 0, 0, 0);
                                }
                                ctx.restore();
                            }
                            else /*if (!this.isFlat()) */ {
                                const ctx = args.canvasContext;
                                ctx.save();
                                ctx.fillStyle = shadowColor;
                                // ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
                                if (expanded) {
                                    controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, false, 5, 0, 0, 5);
                                }
                                else {
                                    controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h, false, 5, 5, 5, 5);
                                }
                                ctx.restore();
                            }
                        }
                    }
                    renderCellFront(args, selected, isLastChild) {
                        if (selected) {
                            const ctx = args.canvasContext;
                            ctx.save();
                            ctx.fillStyle = controls.Controls.getTheme().viewerSelectionBackground + "44";
                            // ctx.fillRect(args.x, args.y, args.w, args.h);
                            controls.Controls.drawRoundedRect(ctx, args.x, args.y, args.w, args.h);
                            ctx.restore();
                        }
                    }
                    drawPanelBottom(ctx, x, y, w) {
                        y = Math.floor(y);
                        ctx.save();
                        ctx.fillStyle = controls.Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
                        ctx.strokeStyle = controls.Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;
                        ctx.clearRect(x - 5, y - 5, w + 10, 10);
                        ctx.beginPath();
                        ctx.moveTo(x + w, y - 5);
                        ctx.quadraticCurveTo(x + w, y, x + w - 5, y);
                        ctx.lineTo(x + 5, y);
                        ctx.quadraticCurveTo(x, y, x, y - 5);
                        ctx.closePath();
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(x + w, y - 5);
                        ctx.quadraticCurveTo(x + w, y, x + w - 5, y);
                        ctx.lineTo(x + 5, y);
                        ctx.quadraticCurveTo(x, y, x, y - 5);
                        ctx.stroke();
                        ctx.restore();
                    }
                    drawPanelTop(ctx, x, y, w, h) {
                        y = Math.floor(y);
                        const topLeft = 5;
                        const topRight = 5;
                        const bottomRight = 0;
                        const bottomLeft = 0;
                        ctx.save();
                        ctx.fillStyle = controls.Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
                        ctx.strokeStyle = controls.Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;
                        // stroke
                        ctx.beginPath();
                        ctx.moveTo(x + topLeft, y);
                        ctx.lineTo(x + w - topRight, y);
                        ctx.quadraticCurveTo(x + w, y, x + w, y + topRight);
                        ctx.lineTo(x + w, y + h - bottomRight);
                        ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h);
                        ctx.moveTo(x + bottomLeft, y + h);
                        ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft);
                        ctx.lineTo(x, y + topLeft);
                        ctx.quadraticCurveTo(x, y, x + topLeft, y);
                        ctx.stroke();
                        // fill
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
                        ctx.fill();
                        ctx.restore();
                    }
                    drawPanelRow(ctx, x, y, w, h) {
                        y = Math.floor(y);
                        ctx.save();
                        ctx.fillStyle = controls.Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
                        ctx.strokeStyle = controls.Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;
                        ctx.fillRect(x, y, w, h);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + h);
                        ctx.moveTo(x + w, y);
                        ctx.lineTo(x + w, y + h);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.restore();
                    }
                    drawPanelCollapsed(ctx, x, y, w, h) {
                        y = Math.floor(y);
                        const c = viewers.TREE_RENDERER_GRID_PADDING;
                        ctx.save();
                        ctx.fillStyle = controls.Controls.getTheme().dark ? DARK_FILL_COLOR : LIGHT_FILL_COLOR;
                        ctx.strokeStyle = controls.Controls.getTheme().dark ? DARK_BORDER_COLOR : LIGHT_BORDER_COLOR;
                        // this.drawPrevBottomPanel(ctx, x, y, w);
                        ctx.beginPath();
                        ctx.moveTo(x + c, y);
                        ctx.lineTo(x + w - c, y);
                        ctx.quadraticCurveTo(x + w, y, x + w, y + c);
                        ctx.lineTo(x + w, y + h - c);
                        ctx.quadraticCurveTo(x + w, y + h, x + w - c, y + h);
                        ctx.lineTo(x + c, y + h);
                        ctx.quadraticCurveTo(x, y + h, x, y + h - c);
                        ctx.lineTo(x, y + c);
                        ctx.quadraticCurveTo(x, y, x + c, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        ctx.restore();
                    }
                }
                viewers.GridTreeViewerRenderer = GridTreeViewerRenderer;
            })(viewers = controls.viewers || (controls.viewers = {}));
        })(controls = ui.controls || (ui.controls = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="../Controls.ts" />
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
                    _icon;
                    constructor(icon) {
                        this._icon = icon;
                    }
                    getIcon(obj) {
                        return this._icon;
                    }
                    renderCell(args) {
                        let icon = this.getIcon(args.obj);
                        if (icon) {
                            const x = args.x + (args.w - controls.RENDER_ICON_SIZE) / 2;
                            const y = args.y + (args.h - controls.RENDER_ICON_SIZE) / 2;
                            const selected = args.viewer.isSelected(args.obj);
                            if (selected) {
                                if (icon instanceof controls.IconImage) {
                                    icon = icon.getNegativeThemeImage();
                                }
                            }
                            icon.paint(args.canvasContext, x, y, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, false);
                        }
                        else {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
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
                    _icon;
                    constructor(icon) {
                        this._icon = icon;
                    }
                    renderCell(args) {
                        let icon = this._icon;
                        if (icon) {
                            const x2 = (args.w - controls.RENDER_ICON_SIZE) / 2;
                            const y2 = (args.h - controls.RENDER_ICON_SIZE) / 2;
                            const selected = args.viewer.isSelected(args.obj);
                            if (selected) {
                                if (icon instanceof controls.IconImage) {
                                    icon = icon.getNegativeThemeImage();
                                }
                            }
                            icon.paint(args.canvasContext, args.x + x2, args.y + y2, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, false);
                        }
                        else {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
                        }
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
                class ImageFromCellRenderer {
                    _renderer;
                    _obj;
                    _width;
                    _height;
                    _dummyViewer;
                    constructor(obj, renderer, width, height) {
                        this._obj = obj;
                        this._renderer = renderer;
                        this._width = width;
                        this._height = height;
                        this._dummyViewer = new viewers.TreeViewer("");
                    }
                    paint(context, x, y, w, h, center) {
                        this._renderer.renderCell(new viewers.RenderCellArgs(context, 0, 0, this._width, this._height, this._obj, this._dummyViewer, true));
                    }
                    paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH) {
                        // nothing
                    }
                    preload() {
                        return this._renderer.preload(new viewers.PreloadCellArgs(this._obj, this._dummyViewer));
                    }
                    getWidth() {
                        return this._width;
                    }
                    getHeight() {
                        return this._height;
                    }
                    async preloadSize() {
                        return controls.PreloadResult.NOTHING_LOADED;
                    }
                }
                viewers.ImageFromCellRenderer = ImageFromCellRenderer;
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
                class LabelProviderFromStyledLabelProvider {
                    _styledLabelProvider;
                    constructor(styledLabelProvider) {
                        this._styledLabelProvider = styledLabelProvider;
                    }
                    getLabel(obj) {
                        const theme = controls.Controls.getTheme();
                        return this._styledLabelProvider.getStyledTexts(obj, theme.dark).map(elem => elem.text).join("");
                    }
                }
                viewers.LabelProviderFromStyledLabelProvider = LabelProviderFromStyledLabelProvider;
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
                class MultiWordSearchEngine {
                    _words;
                    prepare(pattern) {
                        this._words = pattern.split(" ").map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
                    }
                    matches(text) {
                        if (this._words.length === 0) {
                            return {
                                matches: false
                            };
                        }
                        const input = text.toLowerCase();
                        let i = 0;
                        let start;
                        let end;
                        for (const world of this._words) {
                            const k = input.indexOf(world, i);
                            if (k >= 0) {
                                if (start === undefined) {
                                    start = k;
                                }
                                end = k + world.length;
                                i = end + 1;
                            }
                            else {
                                return { matches: false };
                            }
                        }
                        return {
                            start,
                            end,
                            matches: true,
                            measureMatch: text.substring(start, end),
                            measureStart: text.substring(0, start)
                        };
                    }
                }
                viewers.MultiWordSearchEngine = MultiWordSearchEngine;
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
                class OneCharCellRenderer {
                    _iconSize;
                    constructor(iconSize) {
                        this._iconSize = iconSize;
                    }
                    renderCell(args) {
                        const label = args.viewer.getLabelProvider().getLabel(args.obj);
                        const ctx = args.canvasContext;
                        let char = label.trim();
                        if (label.length > 0) {
                            char = label[0];
                            ctx.fillText(char, args.x + args.w / 2, args.y + args.h / 2, args.w);
                        }
                    }
                    cellHeight(args) {
                        return this._iconSize ? controls.ROW_HEIGHT : args.viewer.getCellSize();
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.OneCharCellRenderer = OneCharCellRenderer;
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
                    index;
                    data;
                    parent;
                    visible;
                    constructor(index, data, parent = null, visible) {
                        super();
                        this.index = index;
                        this.data = data;
                        this.parent = parent;
                        this.visible = visible;
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
                    obj;
                    viewer;
                    constructor(obj, viewer) {
                        this.obj = obj;
                        this.viewer = viewer;
                    }
                    clone() {
                        return new PreloadCellArgs(this.obj, this.viewer);
                    }
                }
                viewers.PreloadCellArgs = PreloadCellArgs;
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
                    canvasContext;
                    x;
                    y;
                    w;
                    h;
                    obj;
                    viewer;
                    center;
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
                class SingleWordSearchEngine {
                    _pattern;
                    prepare(pattern) {
                        this._pattern = pattern.toLowerCase();
                    }
                    matches(text) {
                        if (this._pattern.length === 0) {
                            return {
                                matches: false
                            };
                        }
                        const index = text.toLowerCase().indexOf(this._pattern);
                        if (index >= 0) {
                            return {
                                start: index,
                                end: index + this._pattern.length,
                                matches: true,
                                measureMatch: text.substring(index, index + this._pattern.length),
                                measureStart: text.substring(0, index)
                            };
                        }
                        return {
                            matches: false
                        };
                    }
                }
                viewers.SingleWordSearchEngine = SingleWordSearchEngine;
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
            class EditorFactory {
            }
            ide.EditorFactory = EditorFactory;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
/// <reference path="./EditorFactory.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            var io = colibri.core.io;
            class ContentTypeEditorFactory extends ide.EditorFactory {
                _name;
                _contentTypeSet;
                _newEditor;
                constructor(name, contentType, newEditor) {
                    super();
                    this._name = name;
                    this._contentTypeSet = new Set(Array.isArray(contentType) ? contentType : [contentType]);
                    this._newEditor = newEditor;
                }
                getName() {
                    return this._name;
                }
                acceptInput(input) {
                    if (input instanceof io.FilePath) {
                        const contentType = colibri.Platform.getWorkbench()
                            .getContentTypeRegistry().getCachedContentType(input);
                        return this._contentTypeSet.has(contentType);
                    }
                    return false;
                }
                createEditor() {
                    return this._newEditor(this);
                }
            }
            ide.ContentTypeEditorFactory = ContentTypeEditorFactory;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class ContentTypeIconExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.ide.ContentTypeIconExtension";
                _config;
                static withPluginIcons(plugin, config) {
                    return new ContentTypeIconExtension(config.map(item => {
                        return {
                            iconDescriptor: (item.plugin || plugin).getIconDescriptor(item.iconName),
                            contentType: item.contentType
                        };
                    }));
                }
                constructor(config) {
                    super(ContentTypeIconExtension.POINT_ID, 10);
                    this._config = config;
                }
                getConfig() {
                    return this._config;
                }
            }
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
            class Part extends ui.controls.Control {
                eventPartTitleChanged = new ui.controls.ListenerList();
                _id;
                _title;
                _selection;
                _partCreated;
                _icon;
                _folder;
                _undoManager;
                _restoreState;
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
                    this.eventPartTitleChanged.fire(this);
                }
                getIcon() {
                    return this._icon;
                }
                getId() {
                    return this._id;
                }
                setSelection(selection, notify = true) {
                    this._selection = selection;
                    if (notify) {
                        this.dispatchSelectionChanged();
                    }
                }
                getSelection() {
                    return this._selection;
                }
                dispatchSelectionChanged() {
                    this.eventSelectionChanged.fire(this._selection);
                }
                getPropertyProvider() {
                    return null;
                }
                layout() {
                    // nothing
                }
                onWindowFocus() {
                    // nothing
                }
                onPartAdded() {
                    // nothing
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
                    // nothing
                }
                onPartDeactivated() {
                    // nothing
                }
                saveState(state) {
                    // nothing
                }
                restoreState(state) {
                    // nothing
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
                eventDirtyStateChanged = new ui.controls.ListenerList();
                _input;
                _dirty;
                _readOnly;
                _embeddedMode;
                _editorFactory;
                constructor(id, factory) {
                    super(id);
                    this.addClass("EditorPart");
                    this._dirty = false;
                    this._embeddedMode = false;
                    this._editorFactory = factory;
                }
                setReadOnly(readOnly) {
                    this._readOnly = readOnly;
                    if (this.isInEditorArea()) {
                        const folder = this.getPartFolder();
                        const label = folder.getLabelFromContent(this);
                        folder.setTabReadOnly(label, this._readOnly);
                    }
                }
                isReadOnly() {
                    return this._readOnly;
                }
                getEditorFactory() {
                    return this._editorFactory;
                }
                isEmbeddedMode() {
                    return this._embeddedMode;
                }
                isInEditorArea() {
                    return !this.isEmbeddedMode();
                }
                setEmbeddedMode(embeddedMode) {
                    this._embeddedMode = embeddedMode;
                }
                setDirty(dirty) {
                    this._dirty = dirty;
                    if (this.isInEditorArea()) {
                        const folder = this.getPartFolder();
                        const label = folder.getLabelFromContent(this);
                        const iconClose = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE);
                        const iconDirty = dirty ? colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_DIRTY) : iconClose;
                        folder.setTabCloseIcons(label, iconDirty, iconClose);
                    }
                    this.eventDirtyStateChanged.fire(this._dirty);
                }
                isDirty() {
                    return this._dirty;
                }
                async save() {
                    if (this.isReadOnly()) {
                        alert("Cannot save, the editor is in read-only mode.'");
                        return;
                    }
                    await this.doSave();
                }
                async doSave() {
                    // nothing
                }
                onPartClosed() {
                    const ext = colibri.Platform.getWorkbench().getEditorInputExtension(this.getInput());
                    if (this.isInEditorArea()) {
                        if (ext) {
                            const id = ext.getEditorInputId(this.getInput());
                            const state = {};
                            this.saveState(state);
                            colibri.Platform.getWorkbench().getEditorSessionStateRegistry().set(id, state);
                        }
                    }
                    if (this.isDirty()) {
                        return confirm("This editor is not saved, do you want to close it?");
                    }
                    return true;
                }
                onPartAdded() {
                    if (this.isInEditorArea()) {
                        const ext = colibri.Platform.getWorkbench().getEditorInputExtension(this.getInput());
                        const stateReg = colibri.Platform.getWorkbench().getEditorSessionStateRegistry();
                        if (ext) {
                            const id = ext.getEditorInputId(this.getInput());
                            const state = stateReg.get(id);
                            if (state) {
                                this.setRestoreState(state);
                            }
                            stateReg.delete(id);
                        }
                    }
                }
                getInput() {
                    return this._input;
                }
                setInput(input) {
                    this._input = input;
                }
                getEditorViewerProvider(key) {
                    const extensions = colibri.Platform.getExtensionRegistry()
                        .getExtensions(ide.EditorViewerProviderExtension.POINT_ID);
                    for (const ext of extensions) {
                        const provider = ext.getEditorViewerProvider(this, key);
                        if (provider) {
                            return provider;
                        }
                    }
                    return null;
                }
                createEditorToolbar(parent) {
                    return null;
                }
                getEmbeddedEditorState() {
                    return null;
                }
                restoreEmbeddedEditorState(state) {
                    // nothing
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
                    this.eventControlLayout.addListener(() => {
                        const content = this.getSelectedTabContent();
                        if (content) {
                            content.layout();
                        }
                    });
                    this.eventTabClosed.addListener((part) => {
                        if (part.onPartClosed()) {
                            if (this.getContentList().length === 1) {
                                ide.Workbench.getWorkbench().setActivePart(null);
                                if (this instanceof ide.EditorArea) {
                                    ide.Workbench.getWorkbench().setActiveEditor(null);
                                }
                            }
                        }
                        else {
                            return ui.controls.CANCEL_EVENT;
                        }
                    });
                    this.eventTabSelected.addListener((part) => {
                        ide.Workbench.getWorkbench().setActivePart(part);
                        part.onPartShown();
                    });
                    this.eventTabLabelResized.addListener(() => {
                        for (const part of this.getParts()) {
                            part.dispatchTitleUpdatedEvent();
                        }
                    });
                }
                addPart(part, closeable = false, selectIt = true) {
                    part.eventPartTitleChanged.addListener(() => {
                        const icon = part.getIcon();
                        if (icon) {
                            icon.preload().then(() => {
                                this.setTabTitle(part, part.getTitle(), icon);
                            });
                        }
                        else {
                            this.setTabTitle(part, part.getTitle(), null);
                        }
                    });
                    this.addTab(part.getTitle(), part.getIcon(), part, closeable, selectIt);
                    part.setPartFolder(this);
                    part.onPartAdded();
                    // we do this here because the icon can be computed with the input.
                    part.dispatchTitleUpdatedEvent();
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
                _tabsToBeClosed;
                constructor() {
                    super("EditorArea");
                    this.setTabIconSize(ui.controls.RENDER_ICON_SIZE * 3);
                }
                activateEditor(editor) {
                    super.selectTabWithContent(editor);
                }
                getEditors() {
                    return super.getParts();
                }
                getSelectedEditor() {
                    return this.getSelectedTabContent();
                }
                fillTabMenu(menu, labelElement) {
                    if (this.isSelectedLabel(labelElement)) {
                        const editor = this.getSelectedEditor();
                        if (editor.isDirty()) {
                            menu.addCommand(colibri.ui.ide.actions.CMD_SAVE);
                            menu.addSeparator();
                        }
                    }
                    menu.add(new ui.controls.Action({
                        commandId: ide.actions.CMD_EDITOR_CLOSE,
                        text: "Close",
                        callback: () => {
                            this.closeTabLabel(labelElement);
                        }
                    }));
                    menu.add(new ui.controls.Action({
                        text: "Close Others",
                        callback: () => {
                            const selectedEditor = ui.controls.TabPane.getContentFromLabel(labelElement);
                            if (!selectedEditor) {
                                return;
                            }
                            const editors = this.getEditors();
                            for (const editor of editors) {
                                if (editor !== selectedEditor) {
                                    this.closeTab(editor);
                                }
                            }
                        }
                    }));
                    menu.add(new ui.controls.Action({
                        text: "Close to the Left",
                        callback: () => {
                            const editor = ui.controls.TabPane.getContentFromLabel(labelElement);
                            if (!editor) {
                                return;
                            }
                            const editors = this.getEditors();
                            const index = this.getEditors().indexOf(editor);
                            for (let i = 0; i < index; i++) {
                                this.closeTab(editors[i]);
                            }
                        }
                    }));
                    menu.add(new ui.controls.Action({
                        text: "Close to the Right",
                        callback: () => {
                            const editor = ui.controls.TabPane.getContentFromLabel(labelElement);
                            if (!editor) {
                                return;
                            }
                            const editors = this.getEditors();
                            const index = this.getEditors().indexOf(editor);
                            for (let i = index + 1; i < editors.length; i++) {
                                this.closeTab(editors[i]);
                            }
                        }
                    }));
                    menu.add(new ui.controls.Action({
                        text: "Close Saved",
                        callback: () => {
                            for (const editor of this.getEditors()) {
                                if (!editor.isDirty()) {
                                    this.closeTab(editor);
                                }
                            }
                        }
                    }));
                    menu.addCommand(ide.actions.CMD_EDITOR_CLOSE_ALL, {
                        text: "Close All"
                    });
                    menu.addSeparator();
                    menu.addCommand(ide.actions.CMD_EDITOR_TABS_SIZE_UP);
                    menu.addCommand(ide.actions.CMD_EDITOR_TABS_SIZE_DOWN);
                }
                closeAllEditors() {
                    this.closeEditors(this.getEditors());
                }
                closeEditors(editors) {
                    this._tabsToBeClosed = new Set(editors.map(editor => this.getLabelFromContent(editor)));
                    for (const editor of editors) {
                        this.closeTab(editor);
                    }
                    this._tabsToBeClosed = null;
                    if (this.getEditors().length === 0) {
                        colibri.Platform.getWorkbench().setActiveEditor(null);
                    }
                }
                selectTab(label) {
                    if (this._tabsToBeClosed) {
                        if (this._tabsToBeClosed.has(label)) {
                            return;
                        }
                    }
                    super.selectTab(label);
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
                static POINT_ID = "colibri.ui.ide.EditorExtension";
                _factories;
                constructor(factories) {
                    super(EditorExtension.POINT_ID);
                    this._factories = factories;
                }
                getFactories() {
                    return this._factories;
                }
            }
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
            class EditorInputExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.ide.EditorInputExtension";
                _id;
                constructor(id) {
                    super(EditorInputExtension.POINT_ID);
                    this._id = id;
                }
                getId() {
                    return this._id;
                }
            }
            ide.EditorInputExtension = EditorInputExtension;
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
                _factories;
                _defaultFactory;
                constructor() {
                    this._factories = [];
                }
                registerDefaultFactory(defaultFactory) {
                    this._defaultFactory = defaultFactory;
                }
                registerFactory(factory) {
                    this._factories.push(factory);
                }
                getFactoryForInput(input) {
                    for (const factory of this._factories) {
                        if (factory.acceptInput(input)) {
                            return factory;
                        }
                    }
                    return this._defaultFactory;
                }
                getFactories() {
                    return this._factories;
                }
                getFactoryByName(name) {
                    return this._factories.find(f => f.getName() === name);
                }
                getDefaultFactory() {
                    return this._defaultFactory;
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
                _viewer;
                _initialSelection;
                _selectedTabSection;
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
                        if (reveal) {
                            this._viewer.reveal(...selection);
                        }
                    }
                    else {
                        this._initialSelection = selection;
                    }
                }
                getSelection() {
                    return this._viewer.getSelection();
                }
                onViewerSelectionChanged(selection) {
                    // nothing
                }
                onViewerDoubleClick(selection) {
                    // nothing
                }
                repaint(resetScroll = false) {
                    if (this._viewer) {
                        const state = this._viewer.getState();
                        this.prepareViewerState(state);
                        this._viewer.setState(state);
                        if (resetScroll) {
                            this._viewer.setScrollY(0);
                        }
                        else {
                            this._viewer.repaint();
                        }
                    }
                }
                prepareViewerState(state) {
                    // nothing
                }
                getStyledLabelProvider() {
                    return undefined;
                }
                getTabSections() {
                    return [];
                }
                tabSectionChanged(section) {
                    this._selectedTabSection = section;
                    this.repaint(true);
                }
                getSelectedTabSection() {
                    return this._selectedTabSection;
                }
                allowsTabSections() {
                    return false;
                }
                fillContextMenu(menu) {
                    // nothing
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
            class EditorViewerProviderExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.ide.EditorViewerProviderExtension";
            }
            ide.EditorViewerProviderExtension = EditorViewerProviderExtension;
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
                _filteredViewer;
                _viewer;
                _showZoomControls;
                constructor(id, showZoomControls = true) {
                    super(id);
                    this._showZoomControls = showZoomControls;
                }
                createPart() {
                    this._viewer = this.createViewer();
                    this.addClass("ViewerPart");
                    this._filteredViewer = new ui.controls.viewers.FilteredViewer(this._viewer, this._showZoomControls);
                    this.add(this._filteredViewer);
                    this._viewer.eventSelectionChanged.addListener(sel => {
                        this.setSelection(sel);
                    });
                    const view = this;
                    // this._viewer.getElement().addEventListener("contextmenu", e => this.onMenu(e));
                    this._filteredViewer.setMenuProvider(new (class {
                        fillMenu(viewer, menu) {
                            view.fillContextMenu(menu);
                            const viewerMenu = new ui.controls.Menu("Viewer");
                            new ui.controls.viewers.DefaultViewerMenuProvider().fillMenu(viewer, viewerMenu);
                            menu.addSeparator();
                            menu.addMenu(viewerMenu);
                        }
                    })());
                }
                fillContextMenu(menu) {
                    // nothing
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
                _currentEditor;
                _currentViewerProvider;
                _viewerStateMap;
                _tabSectionListener;
                constructor(id) {
                    super(id);
                    this._viewerStateMap = new Map();
                    this._tabSectionListener = section => {
                        this.onTabSectionSelected(section);
                    };
                }
                createViewer() {
                    const viewer = new viewers.TreeViewer(this.getId() + ".EditorViewerView");
                    viewer.eventSelectionChanged.addListener(() => {
                        if (this._currentViewerProvider) {
                            this._currentViewerProvider.onViewerSelectionChanged(this._viewer.getSelection());
                        }
                    });
                    viewer.eventOpenItem.addListener(() => {
                        this._currentViewerProvider.onViewerDoubleClick(this._viewer.getSelection());
                    });
                    return viewer;
                }
                createPart() {
                    super.createPart();
                    ide.Workbench.getWorkbench().eventEditorActivated.addListener(() => this.onWorkbenchEditorActivated());
                }
                fillContextMenu(menu) {
                    if (this._currentViewerProvider) {
                        this._currentViewerProvider.fillContextMenu(menu);
                    }
                }
                async onWorkbenchEditorActivated() {
                    if (this._currentEditor !== null) {
                        const state = this._viewer.getState();
                        this._viewerStateMap.set(this._currentEditor, state);
                    }
                    const editor = ide.Workbench.getWorkbench().getActiveEditor();
                    if (editor && editor.isEmbeddedMode()) {
                        // we don't want an embedded editor to be connected with the editor viewers.
                        return;
                    }
                    let provider = null;
                    if (editor) {
                        if (editor === this._currentEditor) {
                            provider = this._currentViewerProvider;
                        }
                        else {
                            provider = this.getViewerProvider(editor);
                        }
                    }
                    const tabsPane = this.getPartFolder();
                    const tabLabel = tabsPane.getLabelFromContent(this);
                    tabsPane.eventTabSectionSelected.removeListener(this._tabSectionListener);
                    tabsPane.removeAllSections(tabLabel);
                    if (provider) {
                        await provider.preload();
                        this._viewer.setTreeRenderer(provider.getTreeViewerRenderer(this._viewer));
                        this._viewer.setStyledLabelProvider(provider.getStyledLabelProvider());
                        this._viewer.setLabelProvider(provider.getLabelProvider());
                        this._viewer.setCellRendererProvider(provider.getCellRendererProvider());
                        this._viewer.setContentProvider(provider.getContentProvider());
                        this._viewer.setInput(provider.getInput());
                        provider.setViewer(this._viewer);
                        const state = this._viewerStateMap.get(editor);
                        if (state) {
                            provider.prepareViewerState(state);
                            this._viewer.setState(state);
                            this._filteredViewer.filterText(state.filterText);
                        }
                        else {
                            this._filteredViewer.filterText("");
                            const treeRenderer = this._viewer.getTreeRenderer();
                            if (treeRenderer instanceof viewers.GridTreeViewerRenderer) {
                                const roots = this.getViewer().getContentProvider().getRoots(this._viewer.getInput());
                                const expanded = roots.filter(r => treeRenderer.isSection(r));
                                for (const obj of expanded) {
                                    this._viewer.setExpanded(obj, true);
                                }
                            }
                        }
                        if (provider.allowsTabSections()) {
                            for (const section of provider.getTabSections()) {
                                tabsPane.addTabSection(tabLabel, section, this.getId());
                            }
                            tabsPane.selectTabSection(tabLabel, provider.getSelectedTabSection());
                        }
                    }
                    else {
                        this._viewer.setInput(null);
                        this._viewer.setContentProvider(new ui.controls.viewers.EmptyTreeContentProvider());
                    }
                    this._currentViewerProvider = provider;
                    this._currentEditor = editor;
                    this._viewer.repaint();
                    if (provider && provider.allowsTabSections()) {
                        tabsPane.eventTabSectionSelected.addListener(this._tabSectionListener);
                    }
                }
                onTabSectionSelected(section) {
                    if (this._currentViewerProvider) {
                        this._currentViewerProvider.tabSectionChanged(section);
                    }
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
                _onFileStorageListener;
                _savingThisEditor;
                constructor(id, factory) {
                    super(id, factory);
                    this._onFileStorageListener = change => {
                        this.onFileStorageChanged(change);
                    };
                    ide.Workbench.getWorkbench().getFileStorage().addChangeListener(this._onFileStorageListener);
                }
                async save() {
                    this._savingThisEditor = true;
                    await super.save();
                }
                onFileStorageChanged(change) {
                    const editorFile = this.getInput();
                    const editorFileFullName = editorFile.getFullName();
                    if (change.isDeleted(editorFileFullName)) {
                        // this.getPartFolder().closeTab(this);
                    }
                    else if (change.isModified(editorFileFullName)) {
                        if (this._savingThisEditor) {
                            this._savingThisEditor = false;
                        }
                        else {
                            this.getUndoManager().clear();
                            this.onEditorInputContentChangedByExternalEditor();
                        }
                    }
                    else if (change.wasRenamed(editorFileFullName)) {
                        this.setTitle(editorFile.getName());
                        this.onEditorFileNameChanged();
                    }
                }
                onEditorFileNameChanged() {
                    // nothing
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
                        return ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE);
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
    var core;
    (function (core) {
        var io;
        (function (io) {
            io.FilePath.prototype.getEditorInputExtension = () => colibri.ui.ide.FileEditorInputExtension.ID;
        })(io = core.io || (core.io = {}));
    })(core = colibri.core || (colibri.core = {}));
})(colibri || (colibri = {}));
/// <reference path="./EditorInputExtension.ts" />
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class FileEditorInputExtension extends ide.EditorInputExtension {
                static ID = "colibri.ui.ide.FileEditorInputExtension";
                constructor() {
                    super(FileEditorInputExtension.ID);
                }
                getEditorInputState(input) {
                    return {
                        filePath: input.getFullName()
                    };
                }
                createEditorInput(state) {
                    return colibri.ui.ide.FileUtils.getFileFromPath(state.filePath);
                }
                getEditorInputId(input) {
                    return input.getFullName();
                }
            }
            ide.FileEditorInputExtension = FileEditorInputExtension;
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
                _file;
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
                static visit(folder, visitor) {
                    visitor(folder);
                    for (const file of folder.getFiles()) {
                        this.visit(file, visitor);
                    }
                }
                static visitProject(visitor) {
                    this.visit(this.getRoot(), visitor);
                }
                static getFileNameWithoutExtension(filename) {
                    const i = filename.lastIndexOf(".");
                    return filename.substring(0, i);
                }
                static getFileCopyName(file) {
                    const parent = file.getParent();
                    let name = file.getNameWithoutExtension();
                    while (parent.getFile(name + ".scene")) {
                        name = name + "_copy";
                    }
                    return name + ".scene";
                }
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
                static getFileBinary(file) {
                    return ide.Workbench.getWorkbench().getFileBinaryCache().getContent(file);
                }
                static getFileString(file) {
                    return ide.Workbench.getWorkbench().getFileStringCache().getContent(file);
                }
                static setFileString_async(file, content) {
                    return ide.Workbench.getWorkbench().getFileStringCache().setContent(file, content);
                }
                static getFileStringCache() {
                    return ide.Workbench.getWorkbench().getFileStringCache();
                }
                static getFileStorage() {
                    return ide.Workbench.getWorkbench().getFileStorage();
                }
                static async createFile_async(folder, fileName, content) {
                    let file = folder.getFile(fileName);
                    if (file) {
                        await this.setFileString_async(file, content);
                        await colibri.Platform.getWorkbench().getContentTypeRegistry().preload(file);
                        return file;
                    }
                    const storage = this.getFileStorage();
                    file = await storage.createFile(folder, fileName, content);
                    await colibri.Platform.getWorkbench().getContentTypeRegistry().preload(file);
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
                static async copyFile_async(fromFile, toFile) {
                    const storage = ide.Workbench.getWorkbench().getFileStorage();
                    return await storage.copyFile(fromFile, toFile);
                }
                static async preloadFileString(file) {
                    const cache = ide.Workbench.getWorkbench().getFileStringCache();
                    return cache.preload(file);
                }
                static async preloadFileBinary(file) {
                    const cache = ide.Workbench.getWorkbench().getFileBinaryCache();
                    return cache.preload(file);
                }
                static getPublicRoot(folder) {
                    if (folder.getFile("publicroot") || folder.isRoot()) {
                        return folder;
                    }
                    return this.getPublicRoot(folder.getParent());
                }
                static getFileFromPath(path, parent) {
                    let result = parent;
                    const names = path.split("/");
                    if (!result) {
                        result = ide.Workbench.getWorkbench().getProjectRoot();
                        const name = names.shift();
                        if (name !== result.getName()) {
                            return null;
                        }
                    }
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
                static distinct(folders) {
                    return this.sorted([...new Set(folders)]);
                }
                static compareFiles(a, b) {
                    const aa = a.getFullName().split("/").length;
                    const bb = b.getFullName().split("/").length;
                    if (aa === bb) {
                        return a.getName().localeCompare(b.getName());
                    }
                    return aa - bb;
                }
                static sorted(folders) {
                    return folders.sort((a, b) => this.compareFiles(a, b));
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
            class IconAtlasLoaderExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.ide.IconAtlasLoaderExtension";
                _plugin;
                constructor(plugin) {
                    super(IconAtlasLoaderExtension.POINT_ID);
                    this._plugin = plugin;
                }
                async preload() {
                    await this._plugin.preloadAtlasIcons();
                }
            }
            ide.IconAtlasLoaderExtension = IconAtlasLoaderExtension;
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
                static POINT_ID = "colibri.ui.ide.IconLoaderExtension";
                static withPluginFiles(plugin, iconNames, common = false) {
                    const icons = iconNames.map(name => plugin.getIcon(name, common));
                    return new IconLoaderExtension(icons);
                }
                _icons;
                constructor(icons) {
                    super(IconLoaderExtension.POINT_ID);
                    this._icons = icons;
                }
                getIcons() {
                    return this._icons;
                }
            }
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
                _leftArea;
                _centerArea;
                _rightArea;
                _currentManager;
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
                    ide.Workbench.getWorkbench().eventEditorActivated.addListener(() => this.handleEditorActivated());
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
                handleEditorActivated() {
                    const editor = ide.Workbench.getWorkbench().getActiveEditor();
                    if (editor && editor.isEmbeddedMode()) {
                        return;
                    }
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
            class PluginResourceLoaderExtension extends colibri.Extension {
                static POINT_ID = "colibri.ui.ide.PluginResourceLoaderExtension";
                _loader;
                constructor(loader) {
                    super(PluginResourceLoaderExtension.POINT_ID);
                    this._loader = loader;
                }
                async preload() {
                    if (this._loader) {
                        await this._loader();
                    }
                }
            }
            ide.PluginResourceLoaderExtension = PluginResourceLoaderExtension;
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
                static POINT_ID = "colibri.ui.ide.PreloadProjectResourcesExtension";
                constructor() {
                    super(PreloadProjectResourcesExtension.POINT_ID);
                }
            }
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
            class DialogEditorArea extends ui.controls.Control {
                constructor() {
                    super("div", "DialogClientArea");
                }
                layout() {
                    this.layoutChildren();
                    this.dispatchLayoutEvent();
                }
            }
            class QuickEditorDialog extends ui.controls.dialogs.Dialog {
                _file;
                _editor;
                _saveButton;
                _editorState;
                constructor(file, editorState) {
                    super("QuickEditorDialog");
                    this._file = file;
                    this._editorState = editorState;
                    this.setSize(1100, 800, true);
                }
                goFront() {
                    this.layout();
                }
                createDialogArea() {
                    this._editor = colibri.Platform.getWorkbench().makeEditor(this._file);
                    this._editor.setEmbeddedMode(true);
                    this._editor.onPartShown();
                    const editorArea = new DialogEditorArea();
                    editorArea.add(this._editor);
                    this.add(editorArea);
                    setTimeout(() => {
                        editorArea.layout();
                        this._editor.restoreEmbeddedEditorState(this._editorState);
                        this._editorState = null;
                    }, 1);
                    this._editor.onPartActivated();
                }
                processKeyCommands() {
                    return true;
                }
                create() {
                    super.create();
                    this.setTitle(this._file.getName());
                    this.addButton("Close", () => {
                        this.close();
                    });
                    this._saveButton = this.addButton("Save", () => {
                        this._editor.save();
                    });
                    this._saveButton.disabled = true;
                    this._editor.eventDirtyStateChanged.addListener(dirty => {
                        this._saveButton.disabled = !dirty;
                    });
                }
                close() {
                    this._editorState = this._editor.getEmbeddedEditorState();
                    if (this._editor.onPartClosed()) {
                        super.close();
                    }
                }
                getEditorState() {
                    return this._editorState;
                }
                getEditor() {
                    return this._editor;
                }
            }
            ide.QuickEditorDialog = QuickEditorDialog;
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide) {
            class Resources {
                _plugin;
                _res;
                constructor(plugin) {
                    this._plugin = plugin;
                }
                async preload() {
                    this._res = await this._plugin.getJSON("res.json");
                }
                getResString(key) {
                    return this.getResData(key);
                }
                getResData(key) {
                    return this._res[key];
                }
            }
            ide.Resources = Resources;
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
                _filteredViewer;
                _viewer;
                constructor(id, editorFactory) {
                    super(id, editorFactory);
                }
                createPart() {
                    this._viewer = this.createViewer();
                    this.addClass("ViewerPart");
                    this._filteredViewer = this.createFilteredViewer(this._viewer);
                    this.add(this._filteredViewer);
                    this._filteredViewer.setMenuProvider(new ui.controls.viewers.DefaultViewerMenuProvider((viewer, menu) => {
                        this.fillContextMenu(menu);
                    }));
                    this._viewer.eventSelectionChanged.addListener(sel => {
                        this.setSelection(sel);
                    });
                }
                createFilteredViewer(viewer) {
                    return new ui.controls.viewers.FilteredViewer(viewer, true);
                }
                fillContextMenu(menu) {
                    // nothing
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
                static POINT_ID = "colibri.ui.ide.WindowExtension";
                _createWindowFunc;
                constructor(createWindowFunc) {
                    super(WindowExtension.POINT_ID, 10);
                    this._createWindowFunc = createWindowFunc;
                }
                createWindow() {
                    return this._createWindowFunc();
                }
            }
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
            class WorkbenchWindow extends ui.controls.Control {
                _toolbar;
                _clientArea;
                _id;
                _created;
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
                    let activeEditorIndex = 0;
                    {
                        const activeEditor = editorArea.getSelectedTabContent();
                        activeEditorIndex = Math.max(0, editors.indexOf(activeEditor));
                    }
                    const restoreEditorData = {
                        inputDataList: [],
                        activeEditorIndex: activeEditorIndex,
                        tabIconSize: editorArea.getTabIconSize()
                    };
                    for (const editor of editors) {
                        const input = editor.getInput();
                        const inputExtension = colibri.Platform.getWorkbench().getEditorInputExtension(input);
                        const editorState = {};
                        editor.saveState(editorState);
                        restoreEditorData.inputDataList.push({
                            inputExtensionId: inputExtension.getId(),
                            inputState: inputExtension.getEditorInputState(input),
                            editorState: editorState,
                            editorFactory: editor.getEditorFactory().getName()
                        });
                    }
                    prefs.setValue("restoreEditorState", restoreEditorData);
                }
                restoreEditors(prefs) {
                    const editorArea = this.getEditorArea();
                    const restoreEditorData = prefs.getValue("restoreEditorState");
                    if (restoreEditorData) {
                        if (restoreEditorData.tabIconSize) {
                            editorArea.setTabIconSize(restoreEditorData.tabIconSize);
                        }
                        let lastEditor = null;
                        const wb = colibri.Platform.getWorkbench();
                        for (const inputData of restoreEditorData.inputDataList) {
                            const inputState = inputData.inputState;
                            if (!inputState) {
                                continue;
                            }
                            const inputExtension = colibri.Platform.getWorkbench()
                                .getEditorInputExtensionWithId(inputData.inputExtensionId);
                            const input = inputExtension.createEditorInput(inputState);
                            if (input) {
                                const factory = wb.getEditorRegistry().getFactoryByName(inputData.editorFactory);
                                const editor = wb.createEditor(input, factory);
                                if (!editor) {
                                    continue;
                                }
                                lastEditor = editor;
                                const editorState = inputData.editorState;
                                try {
                                    editor.setRestoreState(editorState);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                        }
                        let activeEditor = editorArea.getEditors()[restoreEditorData.activeEditorIndex];
                        if (!activeEditor) {
                            activeEditor = lastEditor;
                        }
                        if (activeEditor) {
                            editorArea.activateEditor(activeEditor);
                            wb.setActivePart(activeEditor);
                        }
                    }
                    if (editorArea.getEditors().length === 0) {
                        this.openFromUrlSearchParameter();
                    }
                }
                openFromUrlSearchParameter() {
                    const params = new URLSearchParams(window.location.search);
                    const filePath = params.get("openfile");
                    if (!filePath) {
                        return;
                    }
                    const root = ide.FileUtils.getRoot().getName();
                    console.log(`Workbench: opening editor for "${filePath}"`);
                    const file = ide.FileUtils.getFileFromPath(`${root}/${filePath}`);
                    if (file) {
                        colibri.Platform.getWorkbench().openEditor(file);
                    }
                    else {
                        console.log("Workbench: file not found.");
                    }
                }
                onStorageChanged(e) {
                    const editorArea = this.getEditorArea();
                    const editorsToRemove = [];
                    for (const editor of editorArea.getEditors()) {
                        if (editor instanceof ide.FileEditor) {
                            const file = editor.getInput();
                            if (file) {
                                if (e.isDeleted(file.getFullName())) {
                                    try {
                                        editorsToRemove.push(editor);
                                    }
                                    catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                        }
                    }
                    if (editorsToRemove.length > 0) {
                        editorArea.closeEditors(editorsToRemove);
                    }
                }
                create() {
                    if (this._created) {
                        return;
                    }
                    this._created = true;
                    window.addEventListener("resize", () => this.layout());
                    colibri.Platform.getWorkbench().eventThemeChanged.addListener(() => this.layout());
                    if (colibri.CAPABILITY_FILE_STORAGE) {
                        ide.FileUtils.getFileStorage().addChangeListener(e => {
                            this.onStorageChanged(e);
                        });
                    }
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
                    _control;
                    _shift;
                    _alt;
                    _key;
                    _filterInputElements;
                    constructor(config) {
                        this._control = config.control === undefined ? false : config.control;
                        this._shift = config.shift === undefined ? false : config.shift;
                        this._alt = config.alt === undefined ? false : config.alt;
                        this._key = config.key === undefined ? "" : config.key;
                        this._filterInputElements = config.filterInputElements === undefined ? true : config.filterInputElements;
                    }
                    getKeyString() {
                        const keys = [];
                        if (this._control) {
                            keys.push("Ctrl");
                        }
                        if (this._shift) {
                            keys.push("Shift");
                        }
                        if (this._alt) {
                            keys.push("Alt");
                        }
                        if (this._key) {
                            keys.push(this.clearKeyCode(this._key));
                        }
                        return keys.join("+");
                    }
                    clearKeyCode(keyCode) {
                        return keyCode.replace("Key", "").replace("Digit", "").replace("Arrow", "");
                    }
                    matchesKeys(event) {
                        return (event.ctrlKey || event.metaKey) === this._control
                            && event.shiftKey === this._shift
                            && event.altKey === this._alt
                            && (event.key.toLowerCase() === this._key.toLowerCase() || event.code === this._key);
                    }
                    matchesTarget(element) {
                        if (this._filterInputElements) {
                            return !(element instanceof HTMLInputElement) && !(element instanceof HTMLTextAreaElement);
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
                actions.CAT_GENERAL = "colibri.ui.ide.actions.GeneralCategory";
                actions.CAT_EDIT = "colibri.ui.ide.actions.EditCategory";
                actions.CMD_SAVE = "colibri.ui.ide.actions.Save";
                actions.CMD_SAVE_ALL = "colibri.ui.ide.actions.SaveAll";
                actions.CMD_EDITOR_TABS_SIZE_UP = "colibri.ui.ide.actions.EditorTabsSizeUp";
                actions.CMD_EDITOR_TABS_SIZE_DOWN = "colibri.ui.ide.actions.EditorTabsSizeDown";
                actions.CMD_EDITOR_CLOSE = "colibri.ui.ide.actions.EditorClose";
                actions.CMD_EDITOR_CLOSE_ALL = "colibri.ui.ide.actions.EditorCloseAll";
                actions.CMD_DELETE = "colibri.ui.ide.actions.Delete";
                actions.CMD_RENAME = "colibri.ui.ide.actions.Rename";
                actions.CMD_UNDO = "colibri.ui.ide.actions.Undo";
                actions.CMD_REDO = "colibri.ui.ide.actions.Redo";
                actions.CMD_COLLAPSE_ALL = "colibri.ui.ide.actions.CollapseAll";
                actions.CMD_EXPAND_COLLAPSE_BRANCH = "colibri.ui.ide.actions.ExpandCollapseBranch";
                actions.CMD_SELECT_ALL = "colibri.ui.ide.actions.SelectAll";
                actions.CMD_ESCAPE = "colibri.ui.ide.actions.Escape";
                actions.CMD_UPDATE_CURRENT_EDITOR = "colibri.ui.ide.actions.UpdateCurrentEditor";
                actions.CMD_SHOW_COMMAND_PALETTE = "colibri.ui.ide.actions.ShowCommandPalette";
                actions.CMD_COPY = "colibri.ui.ide.actions.Copy";
                actions.CMD_CUT = "colibri.ui.ide.actions.Cut";
                actions.CMD_PASTE = "colibri.ui.ide.actions.Paste";
                actions.CMD_SHOW_COMMENT_DIALOG = "colibri.ui.ide.actions.ShowCommentDialog";
                actions.CMD_CHANGE_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
                actions.CMD_INCR_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.IncrementCanvasFontHeight";
                actions.CMD_DECR_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.DecrementCanvasFontHeight";
                actions.CMD_RESET_CANVAS_FONT_HEIGHT = "phasereditor2d.ide.ui.actions.ResetCanvasFontHeight";
                function isViewerScope(args) {
                    return getViewer(args) !== null;
                }
                function getViewer(args) {
                    if (args.activeElement) {
                        let control = ui.controls.Control.getParentControl(args.activeElement);
                        if (control instanceof ui.controls.viewers.FilterControl) {
                            control = control.getFilteredViewer().getViewer();
                        }
                        if (control && control instanceof ui.controls.viewers.Viewer) {
                            return control;
                        }
                    }
                    return null;
                }
                class ColibriCommands {
                    static registerCommands(manager) {
                        manager.addCategory({
                            id: actions.CAT_GENERAL,
                            name: "General"
                        });
                        manager.addCategory({
                            id: actions.CAT_EDIT,
                            name: "Edit"
                        });
                        ColibriCommands.initEditors(manager);
                        ColibriCommands.initEdit(manager);
                        ColibriCommands.initUndo(manager);
                        ColibriCommands.initViewer(manager);
                        ColibriCommands.initPalette(manager);
                        ColibriCommands.initCommentDialog(manager);
                        ColibriCommands.initTheme(manager);
                        ColibriCommands.initFontSize(manager);
                    }
                    static initFontSize(manager) {
                        manager.add({
                            command: {
                                id: actions.CMD_INCR_CANVAS_FONT_HEIGHT,
                                category: actions.CAT_GENERAL,
                                name: "Increment Viewer Font Size",
                                tooltip: "Increments the font size of viewers"
                            },
                            handler: {
                                executeFunc: args => {
                                    ui.controls.incrementFontHeight(1);
                                }
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_DECR_CANVAS_FONT_HEIGHT,
                                category: actions.CAT_GENERAL,
                                name: "Decrement Viewer Font Size",
                                tooltip: "Decrement the font size of viewers"
                            },
                            handler: {
                                executeFunc: args => {
                                    ui.controls.incrementFontHeight(-1);
                                }
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_RESET_CANVAS_FONT_HEIGHT,
                                category: actions.CAT_GENERAL,
                                name: "Reset Viewer Font Size",
                                tooltip: "Reset the font size of viewers"
                            },
                            handler: {
                                executeFunc: args => {
                                    ui.controls.resetFontHeight();
                                }
                            }
                        });
                    }
                    static initTheme(manager) {
                        // theme dialog
                        manager.add({
                            command: {
                                id: actions.CMD_CHANGE_THEME,
                                name: "Select Color Theme",
                                tooltip: "Select the color theme of the IDE.",
                                category: actions.CAT_GENERAL
                            },
                            handler: {
                                executeFunc: args => {
                                    const dlg = new ui.controls.dialogs.ThemesDialog();
                                    dlg.create();
                                    dlg.getViewer().setSelection([ui.controls.Controls.getTheme()]);
                                    dlg.getViewer().eventSelectionChanged.addListener(() => {
                                        const theme = dlg.getViewer().getSelectionFirstElement();
                                        if (theme) {
                                            ui.controls.Controls.setTheme(theme);
                                        }
                                    });
                                },
                                testFunc: args => !(args.activeDialog instanceof ui.controls.dialogs.ThemesDialog)
                            },
                            keys: {
                                control: true,
                                key: "Digit2",
                                keyLabel: "2",
                                filterInputElements: false
                            }
                        });
                    }
                    static initCommentDialog(manager) {
                        manager.add({
                            command: {
                                id: actions.CMD_SHOW_COMMENT_DIALOG,
                                name: "Open Comment Dialog",
                                category: actions.CAT_GENERAL,
                                tooltip: "Open a comment dialog to write texts in presentations or screen-recording videos."
                            },
                            handler: {
                                executeFunc: () => {
                                    const dlg = new ui.controls.dialogs.CommentDialog();
                                    dlg.create();
                                }
                            },
                            keys: {
                                control: true,
                                alt: true,
                                key: "Space"
                            }
                        });
                    }
                    static initPalette(manager) {
                        manager.add({
                            command: {
                                id: actions.CMD_SHOW_COMMAND_PALETTE,
                                name: "Command Palette",
                                tooltip: "Show a dialog with the list of commands active in that context.",
                                category: actions.CAT_GENERAL
                            },
                            handler: {
                                executeFunc: args => {
                                    const dlg = new ui.controls.dialogs.CommandDialog();
                                    dlg.create();
                                }
                            },
                            keys: {
                                control: true,
                                key: "KeyK"
                            }
                        });
                    }
                    static initEditors(manager) {
                        // editor tabs size
                        manager.addCommandHelper({
                            id: actions.CMD_EDITOR_TABS_SIZE_DOWN,
                            name: "Decrement Tab Size",
                            tooltip: "Make bigger the editor tabs.",
                            category: actions.CAT_GENERAL
                        });
                        manager.addCommandHelper({
                            id: actions.CMD_EDITOR_TABS_SIZE_UP,
                            name: "Increment Tab Size",
                            tooltip: "Make smaller the editor tabs.",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_EDITOR_TABS_SIZE_DOWN, e => true, args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(-5));
                        manager.addHandlerHelper(actions.CMD_EDITOR_TABS_SIZE_UP, e => true, args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(5));
                        manager.addKeyBinding(actions.CMD_EDITOR_TABS_SIZE_DOWN, new ide.commands.KeyMatcher({
                            control: true,
                            key: "Digit3",
                            keyLabel: "3",
                        }));
                        manager.addKeyBinding(actions.CMD_EDITOR_TABS_SIZE_UP, new ide.commands.KeyMatcher({
                            control: true,
                            key: "Digit4",
                            keyLabel: "4",
                        }));
                        // close editor
                        manager.addCommandHelper({
                            id: actions.CMD_EDITOR_CLOSE,
                            name: "Close Editor",
                            tooltip: "Close active editor.",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_EDITOR_CLOSE, args => typeof args.activeEditor === "object", args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().closeTab(args.activeEditor));
                        manager.addKeyBinding(actions.CMD_EDITOR_CLOSE, new KeyMatcher({
                            control: true,
                            key: "KeyQ"
                        }));
                        // close all editors
                        manager.addCommandHelper({
                            id: actions.CMD_EDITOR_CLOSE_ALL,
                            name: "Close All Editors",
                            tooltip: "Close all editors.",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_EDITOR_CLOSE_ALL, args => true, args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().closeAllEditors());
                        manager.addKeyBinding(actions.CMD_EDITOR_CLOSE_ALL, new KeyMatcher({
                            control: true,
                            shift: true,
                            key: "KeyQ"
                        }));
                    }
                    static initViewer(manager) {
                        // collapse all
                        manager.add({
                            command: {
                                id: actions.CMD_COLLAPSE_ALL,
                                name: "Collapse All",
                                tooltip: "Collapse all elements",
                                category: actions.CAT_GENERAL
                            },
                            handler: {
                                testFunc: isViewerScope,
                                executeFunc: args => {
                                    const viewer = getViewer(args);
                                    viewer.collapseAll();
                                    viewer.repaint();
                                }
                            },
                            keys: {
                                key: "KeyC"
                            }
                        });
                        // select all
                        manager.addCommandHelper({
                            id: actions.CMD_SELECT_ALL,
                            name: "Select All",
                            tooltip: "Select all elements",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_SELECT_ALL, isViewerScope, args => {
                            const viewer = getViewer(args);
                            viewer.selectAll();
                            viewer.repaint();
                        });
                        manager.addKeyBinding(actions.CMD_SELECT_ALL, new KeyMatcher({
                            control: true,
                            key: "KeyA"
                        }));
                        // collapse expand branch
                        manager.add({
                            command: {
                                id: actions.CMD_EXPAND_COLLAPSE_BRANCH,
                                name: "Expand/Collapse Branch",
                                tooltip: "Expand or collapse a branch of the select element",
                                category: actions.CAT_GENERAL
                            },
                            handler: {
                                testFunc: isViewerScope,
                                executeFunc: args => {
                                    const viewer = getViewer(args);
                                    viewer.expandCollapseBranch();
                                }
                            },
                            keys: {
                                key: "Space"
                            }
                        });
                        // escape
                        manager.addCommandHelper({
                            id: actions.CMD_ESCAPE,
                            name: "Escape",
                            tooltip: "Escape",
                            category: actions.CAT_GENERAL
                        });
                        manager.addKeyBinding(actions.CMD_ESCAPE, new KeyMatcher({
                            key: "Escape"
                        }));
                        // clear viewer selection
                        manager.addHandlerHelper(actions.CMD_ESCAPE, isViewerScope, args => {
                            const viewer = getViewer(args);
                            viewer.escape();
                        });
                        // escape menu
                        manager.addHandlerHelper(actions.CMD_ESCAPE, args => args.activeMenu !== null && args.activeMenu !== undefined, args => args.activeMenu.closeAll());
                    }
                    static initUndo(manager) {
                        // undo
                        manager.addCommandHelper({
                            id: actions.CMD_UNDO,
                            name: "Undo",
                            tooltip: "Undo operation",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_UNDO, args => args.activePart !== null, args => args.activePart.getUndoManager().undo());
                        manager.addKeyBinding(actions.CMD_UNDO, new KeyMatcher({
                            control: true,
                            key: "KeyZ"
                        }));
                        // redo
                        manager.addCommandHelper({
                            id: actions.CMD_REDO,
                            name: "Redo",
                            tooltip: "Redo operation",
                            category: actions.CAT_GENERAL
                        });
                        manager.addHandlerHelper(actions.CMD_REDO, args => args.activePart !== null, args => args.activePart.getUndoManager().redo());
                        manager.addKeyBinding(actions.CMD_REDO, new KeyMatcher({
                            control: true,
                            shift: true,
                            key: "KeyZ"
                        }));
                        // update current editor
                        manager.addCommandHelper({
                            id: actions.CMD_UPDATE_CURRENT_EDITOR,
                            name: "Update Current Editor",
                            tooltip: "Refresh the current editor's content.",
                            category: actions.CAT_EDIT
                        });
                    }
                    static initEdit(manager) {
                        // save
                        manager.add({
                            command: {
                                id: actions.CMD_SAVE,
                                name: "Save",
                                tooltip: "Save",
                                category: actions.CAT_EDIT
                            },
                            handler: {
                                testFunc: args => {
                                    return args.activeEditor ? true : false;
                                },
                                executeFunc: args => {
                                    if (args.activeEditor.isDirty()) {
                                        args.activeEditor.save();
                                    }
                                }
                            },
                            keys: {
                                control: true,
                                key: "KeyS",
                                filterInputElements: false
                            }
                        });
                        // save all
                        manager.add({
                            command: {
                                id: actions.CMD_SAVE_ALL,
                                name: "Save All",
                                tooltip: "Save all editors",
                                category: actions.CAT_EDIT
                            },
                            handler: {
                                testFunc: args => {
                                    const editors = colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().getEditors();
                                    return editors.some(e => e.isDirty() && !e.isReadOnly());
                                },
                                executeFunc: args => {
                                    colibri.Platform.getWorkbench().saveAllEditors();
                                }
                            }
                        });
                        // delete
                        manager.addCommandHelper({
                            id: actions.CMD_DELETE,
                            name: "Delete",
                            tooltip: "Delete",
                            category: actions.CAT_EDIT
                        });
                        manager.addKeyBinding(actions.CMD_DELETE, new KeyMatcher({
                            key: "Delete"
                        }));
                        manager.addKeyBinding(actions.CMD_DELETE, new KeyMatcher({
                            key: "Backspace"
                        }));
                        // rename
                        manager.addCommandHelper({
                            id: actions.CMD_RENAME,
                            name: "Rename",
                            tooltip: "Rename",
                            category: actions.CAT_EDIT
                        });
                        manager.addKeyBinding(actions.CMD_RENAME, new KeyMatcher({
                            key: "F2"
                        }));
                        // copy/cut/paste
                        manager.add({
                            command: {
                                id: actions.CMD_COPY,
                                name: "Copy",
                                tooltip: "Copy selected objects.",
                                category: actions.CAT_EDIT
                            },
                            keys: {
                                control: true,
                                key: "KeyC"
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_CUT,
                                name: "Cut",
                                tooltip: "Cut selected objects.",
                                category: actions.CAT_EDIT
                            },
                            keys: {
                                control: true,
                                key: "KeyX"
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_PASTE,
                                name: "Paste",
                                tooltip: "Paste clipboard content.",
                                category: actions.CAT_EDIT
                            },
                            keys: {
                                control: true,
                                key: "KeyV"
                            }
                        });
                    }
                }
                actions.ColibriCommands = ColibriCommands;
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
                    _part;
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
                    _id;
                    _name;
                    _tooltip;
                    _icon;
                    _categoryId;
                    constructor(config) {
                        this._id = config.id;
                        this._name = config.name;
                        this._tooltip = config.tooltip;
                        this._icon = config.icon ?? null;
                        this._categoryId = config.category;
                    }
                    getCategoryId() {
                        return this._categoryId;
                    }
                    getId() {
                        return this._id;
                    }
                    getName() {
                        return this._name;
                    }
                    getTooltip() {
                        return this._tooltip;
                    }
                    getIcon() {
                        return this._icon;
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
                class HandlerArgs {
                    activePart;
                    activeEditor;
                    activeElement;
                    activeMenu;
                    activeWindow;
                    activeDialog;
                    constructor(activePart, activeEditor, activeElement, activeMenu, activeWindow, activeDialog) {
                        this.activePart = activePart;
                        this.activeEditor = activeEditor;
                        this.activeElement = activeElement;
                        this.activeMenu = activeMenu;
                        this.activeWindow = activeWindow;
                        this.activeDialog = activeDialog;
                    }
                }
                commands.HandlerArgs = HandlerArgs;
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
                    static POINT_ID = "colibri.ui.ide.commands";
                    _configurer;
                    constructor(configurer) {
                        super(CommandExtension.POINT_ID);
                        this._configurer = configurer;
                    }
                    getConfigurer() {
                        return this._configurer;
                    }
                }
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
                    _testFunc;
                    _executeFunc;
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
            (function (commands_1) {
                class CommandManager {
                    _commandIdMap;
                    _commands;
                    _commandMatcherMap;
                    _commandHandlerMap;
                    _categoryMap;
                    _categories;
                    constructor() {
                        this._commands = [];
                        this._commandIdMap = new Map();
                        this._commandMatcherMap = new Map();
                        this._commandHandlerMap = new Map();
                        this._categoryMap = new Map();
                        this._categories = [];
                        window.addEventListener("keydown", e => { this.onKeyDown(e); });
                    }
                    printTable() {
                        let str = [
                            "Category",
                            "Command",
                            "Keys",
                            "Description"
                        ].join(",") + "\n";
                        for (const cat of this._categories) {
                            const catName = cat.name;
                            const commands = this._commands.filter(c => c.getCategoryId() === cat.id);
                            for (const cmd of commands) {
                                const keys = this.getCommandKeyString(cmd.getId());
                                str += [
                                    '"' + catName + '"',
                                    '"' + cmd.getName() + '"',
                                    '"``' + keys + '``"',
                                    '"' + cmd.getTooltip() + '"'
                                ].join(",") + "\n";
                            }
                        }
                        const elem = document.createElement("a");
                        elem.download = "phasereditor2d-commands-palette.csv";
                        elem.style.display = "none";
                        elem.href = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
                        document.body.appendChild(elem);
                        elem.click();
                        document.body.removeChild(elem);
                    }
                    onKeyDown(event) {
                        if (event.isComposing) {
                            return;
                        }
                        let executed = false;
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
                                executed = this.executeHandler(command, args, event);
                            }
                        }
                        if (!executed) {
                            this.preventKeyEvent(event);
                        }
                    }
                    preventKeyEvent(event) {
                        const code = [
                            event.metaKey || event.ctrlKey ? "ctrl" : "",
                            event.shiftKey ? "shift" : "",
                            event.altKey ? "alt" : "",
                            event.key.toLowerCase()
                        ].filter(s => s.length > 0).join(" ");
                        switch (code) {
                            case "ctrl s":
                            case "ctrl shift s":
                            case "ctrl w":
                            case "ctrl shift w":
                                event.preventDefault();
                                break;
                        }
                    }
                    canRunCommand(commandId) {
                        const args = this.makeArgs();
                        const command = this.getCommand(commandId);
                        if (command) {
                            const handlers = this._commandHandlerMap.get(command);
                            for (const handler of handlers) {
                                if (this.testHandler(handler, args)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    testHandler(handler, args) {
                        // const dlg = colibri.Platform.getWorkbench().getActiveDialog();
                        // if (dlg) {
                        //     if (!(dlg instanceof controls.dialogs.CommandDialog) && !dlg.processKeyCommands()) {
                        //         return false;
                        //     }
                        // }
                        return handler.test(args);
                    }
                    executeHandler(command, args, event, checkContext = true) {
                        const handlers = this._commandHandlerMap.get(command);
                        for (const handler of handlers) {
                            if (!checkContext || this.testHandler(handler, args)) {
                                if (event) {
                                    event.preventDefault();
                                }
                                const dlg = colibri.Platform.getWorkbench().getActiveDialog();
                                if (dlg instanceof ui.controls.dialogs.CommandDialog) {
                                    dlg.close();
                                }
                                handler.execute(args);
                                return true;
                            }
                        }
                        return false;
                    }
                    addCategory(category) {
                        this._categoryMap.set(category.id, category);
                        this._categories.push(category);
                    }
                    getCategories() {
                        return this._categories;
                    }
                    getCategory(id) {
                        return this._categoryMap.get(id);
                    }
                    addCommand(cmd) {
                        this._commands.push(cmd);
                        this._commandIdMap.set(cmd.getId(), cmd);
                        this._commandMatcherMap.set(cmd, []);
                        this._commandHandlerMap.set(cmd, []);
                    }
                    addCommandHelper(config) {
                        this.addCommand(new commands_1.Command(config));
                    }
                    makeArgs() {
                        const wb = ide.Workbench.getWorkbench();
                        const activeMenu = ui.controls.Menu.getActiveMenu();
                        let activeElement = wb.getActiveElement();
                        if (activeMenu) {
                            activeElement = activeMenu.getElement();
                        }
                        // do not consider the command palette dialog as active dialog,
                        // because we can execute any command there!
                        const activeDialog = wb.getActiveDialog() instanceof ui.controls.dialogs.CommandDialog
                            ? null : wb.getActiveDialog();
                        let activeEditor = wb.getActiveEditor();
                        if (activeDialog) {
                            if (activeDialog instanceof ide.QuickEditorDialog) {
                                activeEditor = activeDialog.getEditor();
                            }
                            else {
                                activeEditor = null;
                            }
                        }
                        return new commands_1.HandlerArgs(activeDialog ? null : wb.getActivePart(), activeEditor, activeElement, activeMenu, wb.getActiveWindow(), activeDialog);
                    }
                    getCommands() {
                        const list = [...this._commands];
                        list.sort((a, b) => {
                            return ((a.getCategoryId() || "") + a.getName())
                                .localeCompare((b.getCategoryId() || "") + b.getName());
                        });
                        return list;
                    }
                    getActiveCommands() {
                        return this.getCommands().filter(command => this.canRunCommand(command.getId()));
                    }
                    getCommand(id) {
                        const command = this._commandIdMap.get(id);
                        if (!command) {
                            console.error(`Command ${id} not found.`);
                        }
                        return command;
                    }
                    getCommandKeyString(commandId) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            const matchers = this._commandMatcherMap.get(command);
                            if (matchers && matchers.length > 0) {
                                const matcher = matchers[0];
                                return matcher.getKeyString();
                            }
                        }
                        return "";
                    }
                    executeCommand(commandId, checkContext = true) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            this.executeHandler(command, this.makeArgs(), null, checkContext);
                        }
                    }
                    addKeyBinding(commandId, matcher) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            this._commandMatcherMap.get(command).push(matcher);
                        }
                    }
                    addKeyBindingHelper(commandId, config) {
                        this.addKeyBinding(commandId, new commands_1.KeyMatcher(config));
                    }
                    addHandler(commandId, handler) {
                        const command = this.getCommand(commandId);
                        if (command) {
                            this._commandHandlerMap.get(command).push(handler);
                        }
                    }
                    addHandlerHelper(commandId, testFunc, executeFunc) {
                        this.addHandler(commandId, new commands_1.CommandHandler({
                            testFunc: testFunc,
                            executeFunc: executeFunc
                        }));
                    }
                    add(args, commandId) {
                        if (args.command) {
                            this.addCommandHelper(args.command);
                        }
                        const id = args.command ? args.command.id : commandId;
                        if (args.handler) {
                            this.addHandler(id, new commands_1.CommandHandler(args.handler));
                        }
                        if (args.keys) {
                            if (Array.isArray(args.keys)) {
                                for (const key of args.keys) {
                                    this.addKeyBinding(id, new commands_1.KeyMatcher(key));
                                }
                            }
                            else {
                                this.addKeyBinding(id, new commands_1.KeyMatcher(args.keys));
                            }
                        }
                    }
                }
                commands_1.CommandManager = CommandManager;
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
                class BaseImagePreviewSection extends ui.controls.properties.PropertySection {
                    static createSectionForm(parent, section, getImage) {
                        parent.classList.add("ImagePreviewFormArea");
                        const imgControl = new ui.controls.ImageControl(ide.IMG_SECTION_PADDING);
                        section.getPage().eventControlLayout.addListener(() => {
                            imgControl.resizeTo();
                        });
                        parent.appendChild(imgControl.getElement());
                        requestAnimationFrame(() => imgControl.resizeTo());
                        section.addUpdater(() => {
                            const img = getImage();
                            imgControl.setImage(img);
                            requestAnimationFrame(() => imgControl.resizeTo());
                        });
                    }
                    createForm(parent) {
                        BaseImagePreviewSection.createSectionForm(parent, this, () => this.getSelectedImage());
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                properties.BaseImagePreviewSection = BaseImagePreviewSection;
            })(properties = ide.properties || (ide.properties = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
var colibri;
(function (colibri) {
    var ui;
    (function (ui) {
        var ide;
        (function (ide_1) {
            var properties;
            (function (properties) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                class BaseManyImagePreviewSection extends controls.properties.PropertySection {
                    createForm(parent) {
                        parent.classList.add("ManyImagePreviewFormArea");
                        const viewer = new controls.viewers.TreeViewer("colibri.ui.ide.properties.ManyImagePreviewFormArea");
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setTreeRenderer(this.createTreeRenderer(viewer));
                        this.prepareViewer(viewer);
                        const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, true);
                        parent.appendChild(filteredViewer.getElement());
                        this.addUpdater(async () => {
                            // console.log("update " + this.getId());
                            const input = await this.getViewerInput();
                            // // clean the viewer first
                            // viewer.setInput([]);
                            // await viewer.repaint();
                            viewer.setInput(input || []);
                            filteredViewer.resizeTo();
                        });
                    }
                    createTreeRenderer(viewer) {
                        return new controls.viewers.GridTreeViewerRenderer(viewer, false, true).setPaintItemShadow(true);
                    }
                    canEditNumber(n) {
                        return n > 1;
                    }
                }
                properties.BaseManyImagePreviewSection = BaseManyImagePreviewSection;
            })(properties = ide_1.properties || (ide_1.properties = {}));
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
                    constructor(page, viewer, showZoomControls, ...classList) {
                        super(viewer, showZoomControls, ...classList);
                        this.setHandlePosition(false);
                        this.style.position = "relative";
                        this.style.height = "100%";
                        this.resizeTo();
                        setTimeout(() => this.resizeTo(), 10);
                        page.eventControlLayout.addListener(() => {
                            this.resizeTo();
                        });
                    }
                    resizeTo() {
                        requestAnimationFrame(() => {
                            const parent = this.getElement().parentElement;
                            if (parent) {
                                this.setBounds({
                                    width: parent.clientWidth,
                                    height: parent.clientHeight
                                });
                            }
                            this.getViewer().repaint();
                        });
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
                    static POINT_ID = "colibri.ui.ide.ThemeExtension";
                    _theme;
                    constructor(theme) {
                        super(ThemeExtension.POINT_ID);
                        this._theme = theme;
                    }
                    getTheme() {
                        return this._theme;
                    }
                }
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
                    async execute() {
                        // nothing by default
                    }
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
                    _undoList;
                    _redoList;
                    constructor() {
                        this._undoList = [];
                        this._redoList = [];
                    }
                    async add(op) {
                        this._undoList.push(op);
                        this._redoList = [];
                        await op.execute();
                    }
                    clear() {
                        this._undoList = [];
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
                    _getName;
                    _nameSet;
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
                    static trimNumbering(name) {
                        return name.replace(/[0-9 _-]+$/, "");
                    }
                    makeName(baseName) {
                        if (this._nameSet.has(baseName)) {
                            baseName = NameMaker.trimNumbering(baseName);
                            let name;
                            let i = 0;
                            do {
                                name = baseName + (i === 0 ? "" : "_" + i);
                                i++;
                            } while (this._nameSet.has(name));
                            this._nameSet.add(name);
                            return name;
                        }
                        return baseName;
                    }
                }
                utils.NameMaker = NameMaker;
            })(utils = ide.utils || (ide.utils = {}));
        })(ide = ui.ide || (ui.ide = {}));
    })(ui = colibri.ui || (colibri.ui = {}));
})(colibri || (colibri = {}));
