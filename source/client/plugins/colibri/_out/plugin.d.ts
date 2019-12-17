declare namespace colibri {
    abstract class Plugin {
        private _id;
        constructor(id: string);
        getId(): string;
        starting(): Promise<void>;
        started(): Promise<void>;
        registerExtensions(registry: ExtensionRegistry): void;
        getIcon(name: string): ui.controls.IImage;
    }
}
declare namespace colibri {
    class Platform {
        private static _plugins;
        private static _extensionRegistry;
        static addPlugin(plugin: colibri.Plugin): void;
        static getPlugins(): Plugin[];
        static getExtensionRegistry(): ExtensionRegistry;
        static getExtensions<T extends Extension>(point: string): T[];
        static addExtension(...extensions: Extension[]): void;
        static getWorkbench(): ui.ide.Workbench;
        static start(): Promise<void>;
    }
}
declare namespace colibri.ui.controls {
    const EVENT_CONTROL_LAYOUT = "controlLayout";
    class Control extends EventTarget {
        private _bounds;
        private _element;
        private _children;
        private _layout;
        private _container;
        private _scrollY;
        private _layoutChildren;
        private _handlePosition;
        constructor(tagName?: string, ...classList: string[]);
        static getControlOf(element: HTMLElement): Control;
        isHandlePosition(): boolean;
        setHandlePosition(_handlePosition: boolean): void;
        get style(): CSSStyleDeclaration;
        isLayoutChildren(): boolean;
        setLayoutChildren(layout: boolean): void;
        getScrollY(): number;
        setScrollY(scrollY: number): void;
        getContainer(): Control;
        getLayout(): ILayout;
        setLayout(layout: ILayout): void;
        addClass(...tokens: string[]): void;
        removeClass(...tokens: string[]): void;
        containsClass(className: string): boolean;
        getElement(): HTMLElement;
        getControlPosition(windowX: number, windowY: number): {
            x: number;
            y: number;
        };
        containsLocalPoint(x: number, y: number): boolean;
        setBounds(bounds: Bounds): void;
        setBoundsValues(x: number, y: number, w: number, h: number): void;
        getBounds(): Bounds;
        setLocation(x: number, y: number): void;
        layout(): void;
        dispatchLayoutEvent(): void;
        add(control: Control): void;
        protected onControlAdded(): void;
        getChildren(): Control[];
    }
}
declare namespace colibri.ui.controls {
    const EVENT_SELECTION_CHANGED = "selectionChanged";
    const EVENT_THEME_CHANGED = "themeChanged";
    enum PreloadResult {
        NOTHING_LOADED = 0,
        RESOURCES_LOADED = 1
    }
    const ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
    const ICON_CONTROL_TREE_EXPAND = "tree-expand";
    const ICON_CONTROL_CLOSE = "close";
    const ICON_CONTROL_DIRTY = "dirty";
    const ICON_SIZE = 16;
    class Controls {
        private static _images;
        private static _applicationDragData;
        static setDragEventImage(e: DragEvent, render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): void;
        static getApplicationDragData(): any[];
        static getApplicationDragDataAndClean(): any[];
        static setApplicationDragData(data: any[]): void;
        static resolveAll(list: Promise<PreloadResult>[]): Promise<PreloadResult>;
        static resolveResourceLoaded(): Promise<PreloadResult>;
        static resolveNothingLoaded(): Promise<PreloadResult>;
        static preload(): Promise<PreloadResult[]>;
        private static getImage;
        static openUrlInNewPage(url: string): void;
        static getIcon(name: string, baseUrl?: string): IImage;
        static createIconElement(icon?: IImage, size?: number): HTMLCanvasElement;
        static LIGHT_THEME: Theme;
        static DARK_THEME: Theme;
        static _theme: Theme;
        static switchTheme(): Theme;
        static setTheme(theme: Theme): void;
        static getTheme(): Theme;
        static drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, topLeft?: number, topRight?: number, bottomRight?: number, bottomLeft?: number): void;
    }
}
declare namespace colibri.ui.ide {
    const EVENT_PART_DEACTIVATED = "partDeactivated";
    const EVENT_PART_ACTIVATED = "partActivated";
    const EVENT_EDITOR_DEACTIVATED = "editorDeactivated";
    const EVENT_EDITOR_ACTIVATED = "editorActivated";
    const EVENT_PROJECT_OPENED = "projectOpened";
    const ICON_FILE = "file";
    const ICON_FOLDER = "folder";
    const ICON_PLUS = "plus";
    class Workbench extends EventTarget {
        private static _workbench;
        static getWorkbench(): Workbench;
        private _fileStringCache;
        private _fileImageCache;
        private _fileImageSizeCache;
        private _activeWindow;
        private _contentType_icon_Map;
        private _fileStorage;
        private _contentTypeRegistry;
        private _activePart;
        private _activeEditor;
        private _activeElement;
        private _editorRegistry;
        private _commandManager;
        private _windows;
        private _globalPreferences;
        private _projectPreferences;
        private constructor();
        getGlobalPreferences(): core.preferences.Preferences;
        getProjectPreferences(): core.preferences.Preferences;
        launch(): Promise<void>;
        private resetCache;
        openProject(projectName: string, monitor: controls.IProgressMonitor): Promise<void>;
        private preloadProjectResources;
        private registerWindows;
        getWindows(): WorkbenchWindow[];
        activateWindow(id: string): WorkbenchWindow;
        private preloadIcons;
        private registerContentTypeIcons;
        private initCommands;
        private initEvents;
        private registerEditors;
        getFileStringCache(): core.io.FileStringCache;
        getFileStorage(): core.io.IFileStorage;
        getCommandManager(): commands.CommandManager;
        getActiveDialog(): controls.dialogs.Dialog;
        getActiveWindow(): WorkbenchWindow;
        getActiveElement(): HTMLElement;
        getActivePart(): Part;
        getActiveEditor(): EditorPart;
        setActiveEditor(editor: EditorPart): void;
        /**
         * Users may not call this method. This is public only for convenience.
         */
        setActivePart(part: Part): void;
        private toggleActivePartClass;
        private findTabPane;
        private registerContentTypes;
        findPart(element: HTMLElement): Part;
        getContentTypeRegistry(): core.ContentTypeRegistry;
        getProjectRoot(): core.io.FilePath;
        getContentTypeIcon(contentType: string): controls.IImage;
        getFileImage(file: core.io.FilePath): FileImage;
        getFileImageSizeCache(): ImageSizeFileCache;
        getWorkbenchIcon(name: string): controls.IImage;
        getEditorRegistry(): EditorRegistry;
        getEditors(): EditorPart[];
        createEditor(input: any): EditorPart;
        openEditor(input: any): EditorPart;
    }
}
declare namespace colibri {
    class ColibriPlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): any;
        private _openingProject;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
    }
}
declare namespace colibri {
    class Extension {
        private _extensionPoint;
        private _priority;
        constructor(extensionPoint: string, priority?: number);
        getExtensionPoint(): any;
        getPriority(): number;
    }
}
declare namespace colibri {
    class ExtensionRegistry {
        private _map;
        constructor();
        addExtension(...extensions: Extension[]): void;
        getExtensions<T extends Extension>(point: string): T[];
    }
}
declare namespace colibri.core {
    class ContentTypeExtension extends Extension {
        static POINT_ID: string;
        private _resolvers;
        constructor(resolvers: core.IContentTypeResolver[], priority?: number);
        getResolvers(): IContentTypeResolver[];
    }
}
declare namespace colibri.core.io {
    type GetFileContent<T> = (file: FilePath) => Promise<T>;
    type SetFileContent<T> = (file: FilePath, content: T) => Promise<void>;
    class FileContentCache<T> {
        private _backendGetContent;
        private _backendSetContent;
        private _map;
        private _preloadMap;
        constructor(getContent: GetFileContent<T>, setContent?: SetFileContent<T>);
        reset(): void;
        preload(file: FilePath): Promise<ui.controls.PreloadResult>;
        getContent(file: FilePath): T;
        setContent(file: FilePath, content: T): Promise<void>;
        hasFile(file: FilePath): boolean;
    }
    class ContentEntry<T> {
        content: T;
        modTime: number;
        constructor(content: T, modTime: number);
    }
}
declare namespace colibri.core {
    class ContentTypeFileCache extends io.FileContentCache<string> {
        constructor(registry: ContentTypeRegistry);
    }
}
declare namespace colibri.core {
    class ContentTypeRegistry {
        private _resolvers;
        private _cache;
        constructor();
        resetCache(): void;
        registerResolver(resolver: IContentTypeResolver): void;
        getResolvers(): IContentTypeResolver[];
        getCachedContentType(file: io.FilePath): string;
        preload(file: io.FilePath): Promise<ui.controls.PreloadResult>;
    }
}
declare namespace colibri.core {
    abstract class ContentTypeResolver implements IContentTypeResolver {
        private _id;
        constructor(id: string);
        getId(): string;
        abstract computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace colibri.core {
    const CONTENT_TYPE_ANY = "any";
    interface IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace colibri.core.io {
    type FileData = {
        name: string;
        isFile: boolean;
        size: number;
        modTime: number;
        children?: FileData[];
    };
}
declare namespace colibri.core.io {
    class FilePath {
        private _parent;
        private _name;
        private _nameWithoutExtension;
        private _isFile;
        private _files;
        private _ext;
        private _modTime;
        private _fileSize;
        private _alive;
        constructor(parent: FilePath, fileData: FileData);
        _sort(): void;
        _setName(name: string): void;
        getExtension(): string;
        getSize(): number;
        _setSize(size: number): void;
        getName(): string;
        getNameWithoutExtension(): string;
        getModTime(): number;
        _setModTime(modTime: number): void;
        getFullName(): any;
        getUrl(): any;
        getProject(): FilePath;
        getSibling(name: string): FilePath;
        getFile(name: string): FilePath;
        getParent(): FilePath;
        isFile(): boolean;
        isFolder(): boolean;
        getFiles(): FilePath[];
        _setAlive(alive: boolean): void;
        isAlive(): boolean;
        _add(file: FilePath): void;
        _remove(): void;
        flatTree(files: FilePath[], includeFolders: boolean): FilePath[];
        toString(): any;
        toStringTree(): string;
        private toStringTree2;
    }
}
declare namespace colibri.core.io {
    type RenameData = {
        oldName: string;
        newFile: FilePath;
    };
    class FileStorageChange {
        private _renameRecords_fromPath;
        private _renameRecords_toPath;
        private _renameFromToMap;
        private _deletedRecords;
        private _addedRecords;
        private _modifiedRecords;
        constructor();
        recordRename(fromPath: string, toPath: string): void;
        getRenameTo(fromPath: string): any;
        isRenamed(fromPath: string): boolean;
        wasRenamed(toPath: string): boolean;
        getRenameToRecords(): Set<string>;
        getRenameFromRecords(): Set<string>;
        recordDelete(path: string): void;
        isDeleted(path: string): boolean;
        getDeleteRecords(): Set<string>;
        recordAdd(path: string): void;
        isAdded(path: string): boolean;
        getAddRecords(): Set<string>;
        recordModify(path: string): void;
        isModified(path: string): boolean;
        getModifiedRecords(): Set<string>;
    }
}
declare namespace colibri.core.io {
    class FileStringCache extends FileContentCache<string> {
        constructor(storage: IFileStorage);
    }
}
declare namespace colibri.core.io {
    function apiRequest(method: string, body?: any): Promise<any>;
    class FileStorage_HTTPServer implements IFileStorage {
        private _root;
        private _changeListeners;
        private _projectName;
        constructor();
        addChangeListener(listener: ChangeListenerFunc): void;
        removeChangeListener(listener: ChangeListenerFunc): void;
        getRoot(): FilePath;
        openProject(projectName: string): Promise<FilePath>;
        getProjectTemplates(): Promise<ProjectTemplatesData>;
        createProject(templatePath: string, projectName: string): Promise<boolean>;
        reload(): Promise<void>;
        private fireChange;
        private static compare;
        getProjects(): Promise<string[]>;
        createFile(folder: FilePath, fileName: string, content: string): Promise<FilePath>;
        createFolder(container: FilePath, folderName: string): Promise<FilePath>;
        getFileString(file: FilePath): Promise<string>;
        setFileString(file: FilePath, content: string): Promise<void>;
        private setFileString_priv;
        deleteFiles(files: FilePath[]): Promise<void>;
        renameFile(file: FilePath, newName: string): Promise<void>;
        moveFiles(movingFiles: FilePath[], moveTo: FilePath): Promise<void>;
        uploadFile(uploadFolder: FilePath, htmlFile: File): Promise<FilePath>;
        getImageSize(file: FilePath): Promise<ImageSize>;
    }
}
declare namespace colibri.core.io {
    type ChangeListenerFunc = (change: FileStorageChange) => void;
    type ProjectTemplatesData = {
        providers: {
            name: string;
            templates: {
                name: string;
                path: string;
            };
        }[];
    };
    type ImageSize = {
        width: number;
        height: number;
    };
    interface IFileStorage {
        reload(): Promise<void>;
        getProjects(): Promise<string[]>;
        openProject(projectName: string): Promise<FilePath>;
        getProjectTemplates(): Promise<ProjectTemplatesData>;
        createProject(templatePath: string, projectName: string): Promise<boolean>;
        getRoot(): FilePath;
        getFileString(file: FilePath): Promise<string>;
        setFileString(file: FilePath, content: string): Promise<void>;
        createFile(container: FilePath, fileName: string, content: string): Promise<FilePath>;
        createFolder(container: FilePath, folderName: string): Promise<FilePath>;
        deleteFiles(files: FilePath[]): Promise<void>;
        renameFile(file: FilePath, newName: string): Promise<void>;
        moveFiles(movingFiles: FilePath[], moveTo: FilePath): Promise<void>;
        uploadFile(uploadFolder: FilePath, file: File): Promise<FilePath>;
        getImageSize(file: FilePath): Promise<ImageSize>;
        addChangeListener(listener: ChangeListenerFunc): void;
        removeChangeListener(listener: ChangeListenerFunc): void;
    }
}
declare namespace colibri.core.io {
    type SyncFileContentBuilder<T> = (file: FilePath) => T;
    class SyncFileContentCache<T> {
        private _getContent;
        private _map;
        constructor(builder: SyncFileContentBuilder<T>);
        reset(): void;
        getContent(file: FilePath): T;
        hasFile(file: FilePath): boolean;
    }
}
declare namespace colibri.core.json {
    function write(data: any, name: string, value: any, defaultValue?: any): void;
    function read(data: any, name: string, defaultValue?: any): any;
    function getDataValue(data: any, key: string): any;
    function setDataValue(data: any, key: string, value: any): void;
}
declare namespace colibri.core.preferences {
    class Preferences {
        private _preferencesSpace;
        constructor(preferencesSpace: string);
        private readData;
        getPreferencesSpace(): string;
        setValue(key: string, jsonData: any): void;
        getValue(key: string, defaultValue?: any): any;
    }
}
declare namespace colibri.lang {
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}
declare namespace colibri.ui.controls {
    const EVENT_ACTION_CHANGED = "actionChanged";
    type ActionConfig = {
        text?: string;
        icon?: IImage;
        enabled?: boolean;
        callback?: () => void;
    };
    class Action extends EventTarget {
        private _text;
        private _icon;
        private _enabled;
        private _callback;
        constructor(config: ActionConfig);
        isEnabled(): boolean;
        getText(): string;
        getIcon(): IImage;
        run(e?: MouseEvent): void;
    }
}
declare namespace colibri.ui.controls {
    type Bounds = {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };
}
declare namespace colibri.ui.controls {
    abstract class CanvasControl extends Control {
        protected _canvas: HTMLCanvasElement;
        protected _context: CanvasRenderingContext2D;
        private _padding;
        constructor(padding?: number, ...classList: string[]);
        getCanvas(): HTMLCanvasElement;
        resizeTo(parent?: HTMLElement): void;
        getPadding(): number;
        protected ensureCanvasSize(): void;
        clear(): void;
        repaint(): void;
        private initContext;
        protected abstract paint(): void;
    }
}
declare namespace colibri.ui.controls {
    class DefaultImage implements IImage {
        private _ready;
        private _error;
        private _url;
        private _imageElement;
        private _requestPromise;
        constructor(img: HTMLImageElement, url: string);
        preloadSize(): Promise<PreloadResult>;
        getImageElement(): HTMLImageElement;
        getURL(): string;
        preload(): Promise<PreloadResult>;
        getWidth(): number;
        getHeight(): number;
        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;
        static paintImageElement(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number, center: boolean): void;
        static paintEmpty(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
        static paintImageElementFrame(context: CanvasRenderingContext2D, image: HTMLImageElement, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    }
}
declare namespace colibri.ui.controls {
    const EmptyProgressMonitor: IProgressMonitor;
}
declare namespace colibri.ui.controls {
    class FillLayout implements ILayout {
        private _padding;
        constructor(padding?: number);
        getPadding(): number;
        setPadding(padding: number): void;
        layout(parent: Control): void;
    }
}
declare namespace colibri.ui.controls {
    class FrameData {
        index: number;
        src: controls.Rect;
        dst: controls.Rect;
        srcSize: controls.Point;
        constructor(index: number, src: controls.Rect, dst: controls.Rect, srcSize: controls.Point);
        static fromRect(index: number, rect: Rect): FrameData;
    }
}
declare namespace colibri.ui.controls {
    interface IImage {
        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;
        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
        preload(): Promise<PreloadResult>;
        getWidth(): number;
        getHeight(): number;
        preloadSize(): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls {
    interface ILayout {
        layout(parent: Control): any;
    }
}
declare namespace colibri.ui.controls {
    interface IProgressMonitor {
        addTotal(total: number): any;
        step(): any;
    }
}
declare namespace colibri.ui.controls {
    class ImageControl extends CanvasControl {
        private _image;
        constructor(padding?: number, ...classList: string[]);
        setImage(image: IImage): void;
        getImage(): IImage;
        protected paint(): Promise<void>;
        private paint2;
    }
}
declare namespace colibri.ui.controls {
    class ImageFrame implements IImage {
        private _name;
        private _image;
        private _frameData;
        constructor(name: string, image: controls.IImage, frameData: FrameData);
        preloadSize(): Promise<PreloadResult>;
        getName(): string;
        getImage(): IImage;
        getFrameData(): FrameData;
        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;
        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
        preload(): Promise<PreloadResult>;
        getWidth(): number;
        getHeight(): number;
    }
}
declare namespace colibri.ui.controls {
    class ImageWrapper implements IImage {
        private _imageElement;
        constructor(imageElement: HTMLImageElement);
        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;
        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
        preload(): Promise<PreloadResult>;
        preloadSize(): Promise<PreloadResult>;
        getWidth(): number;
        getHeight(): number;
    }
}
declare namespace colibri.ui.controls {
    class Menu {
        private _actions;
        private _element;
        private _bgElement;
        private _menuCloseCallback;
        private static _activeMenu;
        constructor();
        setMenuClosedCallback(callback: () => void): void;
        add(action: Action): void;
        addSeparator(): void;
        isEmpty(): boolean;
        getElement(): HTMLUListElement;
        static getActiveMenu(): Menu;
        create(e: MouseEvent): void;
        close(): void;
    }
}
declare namespace colibri.ui.controls {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
}
declare namespace colibri.ui.controls {
    class Rect {
        x: number;
        y: number;
        w: number;
        h: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
        set(x: number, y: number, w: number, h: number): void;
        contains(x: number, y: number): boolean;
        clone(): Rect;
    }
}
declare namespace colibri.ui.controls {
    class ScrollPane extends Control {
        private _clientControl;
        private _scrollBar;
        private _scrollHandler;
        private _clientContentHeight;
        constructor(clientControl: Control);
        getViewer(): Control;
        updateScroll(clientContentHeight: number): void;
        private onBarMouseDown;
        private onClientWheel;
        private setClientScrollY;
        private _startDragY;
        private _startScrollY;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        getBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        layout(): void;
    }
}
declare namespace colibri.ui.controls {
    class SplitPanel extends Control {
        private _leftControl;
        private _rightControl;
        private _horizontal;
        private _splitPosition;
        private _splitFactor;
        private _splitWidth;
        private _startDrag;
        private _startPos;
        constructor(left?: Control, right?: Control, horizontal?: boolean);
        private onDragStart;
        private onMouseDown;
        private onMouseUp;
        private onMouseMove;
        private onMouseLeave;
        setHorizontal(horizontal?: boolean): void;
        setVertical(vertical?: boolean): void;
        getSplitFactor(): number;
        private getSize;
        setSplitFactor(factor: number): void;
        setLeftControl(control: Control): void;
        getLeftControl(): Control;
        setRightControl(control: Control): void;
        getRightControl(): Control;
        layout(): void;
    }
}
declare namespace colibri.ui.controls {
    const EVENT_TAB_CLOSED = "tabClosed";
    const EVENT_TAB_SELECTED = "tabSelected";
    const EVENT_TAB_LABEL_RESIZED = "tabResized";
    class TabPane extends Control {
        private _selectionHistoryLabelElement;
        private _titleBarElement;
        private _contentAreaElement;
        private _iconSize;
        constructor(...classList: string[]);
        addTab(label: string, icon: IImage, content: Control, closeable?: boolean, selectIt?: boolean): void;
        getTabIconSize(): number;
        setTabIconSize(size: number): void;
        incrementTabIconSize(amount: number): void;
        private makeLabel;
        setTabCloseIcons(labelElement: HTMLElement, icon: IImage, overIcon: IImage): void;
        closeTab(content: controls.Control): void;
        closeAll(): void;
        private closeTabLabel;
        setTabTitle(content: Control, title: string, icon?: IImage): void;
        static isTabCloseIcon(element: HTMLElement): boolean;
        static isTabLabel(element: HTMLElement): boolean;
        getLabelFromContent(content: Control): HTMLElement;
        private static getContentAreaFromLabel;
        static getContentFromLabel(labelElement: HTMLElement): Control;
        selectTabWithContent(content: Control): void;
        private selectTab;
        getSelectedTabContent(): Control;
        getContentList(): controls.Control[];
        private getSelectedLabelElement;
    }
}
declare namespace colibri.ui.controls {
    type Theme = {
        id: string;
        classList: string[];
        displayName: string;
        viewerSelectionBackground: string;
        viewerSelectionForeground: string;
        viewerForeground: string;
        dark: boolean;
    };
}
declare namespace colibri.ui.controls {
    class ToolbarManager {
        private _toolbarElement;
        private _actionDataMap;
        constructor(toolbarElement: HTMLElement);
        add(action: Action): void;
        dispose(): void;
        private updateButtonWithAction;
    }
}
declare namespace colibri.ui.controls {
    const CONTROL_PADDING = 3;
    const ROW_HEIGHT = 20;
    const FONT_HEIGHT = 14;
    const FONT_OFFSET = 2;
    const ACTION_WIDTH = 20;
    const PANEL_BORDER_SIZE = 5;
    const PANEL_TITLE_HEIGHT = 22;
    const FILTERED_VIEWER_FILTER_HEIGHT = 30;
    const SPLIT_OVER_ZONE_WIDTH = 6;
    function setElementBounds(elem: HTMLElement, bounds: Bounds): void;
    function getElementBounds(elem: HTMLElement): Bounds;
}
declare namespace colibri.ui.controls.dialogs {
    class Dialog extends Control {
        private _containerElement;
        private _buttonPaneElement;
        private _titlePaneElement;
        private _width;
        private _height;
        private static _dialogs;
        private static _firstTime;
        private _parentDialog;
        private _closeWithEscapeKey;
        constructor(...classList: string[]);
        static getActiveDialog(): Dialog;
        getDialogBackgroundElement(): HTMLElement;
        setCloseWithEscapeKey(closeWithEscapeKey: boolean): void;
        isCloseWithEscapeKey(): boolean;
        getParentDialog(): Dialog;
        create(): void;
        setTitle(title: string): void;
        addButton(text: string, callback: () => void): HTMLButtonElement;
        protected createDialogArea(): void;
        protected resize(): void;
        setSize(width: number, height: number): void;
        close(): void;
        closeAll(): void;
    }
}
declare namespace colibri.ui.controls.dialogs {
    class AlertDialog extends Dialog {
        private _messageElement;
        private static _currentDialog;
        constructor();
        createDialogArea(): void;
        create(): void;
        static replaceConsoleAlert(): void;
    }
}
declare namespace colibri.ui.controls.dialogs {
    type InputValidator = (input: string) => boolean;
    type ResultCallback = (value: string) => void;
    class InputDialog extends Dialog {
        private _textElement;
        private _messageElement;
        private _acceptButton;
        private _validator;
        private _resultCallback;
        constructor();
        setInputValidator(validator: InputValidator): void;
        setResultCallback(callback: ResultCallback): void;
        setMessage(message: string): void;
        setInitialValue(value: string): void;
        createDialogArea(): void;
        validate(): void;
        create(): void;
    }
}
declare namespace colibri.ui.controls.dialogs {
    class ProgressDialog extends Dialog {
        private _progressElement;
        constructor();
        createDialogArea(): void;
        create(): void;
        setProgress(progress: number): void;
    }
}
declare namespace colibri.ui.controls.dialogs {
    class ProgressDialogMonitor implements IProgressMonitor {
        private _dialog;
        private _total;
        private _step;
        constructor(dialog: ProgressDialog);
        private updateDialog;
        addTotal(total: number): void;
        step(): void;
    }
}
declare namespace colibri.ui.controls.dialogs {
    class ViewerDialog extends Dialog {
        private _viewer;
        private _filteredViewer;
        constructor(viewer: viewers.TreeViewer);
        createDialogArea(): void;
        getViewer(): viewers.TreeViewer;
    }
}
declare namespace colibri.ui.controls.properties {
    class PropertyPage extends Control {
        private _sectionProvider;
        private _sectionPanes;
        private _sectionPaneMap;
        private _selection;
        constructor();
        private build;
        private updateWithSelection;
        updateExpandStatus(): void;
        getSelection(): any[];
        setSelection(sel: any[]): any;
        setSectionProvider(provider: PropertySectionProvider): void;
        getSectionProvider(): PropertySectionProvider;
    }
}
declare namespace colibri.ui.controls.properties {
    type Updater = () => void;
    abstract class PropertySection<T> {
        private _id;
        private _title;
        private _page;
        private _updaters;
        private _fillSpace;
        constructor(page: PropertyPage, id: string, title: string, fillSpace?: boolean);
        protected abstract createForm(parent: HTMLDivElement): any;
        abstract canEdit(obj: any, n: number): boolean;
        abstract canEditNumber(n: number): boolean;
        updateWithSelection(): void;
        addUpdater(updater: Updater): void;
        isFillSpace(): boolean;
        getPage(): PropertyPage;
        getSelection(): T[];
        getId(): string;
        getTitle(): string;
        create(parent: HTMLDivElement): void;
        flatValues_Number(values: number[]): string;
        flatValues_StringJoin(values: string[]): string;
        protected createGridElement(parent: HTMLElement, cols?: number, simpleProps?: boolean): HTMLDivElement;
        protected createLabel(parent: HTMLElement, text?: string): HTMLLabelElement;
        protected createButton(parent: HTMLElement, text: string, callback: () => void): HTMLButtonElement;
        protected createText(parent: HTMLElement, readOnly?: boolean): HTMLInputElement;
        protected createCheckbox(parent: HTMLElement): HTMLInputElement;
    }
}
declare namespace colibri.ui.controls.properties {
    abstract class PropertySectionProvider {
        abstract addSections(page: PropertyPage, sections: PropertySection<any>[]): void;
    }
}
declare namespace colibri.ui.controls.viewers {
    const EMPTY_ARRAY: any[];
    class ArrayTreeContentProvider implements ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
declare namespace colibri.ui.controls.viewers {
    class EmptyCellRenderer implements ICellRenderer {
        private _variableSize;
        constructor(variableSize?: boolean);
        renderCell(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    class EmptyCellRendererProvider implements ICellRendererProvider {
        private _getRenderer;
        constructor(getRenderer?: (element: any) => ICellRenderer);
        getCellRenderer(element: any): ICellRenderer;
        preload(obj: any): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    class EmptyTreeContentProvider implements ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
declare namespace colibri.ui.controls.viewers {
    class FilterControl extends Control {
        private _filterElement;
        constructor();
        getFilterElement(): HTMLInputElement;
    }
    export class ViewerContainer extends controls.Control {
        private _viewer;
        constructor(viewer: Viewer);
        getViewer(): Viewer;
        layout(): void;
    }
    export class FilteredViewer<T extends Viewer> extends Control {
        private _viewer;
        private _viewerContainer;
        private _filterControl;
        private _scrollPane;
        constructor(viewer: T, ...classList: string[]);
        private onFilterInput;
        getViewer(): T;
        layout(): void;
        getFilterControl(): FilterControl;
    }
    export {};
}
declare namespace colibri.ui.controls.viewers {
    class FilteredViewerInElement<T extends Viewer> extends FilteredViewer<T> {
        constructor(viewer: T, ...classList: string[]);
        resizeTo(): void;
    }
}
declare namespace colibri.ui.controls.viewers {
    class FolderCellRenderer implements ICellRenderer {
        private _maxCount;
        constructor(maxCount?: number);
        renderCell(args: RenderCellArgs): void;
        private renderFolder;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
        protected renderGrid(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
    }
}
declare namespace colibri.ui.controls.viewers {
    class TreeViewerRenderer {
        private _viewer;
        constructor(viewer: TreeViewer, cellSize?: number);
        getViewer(): TreeViewer;
        paint(): {
            contentHeight: number;
            paintItems: PaintItem[];
            treeIconList: TreeIconInfo[];
        };
        protected paintItems(objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[], parentPaintItem: PaintItem, x: number, y: number): {
            x: number;
            y: number;
        };
        private renderTreeCell;
    }
}
declare namespace colibri.ui.controls.viewers {
    const TREE_RENDERER_GRID_PADDING = 5;
    class GridTreeViewerRenderer extends TreeViewerRenderer {
        private _center;
        private _flat;
        private _sections;
        constructor(viewer: TreeViewer, flat?: boolean, center?: boolean);
        isFlat(): boolean;
        setSections(sections: any[]): void;
        getSections(): any[];
        paint(): {
            contentHeight: number;
            paintItems: PaintItem[];
            treeIconList: TreeIconInfo[];
        };
        protected paintItems(objects: any[], treeIconList: TreeIconInfo[], paintItems: PaintItem[], parentPaintItem: PaintItem, x: number, y: number): {
            x: number;
            y: number;
        };
        private paintItems2;
        private renderGridCell;
        protected renderCellBack(args: RenderCellArgs, selected: boolean, isLastChild: boolean): void;
        protected renderCellFront(args: RenderCellArgs, selected: boolean, isLastChild: boolean): void;
    }
}
declare namespace colibri.ui.controls.viewers {
    interface ICellRenderer {
        renderCell(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    interface ICellRendererProvider {
        getCellRenderer(element: any): ICellRenderer;
        preload(element: any): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    interface IContentProvider {
    }
}
declare namespace colibri.ui.controls.viewers {
    interface ILabelProvider {
        getLabel(obj: any): string;
    }
}
declare namespace colibri.ui.controls.viewers {
    abstract class LabelCellRenderer implements ICellRenderer {
        renderCell(args: RenderCellArgs): void;
        abstract getImage(obj: any): controls.IImage;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    class ImageCellRenderer implements ICellRenderer {
        getImage(obj: any): IImage;
        renderCell(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    const EVENT_OPEN_ITEM = "itemOpened";
    abstract class Viewer extends Control {
        private _contentProvider;
        private _cellRendererProvider;
        private _labelProvider;
        private _input;
        private _cellSize;
        protected _expandedObjects: Set<any>;
        private _selectedObjects;
        protected _context: CanvasRenderingContext2D;
        protected _paintItems: PaintItem[];
        private _lastSelectedItemIndex;
        protected _contentHeight: number;
        private _filterText;
        protected _filterIncludeSet: Set<any>;
        private _menu;
        constructor(...classList: string[]);
        private initListeners;
        private onKeyDown;
        private onDragStart;
        getMenu(): Menu;
        setMenu(menu: controls.Menu): void;
        getLabelProvider(): ILabelProvider;
        setLabelProvider(labelProvider: ILabelProvider): void;
        setFilterText(filterText: string): void;
        getFilterText(): string;
        private prepareFiltering;
        isFilterIncluded(obj: any): boolean;
        protected abstract buildFilterIncludeMap(): any;
        protected matches(obj: any): boolean;
        protected getPaintItemAt(e: MouseEvent): PaintItem;
        getSelection(): any[];
        getSelectionFirstElement(): any;
        setSelection(selection: any[], notify?: boolean): void;
        abstract reveal(...objects: any[]): void;
        private fireSelectionChanged;
        escape(): void;
        private onWheel;
        private onDoubleClick;
        protected abstract canSelectAtPoint(e: MouseEvent): boolean;
        onMouseUp(e: MouseEvent): void;
        private initContext;
        setExpanded(obj: any, expanded: boolean): void;
        isExpanded(obj: any): boolean;
        getExpandedObjects(): Set<any>;
        isCollapsed(obj: any): boolean;
        collapseAll(): void;
        expandCollapseBranch(obj: any): any[];
        isSelected(obj: any): boolean;
        protected paintTreeHandler(x: number, y: number, collapsed: boolean): void;
        repaint(): Promise<void>;
        updateScrollPane(): void;
        private repaint2;
        protected abstract preload(): Promise<PreloadResult>;
        paintItemBackground(obj: any, x: number, y: number, w: number, h: number, radius?: number): void;
        setScrollY(scrollY: number): void;
        layout(): void;
        protected abstract paint(): void;
        getCanvas(): HTMLCanvasElement;
        getContext(): CanvasRenderingContext2D;
        getCellSize(): number;
        setCellSize(cellSize: number): void;
        getContentProvider(): IContentProvider;
        setContentProvider(contentProvider: IContentProvider): void;
        getCellRendererProvider(): ICellRendererProvider;
        setCellRendererProvider(cellRendererProvider: ICellRendererProvider): void;
        getInput(): any;
        setInput(input: any): void;
        getState(): ViewerState;
        setState(state: ViewerState): void;
        selectAll(): void;
    }
    type ViewerState = {
        expandedObjects: Set<any>;
        selectedObjects: Set<any>;
        filterText: string;
        cellSize: number;
    };
}
declare namespace colibri.ui.controls.viewers {
    interface ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
declare namespace colibri.ui.controls.viewers {
    class IconImageCellRenderer implements ICellRenderer {
        private _icon;
        constructor(icon: IImage);
        getIcon(obj: any): IImage;
        renderCell(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}
declare namespace colibri.ui.controls.viewers {
    class IconGridCellRenderer implements ICellRenderer {
        private _icon;
        constructor(icon: IImage);
        renderCell(args: RenderCellArgs): void;
        cellHeight(args: RenderCellArgs): number;
        preload(args: PreloadCellArgs): Promise<any>;
    }
}
declare namespace colibri.ui.controls.viewers {
    class LabelProvider implements ILabelProvider {
        getLabel(obj: any): string;
    }
}
declare namespace colibri.ui.controls.viewers {
    class PaintItem extends controls.Rect {
        index: number;
        data: any;
        parent: PaintItem;
        constructor(index: number, data: any, parent?: PaintItem);
    }
}
declare namespace colibri.ui.controls.viewers {
    class PreloadCellArgs {
        obj: any;
        viewer: Viewer;
        constructor(obj: any, viewer: Viewer);
        clone(): PreloadCellArgs;
    }
}
declare namespace colibri.ui.controls.viewers {
    class RenderCellArgs {
        canvasContext: CanvasRenderingContext2D;
        x: number;
        y: number;
        w: number;
        h: number;
        obj: any;
        viewer: Viewer;
        center: boolean;
        constructor(canvasContext: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, obj: any, viewer: Viewer, center?: boolean);
        clone(): RenderCellArgs;
    }
}
declare namespace colibri.ui.controls.viewers {
    const TREE_ICON_SIZE = 16;
    const LABEL_MARGIN: number;
    type TreeIconInfo = {
        rect: Rect;
        obj: any;
    };
    class TreeViewer extends Viewer {
        private _treeRenderer;
        private _treeIconList;
        constructor(...classList: string[]);
        getTreeRenderer(): TreeViewerRenderer;
        setTreeRenderer(treeRenderer: TreeViewerRenderer): void;
        canSelectAtPoint(e: MouseEvent): boolean;
        reveal(...objects: any[]): void;
        private revealPath;
        getObjectPath(obj: any): any[];
        private getObjectPath2;
        private getTreeIconAtPoint;
        private onClick;
        visitObjects(visitor: Function): void;
        private visitObjects2;
        preload(): Promise<PreloadResult>;
        protected paint(): void;
        setFilterText(filter: string): void;
        private expandFilteredParents;
        buildFilterIncludeMap(): void;
        private buildFilterIncludeMap2;
        getContentProvider(): ITreeContentProvider;
        expandCollapseBranch(obj: any): any[];
    }
}
declare namespace colibri.ui.ide {
    type ContentTypeIconExtensionConfig = {
        icon: controls.IImage;
        contentType: string;
    }[];
    class ContentTypeIconExtension extends Extension {
        static POINT_ID: string;
        private _config;
        static withPluginIcons(plugin: colibri.Plugin, config: {
            iconName: string;
            contentType: string;
            plugin?: colibri.Plugin;
        }[]): ContentTypeIconExtension;
        constructor(config: ContentTypeIconExtensionConfig);
        getConfig(): ContentTypeIconExtensionConfig;
    }
}
declare namespace colibri.ui.ide {
    const EVENT_PART_TITLE_UPDATED = "partTitledUpdated";
    abstract class Part extends controls.Control {
        private _id;
        private _title;
        private _selection;
        private _partCreated;
        private _icon;
        private _folder;
        private _undoManager;
        private _restoreState;
        constructor(id: string);
        setRestoreState(state: any): void;
        getUndoManager(): undo.UndoManager;
        getPartFolder(): PartFolder;
        setPartFolder(folder: PartFolder): void;
        getTitle(): string;
        setTitle(title: string): void;
        setIcon(icon: controls.IImage): void;
        dispatchTitleUpdatedEvent(): void;
        getIcon(): controls.IImage;
        getId(): string;
        setSelection(selection: any[], notify?: boolean): void;
        getSelection(): any[];
        getPropertyProvider(): controls.properties.PropertySectionProvider;
        layout(): void;
        onPartClosed(): boolean;
        onPartShown(): void;
        protected doCreatePart(): void;
        onPartActivated(): void;
        saveState(state: any): void;
        protected restoreState(state: any): void;
        protected abstract createPart(): void;
    }
}
declare namespace colibri.ui.ide {
    abstract class EditorPart extends Part {
        private _input;
        private _dirty;
        constructor(id: string);
        setDirty(dirty: boolean): void;
        isDirty(): boolean;
        save(): void;
        protected doSave(): void;
        onPartClosed(): boolean;
        getInput(): any;
        setInput(input: any): void;
        getEditorViewerProvider(key: string): EditorViewerProvider;
        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager;
    }
}
declare namespace colibri.ui.ide {
    class PartFolder extends controls.TabPane {
        constructor(...classList: string[]);
        addPart(part: Part, closeable?: boolean, selectIt?: boolean): void;
        getParts(): Part[];
    }
}
declare namespace colibri.ui.ide {
    class EditorArea extends PartFolder {
        constructor();
        activateEditor(editor: EditorPart): void;
        getEditors(): EditorPart[];
    }
}
declare namespace colibri.ui.ide {
    class EditorExtension extends Extension {
        static POINT_ID: string;
        private _factories;
        constructor(factories: EditorFactory[]);
        getFactories(): EditorFactory[];
    }
}
declare namespace colibri.ui.ide {
    abstract class EditorFactory {
        private _id;
        constructor(id: string);
        getId(): string;
        abstract acceptInput(input: any): boolean;
        abstract createEditor(): EditorPart;
    }
}
declare namespace colibri.ui.ide {
    class EditorRegistry {
        private _map;
        constructor();
        registerFactory(factory: EditorFactory): void;
        getFactoryForInput(input: any): EditorFactory;
    }
}
declare namespace colibri.ui.ide {
    import viewers = controls.viewers;
    abstract class EditorViewerProvider {
        private _viewer;
        private _initialSelection;
        constructor();
        setViewer(viewer: controls.viewers.TreeViewer): void;
        setSelection(selection: any[], reveal: boolean, notify: boolean): void;
        getSelection(): any[];
        onViewerSelectionChanged(selection: any[]): void;
        repaint(): void;
        prepareViewerState(state: viewers.ViewerState): void;
        abstract getContentProvider(): viewers.ITreeContentProvider;
        abstract getLabelProvider(): viewers.ILabelProvider;
        abstract getCellRendererProvider(): viewers.ICellRendererProvider;
        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): viewers.TreeViewerRenderer;
        abstract getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        abstract getInput(): any;
        abstract preload(): Promise<void>;
        abstract getUndoManager(): any;
    }
}
declare namespace colibri.ui.ide {
    abstract class ViewPart extends Part {
        constructor(id: string);
    }
}
declare namespace colibri.ui.ide {
    abstract class ViewerView extends ViewPart {
        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer: controls.viewers.TreeViewer;
        constructor(id: string);
        protected abstract createViewer(): controls.viewers.TreeViewer;
        protected createPart(): void;
        protected fillContextMenu(menu: controls.Menu): void;
        private onMenu;
        getViewer(): controls.viewers.TreeViewer;
        layout(): void;
    }
}
declare namespace colibri.ui.ide {
    import viewers = controls.viewers;
    abstract class EditorViewerView extends ide.ViewerView {
        private _currentEditor;
        private _currentViewerProvider;
        private _viewerStateMap;
        constructor(id: string);
        protected createViewer(): viewers.TreeViewer;
        protected createPart(): void;
        abstract getViewerProvider(editor: EditorPart): EditorViewerProvider;
        private onWorkbenchEditorActivated;
        getPropertyProvider(): controls.properties.PropertySectionProvider;
        getUndoManager(): any;
    }
}
declare namespace colibri.ui.ide {
    import io = core.io;
    abstract class FileEditor extends EditorPart {
        private _onFileStorageListener;
        private _isSaving;
        constructor(id: string);
        save(): void;
        protected isSaving(): boolean;
        protected onFileStorageChanged(change: io.FileStorageChange): void;
        protected abstract onEditorInputContentChanged(): any;
        onPartClosed(): boolean;
        setInput(file: io.FilePath): void;
        getInput(): core.io.FilePath;
        getIcon(): controls.IImage;
    }
}
declare namespace colibri.ui.ide {
    class FileImage extends controls.DefaultImage {
        private _file;
        constructor(file: core.io.FilePath);
        getFile(): core.io.FilePath;
        preload(): Promise<controls.PreloadResult>;
        getWidth(): number;
        getHeight(): number;
        preloadSize(): Promise<controls.PreloadResult>;
    }
}
declare namespace colibri.ui.ide {
    import io = core.io;
    class FileUtils {
        static preloadImageSize(file: io.FilePath): Promise<controls.PreloadResult>;
        static getImageSize(file: io.FilePath): core.io.ImageSize;
        static getImage(file: io.FilePath): FileImage;
        static preloadAndGetFileString(file: io.FilePath): Promise<string>;
        static getFileString(file: io.FilePath): string;
        static setFileString_async(file: io.FilePath, content: string): Promise<void>;
        static createFile_async(folder: io.FilePath, fileName: string, content: string): Promise<io.FilePath>;
        static createFolder_async(container: io.FilePath, folderName: string): Promise<io.FilePath>;
        static deleteFiles_async(files: io.FilePath[]): Promise<void>;
        static renameFile_async(file: io.FilePath, newName: string): Promise<void>;
        static moveFiles_async(movingFiles: io.FilePath[], moveTo: io.FilePath): Promise<void>;
        static getProjects_async(): Promise<string[]>;
        static getProjectTemplates_async(): Promise<io.ProjectTemplatesData>;
        static createProject_async(templatePath: string, projectName: string): Promise<boolean>;
        static preloadFileString(file: io.FilePath): Promise<ui.controls.PreloadResult>;
        static getFileFromPath(path: string): io.FilePath;
        static uploadFile_async(uploadFolder: io.FilePath, file: File): Promise<io.FilePath>;
        static getFilesWithContentType(contentType: string): Promise<io.FilePath[]>;
        static getAllFiles(): io.FilePath[];
        static getRoot(): io.FilePath;
    }
}
declare namespace colibri.ui.ide {
    class IconLoaderExtension extends Extension {
        static POINT_ID: string;
        static withPluginFiles(plugin: colibri.Plugin, iconNames: string[]): IconLoaderExtension;
        private _icons;
        constructor(icons: controls.IImage[]);
        getIcons(): controls.IImage[];
    }
}
declare namespace colibri.ui.ide {
    class ImageFileCache extends core.io.SyncFileContentCache<FileImage> {
        constructor();
    }
}
declare namespace colibri.ui.ide {
    class ImageSizeFileCache extends core.io.FileContentCache<core.io.ImageSize> {
        constructor();
    }
}
declare namespace colibri.ui.ide {
    class MainToolbar extends controls.Control {
        private _leftArea;
        private _centerArea;
        private _rightArea;
        private _currentManager;
        constructor();
        getLeftArea(): HTMLElement;
        getCenterArea(): HTMLElement;
        getRightArea(): HTMLElement;
        private onEditorActivated;
    }
}
declare namespace colibri.ui.ide {
    abstract class OutlineProvider extends EventTarget {
        private _editor;
        constructor(editor: EditorPart);
        abstract getContentProvider(): controls.viewers.ITreeContentProvider;
        abstract getLabelProvider(): controls.viewers.ILabelProvider;
        abstract getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
    }
}
declare namespace colibri.ui.ide {
    class PreloadProjectResourcesExtension extends Extension {
        static POINT_ID: string;
        private _getPreloadPromise;
        constructor(getPreloadPromise: (monitor: controls.IProgressMonitor) => Promise<any>);
        getPreloadPromise(monitor: controls.IProgressMonitor): Promise<any>;
    }
}
declare namespace colibri.ui.ide {
    class ViewFolder extends PartFolder {
        constructor(...classList: string[]);
    }
}
declare namespace colibri.ui.ide {
    abstract class ViewerFileEditor extends FileEditor {
        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer: controls.viewers.TreeViewer;
        constructor(id: string);
        protected abstract createViewer(): controls.viewers.TreeViewer;
        protected createPart(): void;
        getViewer(): controls.viewers.TreeViewer;
        layout(): void;
    }
}
declare namespace colibri.ui.ide {
    type CreateWindowFunc = () => WorkbenchWindow;
    class WindowExtension extends Extension {
        static POINT_ID: string;
        private _createWindowFunc;
        constructor(createWindowFunc: CreateWindowFunc);
        createWindow(): WorkbenchWindow;
    }
}
declare namespace colibri.ui.ide {
    abstract class WorkbenchWindow extends controls.Control {
        private _toolbar;
        private _clientArea;
        private _id;
        private _created;
        constructor(id: string);
        saveState(prefs: colibri.core.preferences.Preferences): void;
        restoreState(prefs: colibri.core.preferences.Preferences): void;
        protected saveEditorsState(prefs: colibri.core.preferences.Preferences): void;
        protected restoreEditors(prefs: colibri.core.preferences.Preferences): void;
        create(): void;
        protected abstract createParts(): any;
        getId(): string;
        getToolbar(): MainToolbar;
        getClientArea(): controls.Control;
        getViews(): ViewPart[];
        getView(viewId: string): ViewPart;
        private findViews;
        protected createViewFolder(...parts: Part[]): ViewFolder;
        abstract getEditorArea(): EditorArea;
    }
}
declare namespace colibri.ui.ide {
    class WorkbenchWindowLayout implements controls.ILayout {
        layout(parent: controls.Control): void;
    }
}
declare namespace colibri.ui.ide {
    const IMG_SECTION_PADDING = 10;
}
declare namespace colibri.ui.ide.commands {
    class KeyMatcher {
        private _control;
        private _shift;
        private _alt;
        private _meta;
        private _key;
        private _filterInputElements;
        constructor(config: {
            control?: boolean;
            shift?: boolean;
            alt?: boolean;
            meta?: boolean;
            key?: string;
            filterInputElements?: boolean;
        });
        matchesKeys(event: KeyboardEvent): boolean;
        matchesTarget(element: EventTarget): boolean;
    }
}
declare namespace colibri.ui.ide.actions {
    const CMD_SAVE = "colibri.ui.ide.actions.Save";
    const CMD_DELETE = "colibri.ui.ide.actions.Delete";
    const CMD_RENAME = "colibri.ui.ide.actions.Rename";
    const CMD_UNDO = "colibri.ui.ide.actions.Undo";
    const CMD_REDO = "colibri.ui.ide.actions.Redo";
    const CMD_COLLAPSE_ALL = "colibri.ui.ide.actions.CollapseAll";
    const CMD_EXPAND_COLLAPSE_BRANCH = "colibri.ui.ide.actions.ExpandCollapseBranch";
    const CMD_SELECT_ALL = "colibri.ui.ide.actions.SelectAll";
    const CMD_ESCAPE = "colibri.ui.ide.actions.Scape";
    class IDECommands {
        static registerCommands(manager: commands.CommandManager): void;
        private static initViewer;
        private static initUndo;
        private static initEdit;
    }
}
declare namespace colibri.ui.ide.actions {
    abstract class PartAction<T extends ide.Part> extends controls.Action {
        private _part;
        constructor(part: T, config: controls.ActionConfig);
        getPart(): T;
    }
}
declare namespace colibri.ui.ide.actions {
    abstract class ViewerViewAction<T extends ide.ViewerView> extends PartAction<T> {
        constructor(view: T, config: controls.ActionConfig);
        getViewViewer(): controls.viewers.TreeViewer;
        getViewViewerSelection(): any[];
    }
}
declare namespace colibri.ui.ide.commands {
    class Command {
        private _id;
        constructor(id: string);
        getId(): string;
    }
}
declare namespace colibri.ui.ide.commands {
    class CommandArgs {
        readonly activePart: Part;
        readonly activeEditor: EditorPart;
        readonly activeElement: HTMLElement;
        readonly activeMenu: controls.Menu;
        readonly activeWindow: ide.WorkbenchWindow;
        readonly activeDialog: controls.dialogs.Dialog;
        constructor(activePart: Part, activeEditor: EditorPart, activeElement: HTMLElement, activeMenu: controls.Menu, activeWindow: ide.WorkbenchWindow, activeDialog: controls.dialogs.Dialog);
    }
}
declare namespace colibri.ui.ide.commands {
    class CommandExtension extends Extension {
        static POINT_ID: string;
        private _configurer;
        constructor(configurer: (manager: CommandManager) => void);
        getConfigurer(): (manager: CommandManager) => void;
    }
}
declare namespace colibri.ui.ide.commands {
    class CommandHandler {
        private _testFunc;
        private _executeFunc;
        constructor(config: {
            testFunc?: (args: CommandArgs) => boolean;
            executeFunc?: (args: CommandArgs) => void;
        });
        test(args: CommandArgs): boolean;
        execute(args: CommandArgs): void;
    }
}
declare namespace colibri.ui.ide.commands {
    class CommandManager {
        private _commandIdMap;
        private _commands;
        private _commandMatcherMap;
        private _commandHandlerMap;
        constructor();
        private onKeyDown;
        addCommand(cmd: Command): void;
        addCommandHelper(id: string): void;
        private makeArgs;
        getCommand(id: string): Command;
        addKeyBinding(commandId: string, matcher: KeyMatcher): void;
        addHandler(commandId: string, handler: CommandHandler): void;
        addHandlerHelper(commandId: string, testFunc: (args: CommandArgs) => boolean, executeFunc: (args: CommandArgs) => void): void;
    }
}
declare namespace colibri.ui.ide.properties {
    class FilteredViewerInPropertySection<T extends controls.viewers.Viewer> extends controls.viewers.FilteredViewer<T> {
        constructor(page: controls.properties.PropertyPage, viewer: T, ...classList: string[]);
        resizeTo(): void;
    }
}
declare namespace colibri.ui.ide.themes {
    class ThemeExtension extends Extension {
        static POINT_ID: string;
        private _theme;
        constructor(theme: controls.Theme);
        getTheme(): controls.Theme;
    }
}
declare namespace colibri.ui.ide.undo {
    abstract class Operation {
        abstract undo(): void;
        abstract redo(): void;
    }
}
declare namespace colibri.ui.ide.undo {
    class UndoManager {
        private _undoList;
        private _redoList;
        constructor();
        add(op: Operation): void;
        undo(): void;
        redo(): void;
    }
}
declare namespace colibri.ui.ide.utils {
    type GetName = (obj: any) => string;
    export class NameMaker {
        private _getName;
        private _nameSet;
        constructor(getName: GetName);
        update(objects: any[]): void;
        makeName(baseName: string): string;
    }
    export {};
}
//# sourceMappingURL=plugin.d.ts.map