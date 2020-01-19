declare namespace phasereditor2d.scene {
    const ICON_GROUP = "group";
    const ICON_TRANSLATE = "translate";
    const ICON_ANGLE = "angle";
    const ICON_SCALE = "scale";
    const ICON_ORIGIN = "origin";
    const ICON_BUILD = "build";
    const ICON_LOCKED = "locked";
    const ICON_UNLOCKED = "unlocked";
    class ScenePlugin extends colibri.Plugin {
        private static _instance;
        private _sceneFinder;
        static DEFAULT_CANVAS_CONTEXT: number;
        static DEFAULT_EDITOR_CANVAS_CONTEXT: number;
        static getInstance(): ScenePlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        getSceneFinder(): core.json.SceneFinder;
        getObjectExtensions(): ui.sceneobjects.SceneObjectExtension[];
        getObjectExtensionByObjectType(type: string): ui.sceneobjects.SceneObjectExtension;
        getLoaderUpdaterForAsset(asset: any): ui.sceneobjects.LoaderUpdaterExtension;
        compileAll(): Promise<void>;
    }
}
declare namespace phasereditor2d.scene.core {
    import core = colibri.core;
    const CONTENT_TYPE_SCENE = "phasereditor2d.core.scene.SceneContentType";
    class SceneContentTypeResolver extends core.ContentTypeResolver {
        constructor();
        computeContentType(file: core.io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class CodeDOM {
        private _offset;
        getOffset(): number;
        setOffset(offset: number): void;
        static toHex(n: number): string;
        static quote(s: string): string;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class AssignPropertyCodeDOM extends CodeDOM {
        private _propertyName;
        private _propertyValueExpr;
        private _contextExpr;
        private _propertyType;
        constructor(propertyName: string, contentExpr: string);
        value(expr: string): void;
        valueLiteral(expr: string): void;
        valueFloat(n: number): void;
        valueInt(n: number): void;
        valueBool(b: boolean): void;
        getPropertyName(): string;
        getContextExpr(): string;
        getPropertyValueExpr(): string;
        getPropertyType(): string;
        setPropertyType(propertyType: string): void;
    }
}
declare namespace phasereditor2d.scene.core.code {
    abstract class BaseCodeGenerator {
        private _text;
        private _replace;
        private _indent;
        constructor();
        getOffset(): number;
        generate(replace: string): string;
        protected abstract internalGenerate(): void;
        length(): number;
        getStartSectionContent(endTag: string, defaultContent: string): string;
        getSectionContent(openTag: string, closeTag: string, defaultContent: string): string;
        getReplaceContent(): string;
        userCode(text: string): void;
        sectionStart(endTag: string, defaultContent: string): void;
        sectionEnd(openTag: string, defaultContent: string): void;
        section(openTag: string, closeTag: string, defaultContent: string): void;
        cut(start: number, end: number): string;
        trim(run: () => void): void;
        append(str: string): void;
        join(list: string[]): void;
        line(line?: string): void;
        static escapeStringLiterals(str: string): string;
        openIndent(line?: string): void;
        closeIndent(str?: string): void;
        getIndentTabs(): string;
        static emptyStringToNull(str: string): string;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class MemberDeclCodeDOM extends CodeDOM {
        private _name;
        constructor(name: string);
        getName(): string;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class ClassDeclCodeDOM extends MemberDeclCodeDOM {
        private _body;
        private _constructor;
        private _superClass;
        constructor(name: string);
        getConstructor(): MethodDeclCodeDOM;
        setConstructor(constructor: MethodDeclCodeDOM): void;
        getSuperClass(): string;
        setSuperClass(superClass: string): void;
        getBody(): MemberDeclCodeDOM[];
    }
}
declare namespace phasereditor2d.scene.core.code {
    function isAlphaNumeric(c: string): boolean;
    function formatToValidVarName(name: string): string;
}
declare namespace phasereditor2d.scene.core.code {
    class FieldDeclCodeDOM extends MemberDeclCodeDOM {
        private _type;
        private _publicScope;
        constructor(name: string, type: string, publicScope?: boolean);
        isPublic(): boolean;
        getType(): string;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class JavaScriptUnitCodeGenerator extends BaseCodeGenerator {
        private _unit;
        constructor(unit: UnitCodeDOM);
        protected internalGenerate(): void;
        private generateUnitElement;
        private generateClass;
        protected generateMemberDecl(memberDecl: MemberDeclCodeDOM): void;
        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM): void;
        private generateMethodDecl;
        protected generateMethodDeclArgs(methodDecl: MethodDeclCodeDOM): void;
        private generateInstr;
        private generateAssignProperty;
        protected generateTypeAnnotation(assign: AssignPropertyCodeDOM): void;
        private generateMethodCall;
        private generateRawCode;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class MethodCallCodeDOM extends CodeDOM {
        private _methodName;
        private _contextExpr;
        private _args;
        private _returnToVar;
        private _declareReturnToVar;
        private _declareReturnToField;
        private _isConstructor;
        constructor(methodName: string, contextExpr?: string);
        isConstructor(): boolean;
        setConstructor(isConstructor: boolean): void;
        getReturnToVar(): string;
        setReturnToVar(returnToVar: string): void;
        setDeclareReturnToVar(declareReturnToVar: boolean): void;
        isDeclareReturnToVar(): boolean;
        setDeclareReturnToField(declareReturnToField: boolean): void;
        isDeclareReturnToField(): boolean;
        arg(expr: string): void;
        argLiteral(expr: string): void;
        argFloat(n: number): void;
        argInt(n: number): void;
        getMethodName(): string;
        setMethodName(methodName: string): void;
        getContextExpr(): string;
        getArgs(): string[];
    }
}
declare namespace phasereditor2d.scene.core.code {
    interface IArgCodeDOM {
        name: string;
        type: string;
        optional: boolean;
    }
    class MethodDeclCodeDOM extends MemberDeclCodeDOM {
        private _body;
        private _args;
        constructor(name: string);
        addArg(name: string, type: string, optional?: boolean): void;
        getArgs(): IArgCodeDOM[];
        getBody(): CodeDOM[];
        setBody(body: CodeDOM[]): void;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class RawCodeDOM extends CodeDOM {
        private _code;
        constructor(code: string);
        getCode(): string;
    }
}
declare namespace phasereditor2d.scene.core.code {
    import io = colibri.core.io;
    class SceneCodeDOMBuilder {
        private _scene;
        private _isPrefabScene;
        private _file;
        constructor(scene: ui.Scene, file: io.FilePath);
        build(): Promise<UnitCodeDOM>;
        private buildClassFields;
        private buildPrefabConstructorMethod;
        private buildCreateMethod;
        private addCreateObjectCode;
        private buildSetObjectProperties;
        private addChildrenObjects;
        private buildSceneConstructorMethod;
        private buildPreloadMethod;
    }
}
declare namespace phasereditor2d.scene.core.code {
    import io = colibri.core.io;
    class SceneCompiler {
        private _scene;
        private _sceneFile;
        constructor(scene: ui.Scene, sceneFile: io.FilePath);
        compile(): Promise<void>;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class TypeScriptUnitCodeGenerator extends JavaScriptUnitCodeGenerator {
        constructor(unit: UnitCodeDOM);
        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM): void;
        protected generateTypeAnnotation(assign: AssignPropertyCodeDOM): void;
        protected generateMethodDeclArgs(methodDecl: MethodDeclCodeDOM): void;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class UnitCodeDOM {
        private _body;
        constructor(elements: object[]);
        getBody(): object[];
        setBody(body: object[]): void;
    }
}
declare namespace phasereditor2d.scene.core.json {
    interface IObjectData {
        id: string;
        type?: string;
        prefabId?: string;
        label: string;
        unlock?: string[];
    }
}
declare namespace phasereditor2d.scene.core.json {
    enum SceneType {
        SCENE = "SCENE",
        PREFAB = "PREFAB"
    }
    type SceneData = {
        id: string;
        sceneType: SceneType;
        settings: object;
        displayList: IObjectData[];
        meta: {
            app: string;
            url: string;
            contentType: string;
        };
    };
}
declare namespace phasereditor2d.scene.core.json {
    import io = colibri.core.io;
    import controls = colibri.ui.controls;
    class SceneFinderPreloader extends colibri.ui.ide.PreloadProjectResourcesExtension {
        private _finder;
        constructor(finder: SceneFinder);
        computeTotal(): Promise<number>;
        preload(monitor: controls.IProgressMonitor): Promise<void>;
    }
    export class SceneFinder {
        private _dataMap;
        private _sceneDataMap;
        private _fileMap;
        private _files;
        constructor();
        private handleStorageChange;
        getProjectPreloader(): SceneFinderPreloader;
        preload(monitor: controls.IProgressMonitor): Promise<void>;
        getFiles(): io.FilePath[];
        getPrefabData(prefabId: string): IObjectData;
        getPrefabFile(prefabId: string): io.FilePath;
        getSceneData(file: io.FilePath): SceneData;
    }
    export {};
}
declare namespace phasereditor2d.scene.core.json {
    enum SourceLang {
        JAVA_SCRIPT = "JAVA_SCRIPT",
        TYPE_SCRIPT = "TYPE_SCRIPT"
    }
    class SceneSettings {
        sceneType: SceneType;
        snapEnabled: boolean;
        snapWidth: number;
        snapHeight: number;
        onlyGenerateMethods: boolean;
        superClassName: string;
        preloadMethodName: string;
        preloadPackFiles: string[];
        createMethodName: string;
        sceneKey: string;
        compilerOutputLanguage: SourceLang;
        scopeBlocksToFolder: boolean;
        borderX: number;
        borderY: number;
        borderWidth: number;
        borderHeight: number;
        constructor(sceneType?: SceneType, snapEnabled?: boolean, snapWidth?: number, snapHeight?: number, onlyGenerateMethods?: boolean, superClassName?: string, preloadMethodName?: string, preloadPackFiles?: string[], createMethodName?: string, sceneKey?: string, compilerOutputLanguage?: SourceLang, scopeBlocksToFolder?: boolean, borderX?: number, borderY?: number, borderWidth?: number, borderHeight?: number);
        toJSON(): {};
        readJSON(data: object): void;
    }
}
declare namespace phasereditor2d.scene.core.json {
    class SceneWriter {
        private _scene;
        constructor(scene: ui.Scene);
        toJSON(): SceneData;
        toString(): string;
    }
}
declare namespace phasereditor2d.scene.core.json {
    interface ISerializable {
        writeJSON(ser: Serializer): void;
        readJSON(ser: Serializer): void;
    }
}
declare namespace phasereditor2d.scene.core.json {
    class Serializer {
        private _data;
        private _prefabSer;
        constructor(data: IObjectData);
        getSerializer(data: IObjectData): Serializer;
        getData(): IObjectData;
        getType(): any;
        getPhaserType(): any;
        private getDefaultValue;
        isUnlocked(name: string): boolean;
        isPrefabInstance(): boolean;
        write(name: string, value: any, defValue?: any): void;
        read(name: string, defValue?: any): any;
    }
}
declare namespace Phaser.Cameras.Scene2D {
    interface Camera {
        getScreenPoint(worldX: number, worldY: number): Phaser.Math.Vector2;
        getWorldPoint2(screenX: number, screenY: number): Phaser.Math.Vector2;
    }
}
declare namespace phasereditor2d.scene.ui {
}
declare namespace phasereditor2d.scene.ui {
    class Scene extends Phaser.Scene {
        private _id;
        private _inEditor;
        private _maker;
        private _settings;
        private _packCache;
        constructor(inEditor?: boolean);
        protected registerDestroyListener(name: string): void;
        getPackCache(): pack.core.parsers.AssetPackCache;
        destroyGame(): void;
        getPrefabObject(): sceneobjects.ISceneObject;
        getSettings(): core.json.SceneSettings;
        getId(): string;
        setId(id: string): void;
        getSceneType(): core.json.SceneType;
        isPrefabSceneType(): boolean;
        setSceneType(sceneType: core.json.SceneType): void;
        getMaker(): SceneMaker;
        getDisplayListChildren(): sceneobjects.ISceneObject[];
        visit(visitor: (obj: sceneobjects.ISceneObject) => void): void;
        makeNewName(baseName: string): string;
        getByEditorId(id: string): any;
        static findByEditorId(list: sceneobjects.ISceneObject[], id: string): any;
        getCamera(): Phaser.Cameras.Scene2D.Camera;
        create(): void;
    }
}
declare namespace phasereditor2d.scene.ui {
    class OfflineScene extends Scene {
        static createScene(data: core.json.SceneData): Promise<OfflineScene>;
        private _data;
        private _callback;
        private constructor();
        setCallback(callback: () => void): void;
        create(): Promise<void>;
    }
}
declare namespace phasereditor2d.scene.ui {
    import io = colibri.core.io;
    import json = core.json;
    class SceneMaker {
        private _scene;
        private _packFinder;
        constructor(scene: Scene);
        static acceptDropFile(dropFile: io.FilePath, editorFile: io.FilePath): any;
        static isValidSceneDataFormat(data: json.SceneData): boolean;
        getPackFinder(): pack.core.PackFinder;
        preload(): Promise<void>;
        buildDependenciesHash(): Promise<string>;
        isPrefabFile(file: io.FilePath): boolean;
        createPrefabInstanceWithFile(file: io.FilePath): Promise<sceneobjects.ISceneObject>;
        getSerializer(data: json.IObjectData): json.Serializer;
        createScene(sceneData: json.SceneData): void;
        updateSceneLoader(sceneData: json.SceneData): Promise<void>;
        createObject(data: json.IObjectData): sceneobjects.ISceneObject;
    }
}
declare namespace phasereditor2d.scene.ui {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class SceneThumbnail implements controls.IImage {
        private _file;
        private _image;
        private _promise;
        constructor(file: io.FilePath);
        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;
        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
        getWidth(): number;
        getHeight(): number;
        preloadSize(): Promise<controls.PreloadResult>;
        preload(): Promise<controls.PreloadResult>;
        private createImageElement;
    }
}
declare namespace phasereditor2d.scene.ui {
    import controls = colibri.ui.controls;
    import core = colibri.core;
    class SceneThumbnailCache extends core.io.FileContentCache<controls.IImage> {
        static _instance: SceneThumbnailCache;
        static getInstance(): SceneThumbnailCache;
        private constructor();
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    class SceneEditorBlocksCellRendererProvider extends pack.ui.viewers.AssetPackCellRendererProvider {
        constructor();
        getCellRenderer(element: any): colibri.ui.controls.viewers.ICellRenderer;
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    class SceneEditorBlocksContentProvider extends pack.ui.viewers.AssetPackContentProvider {
        private _getPacks;
        private _editor;
        constructor(sceneEditor: editor.SceneEditor, getPacks: () => pack.core.AssetPack[]);
        getPackItems(): pack.core.AssetPackItem[];
        getRoots(input: any): any[];
        getSceneFiles(): colibri.core.io.FilePath[];
        getChildren(parent: any): any[];
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    class SceneEditorBlocksLabelProvider extends pack.ui.viewers.AssetPackLabelProvider {
        getLabel(obj: any): string;
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    import controls = colibri.ui.controls;
    class SceneEditorBlocksPropertyProvider extends pack.ui.properties.AssetPackPreviewPropertyProvider {
        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void;
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    class SceneEditorBlocksProvider extends ide.EditorViewerProvider {
        private _editor;
        private _packs;
        constructor(editor: editor.SceneEditor);
        preload(): Promise<void>;
        prepareViewerState(state: controls.viewers.ViewerState): void;
        private getFreshItems;
        private getFreshItem;
        getContentProvider(): controls.viewers.ITreeContentProvider;
        getLabelProvider(): controls.viewers.ILabelProvider;
        getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): SceneEditorBlocksTreeRendererProvider;
        getUndoManager(): editor.SceneEditor;
        getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        getInput(): this;
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    import controls = colibri.ui.controls;
    const PREFAB_SECTION = "Prefab";
    class SceneEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {
        constructor(viewer: controls.viewers.TreeViewer);
        prepareContextForText(args: controls.viewers.RenderCellArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.blocks {
    import controls = colibri.ui.controls;
    class SceneEditorBlocksTreeRendererProvider_Compact extends pack.ui.viewers.AssetPackTreeViewerRenderer {
        constructor(viewer: controls.viewers.TreeViewer);
        prepareContextForText(args: controls.viewers.RenderCellArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.dialogs {
    class NewPrefabFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {
        createFileContent(): string;
        constructor();
        getInitialFileLocation(): colibri.core.io.FilePath;
    }
}
declare namespace phasereditor2d.scene.ui.dialogs {
    class NewSceneFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {
        constructor();
        createFileContent(): string;
        getInitialFileLocation(): colibri.core.io.FilePath;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class ActionManager {
        private _editor;
        constructor(editor: SceneEditor);
        deleteObjects(): void;
        joinObjectsInContainer(): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    interface ICameraState {
        scrollX: number;
        scrollY: number;
        zoom: number;
    }
    class CameraManager {
        private _editor;
        private _dragStartPoint;
        private _dragStartCameraScroll;
        private _state;
        constructor(editor: SceneEditor);
        private getCamera;
        private onMouseDown;
        private onMouseMove;
        private updateState;
        private onMouseUp;
        private onWheel;
        getState(): ICameraState;
        setState(state: editor.ICameraState): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class DropManager {
        private _editor;
        constructor(editor: SceneEditor);
        onDragDrop_async(e: DragEvent): Promise<void>;
        private createWithDropEvent;
        private onDragOver;
        private acceptDropData;
        private acceptDropDataArray;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class MouseManager {
        private _editor;
        private _toolInAction;
        constructor(editor: SceneEditor);
        private createArgs;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private onClick;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class OverlayLayer {
        private _editor;
        private _canvas;
        private _ctx;
        constructor(editor: SceneEditor);
        getCanvas(): HTMLCanvasElement;
        private resetContext;
        resizeTo(): void;
        render(): void;
        private renderTools;
        private renderSelection;
        private renderGrid;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    interface IEditorState {
        cameraState: ICameraState;
    }
    export class SceneEditor extends colibri.ui.ide.FileEditor {
        private _blocksProvider;
        private _outlineProvider;
        private _propertyProvider;
        private _game;
        private _overlayLayer;
        private _gameCanvas;
        private _scene;
        private _dropManager;
        private _cameraManager;
        private _selectionManager;
        private _actionManager;
        private _toolsManager;
        private _mouseManager;
        private _gameBooted;
        private _sceneRead;
        private _currentRefreshHash;
        private _editorState;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        openSourceFileInEditor(): void;
        doSave(): Promise<void>;
        compile(): Promise<void>;
        saveState(state: IEditorState): void;
        restoreState(state: IEditorState): void;
        protected onEditorInputContentChanged(): void;
        setInput(file: io.FilePath): void;
        protected createPart(): void;
        private createGame;
        private updateTitleIcon;
        getIcon(): controls.IImage;
        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager;
        private readScene;
        getSelectedGameObjects(): sceneobjects.ISceneObject[];
        getToolsManager(): tools.SceneToolsManager;
        getActionManager(): ActionManager;
        getSelectionManager(): SelectionManager;
        getOverlayLayer(): OverlayLayer;
        getGameCanvas(): HTMLCanvasElement;
        getScene(): Scene;
        getGame(): Phaser.Game;
        getSceneMaker(): SceneMaker;
        getPackFinder(): pack.core.PackFinder;
        layout(): void;
        getPropertyProvider(): properties.SceneEditorSectionProvider;
        onPartClosed(): boolean;
        refreshScene(): Promise<void>;
        private buildDependenciesHash;
        refreshDependenciesHash(): Promise<void>;
        onPartActivated(): Promise<void>;
        getEditorViewerProvider(key: string): blocks.SceneEditorBlocksProvider | outline.SceneEditorOutlineProvider;
        getOutlineProvider(): outline.SceneEditorOutlineProvider;
        refreshOutline(): void;
        private onGameBoot;
        repaint(): void;
        snapPoint(x: number, y: number): {
            x: number;
            y: number;
        };
    }
    export {};
}
declare namespace phasereditor2d.scene.ui.editor {
    class SelectionManager {
        private _editor;
        constructor(editor: SceneEditor);
        clearSelection(): void;
        refreshSelection(): void;
        selectAll(): void;
        private updateOutlineSelection;
        onMouseClick(e: MouseEvent): void;
        hitTestOfActivePointer(): Phaser.GameObjects.GameObject[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.commands {
    const CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
    const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
    const CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
    const CMD_COMPILE_ALL_SCENE_FILES = "phasereditor2d.scene.ui.editor.commands.CompileAllSceneFiles";
    const CMD_MOVE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.MoveSceneObject";
    const CMD_ROTATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.RotateSceneObject";
    const CMD_SCALE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ScaleSceneObject";
    class SceneEditorCommands {
        static registerCommands(manager: colibri.ui.ide.commands.CommandManager): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: sceneobjects.ISceneObject): any[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineLabelProvider implements controls.viewers.ILabelProvider {
        getLabel(obj: any): string;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    class SceneEditorOutlineProvider extends ide.EditorViewerProvider {
        private _editor;
        constructor(editor: SceneEditor);
        getUndoManager(): ide.undo.UndoManager;
        getContentProvider(): controls.viewers.ITreeContentProvider;
        getLabelProvider(): controls.viewers.ILabelProvider;
        getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        getInput(): SceneEditor;
        preload(): Promise<void>;
        onViewerSelectionChanged(selection: any[]): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineRendererProvider implements controls.viewers.ICellRendererProvider {
        getCellRenderer(element: any): controls.viewers.ICellRenderer;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {
        constructor(viewer: controls.viewers.TreeViewer);
        prepareContextForText(args: controls.viewers.RenderCellArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    abstract class BaseSceneSection<T> extends colibri.ui.controls.properties.PropertySection<T> {
        protected getHelp(key: string): string;
        protected getScene(): T;
        getEditor(): SceneEditor;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    abstract class SceneSection extends BaseSceneSection<Scene> {
        protected getScene(): Scene;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
        protected getSettings(): core.json.SceneSettings;
        getHelp(key: string): string;
        createStringField(comp: HTMLElement, name: string, label: string, tooltip: string): {
            label: HTMLLabelElement;
            text: HTMLInputElement;
        };
        createIntegerField(comp: HTMLElement, name: string, label: string, tooltip: string): {
            label: HTMLLabelElement;
            text: HTMLInputElement;
        };
        createMenuField(comp: HTMLElement, items: Array<{
            name: string;
            value: any;
        }>, name: string, label: string, tooltip: string): void;
        createBooleanField(comp: HTMLElement, name: string, label?: HTMLLabelElement): HTMLInputElement;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class BorderSection extends SceneSection {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    import ide = colibri.ui.ide;
    abstract class SceneEditorOperation extends ide.undo.Operation {
        protected _editor: SceneEditor;
        constructor(editor: SceneEditor);
        getEditor(): SceneEditor;
        getScene(): Scene;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    class ChangeSettingsPropertyOperation extends undo.SceneEditorOperation {
        private _name;
        private _value;
        private _oldValue;
        private _repaint;
        constructor(args: {
            editor: SceneEditor;
            name: string;
            value: any;
            repaint: boolean;
        });
        private setValue;
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class CompilerSection extends SceneSection {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        private createPreloadPackFilesField;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
        private _editor;
        constructor(editor: SceneEditor);
        getEmptySelectionObject(): Scene;
        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    type GetPropertySection = (page: controls.properties.PropertyPage) => BaseSceneSection<any>;
    class SceneEditorPropertySectionExtension extends colibri.Extension {
        static POINT_ID: string;
        private _sectionProviders;
        constructor(...sectionProviders: GetPropertySection[]);
        getSectionProviders(): GetPropertySection[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SnappingSection extends SceneSection {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    abstract class SceneToolItem {
        abstract render(args: ISceneToolRenderArgs): any;
        abstract containsPoint(args: ISceneToolDragEventArgs): boolean;
        abstract onStartDrag(args: ISceneToolDragEventArgs): void;
        abstract onDrag(args: ISceneToolDragEventArgs): void;
        abstract onStopDrag(args: ISceneToolDragEventArgs): void;
        protected getScreenPointOfObject(args: ISceneToolContextArgs, obj: any, fx: number, fy: number): Phaser.Math.Vector2;
        protected getScreenToObjectScale(args: ISceneToolContextArgs, obj: any): {
            x: number;
            y: number;
        };
        protected globalAngle(sprite: Phaser.GameObjects.Sprite): number;
        protected drawArrowPath(ctx: CanvasRenderingContext2D, color: string): void;
        protected drawCircle(ctx: CanvasRenderingContext2D, color: string): void;
        protected drawRect(ctx: CanvasRenderingContext2D, color: string): void;
        protected getAvgScreenPointOfObjects(args: ISceneToolContextArgs, fx?: (ob: Phaser.GameObjects.Sprite) => number, fy?: (ob: Phaser.GameObjects.Sprite) => number): Phaser.Math.Vector2;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    abstract class PointToolItem extends SceneToolItem implements ISceneToolItemXY {
        private _color;
        constructor(color: string);
        abstract getPoint(args: ISceneToolContextArgs): {
            x: number;
            y: number;
        };
        render(args: ISceneToolRenderArgs): void;
        containsPoint(args: ISceneToolDragEventArgs): boolean;
        onStartDrag(args: ISceneToolDragEventArgs): void;
        onDrag(args: ISceneToolDragEventArgs): void;
        onStopDrag(args: ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    class CenterPointToolItem extends PointToolItem {
        constructor(color: string);
        getPoint(args: ISceneToolContextArgs): {
            x: number;
            y: number;
        };
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    interface ISceneToolItemXY {
        getPoint(args: ISceneToolContextArgs): {
            x: number;
            y: number;
        };
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    class LineToolItem extends SceneToolItem {
        private _tools;
        private _color;
        constructor(color: string, ...tools: ISceneToolItemXY[]);
        render(args: ISceneToolRenderArgs): void;
        containsPoint(args: ISceneToolDragEventArgs): boolean;
        onStartDrag(args: ISceneToolDragEventArgs): void;
        onDrag(args: ISceneToolDragEventArgs): void;
        onStopDrag(args: ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    import ISceneObject = ui.sceneobjects.ISceneObject;
    interface ISceneToolContextArgs {
        editor: SceneEditor;
        camera: Phaser.Cameras.Scene2D.Camera;
        objects: ISceneObject[];
    }
    interface ISceneToolRenderArgs extends ISceneToolContextArgs {
        canvasContext: CanvasRenderingContext2D;
    }
    interface ISceneToolDragEventArgs extends ISceneToolContextArgs {
        x: number;
        y: number;
    }
    abstract class SceneTool {
        private _id;
        private _items;
        constructor(id: string);
        getId(): string;
        getItems(): SceneToolItem[];
        addItems(...items: SceneToolItem[]): void;
        abstract canEdit(obj: unknown): boolean;
        render(args: ISceneToolRenderArgs): void;
        containsPoint(args: ISceneToolDragEventArgs): boolean;
        onStartDrag(args: ISceneToolDragEventArgs): void;
        onDrag(args: ISceneToolDragEventArgs): void;
        onStopDrag(args: ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    class SceneToolExtension extends colibri.Extension {
        static POINT_ID: string;
        private _tools;
        constructor(...tools: SceneTool[]);
        getTools(): SceneTool[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    abstract class SceneToolOperation<TValue> extends undo.SceneEditorOperation {
        private _objects;
        private _values0;
        private _values1;
        constructor(toolArgs: editor.tools.ISceneToolContextArgs);
        execute(): void;
        abstract getInitialValue(obj: any): TValue;
        abstract getFinalValue(obj: any): TValue;
        abstract setValue(obj: any, value: TValue): any;
        private setValues;
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.tools {
    class SceneToolsManager {
        private _editor;
        private _activeTool;
        private _tools;
        constructor(editor: SceneEditor);
        findTool(toolId: string): SceneTool;
        getActiveTool(): SceneTool;
        setActiveTool(tool: SceneTool): void;
        swapTool(toolId: string): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class AddObjectsOperation extends SceneEditorOperation {
        private _dataList;
        constructor(editor: SceneEditor, objects: sceneobjects.ISceneObject[]);
        undo(): void;
        redo(): void;
        private updateEditor;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class JoinObjectsInContainerOperation extends SceneEditorOperation {
        private _containerId;
        private _objectsIdList;
        constructor(editor: SceneEditor, container: sceneobjects.Container);
        undo(): void;
        redo(): void;
        private updateEditor;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class RemoveObjectsOperation extends AddObjectsOperation {
        constructor(editor: SceneEditor, objects: sceneobjects.ISceneObject[]);
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface IBuildDependencyHashArgs {
        builder: ide.core.MultiHashBuilder;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface ISetObjectPropertiesCodeDOMArgs {
        result: core.code.CodeDOM[];
        objectVarName: string;
        prefabSerializer: core.json.Serializer;
    }
    abstract class Component<T> implements core.json.ISerializable {
        private _obj;
        constructor(obj: T);
        getObject(): T;
        write(ser: core.json.Serializer, ...properties: Array<IProperty<T>>): void;
        read(ser: core.json.Serializer, ...properties: Array<IProperty<T>>): void;
        writeLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>): void;
        readLocal(ser: core.json.Serializer, ...properties: Array<IProperty<T>>): void;
        protected buildSetObjectPropertyCodeDOM_Float(fieldName: string, value: number, defValue: number, args: ISetObjectPropertiesCodeDOMArgs): void;
        buildDependenciesHash(args: IBuildDependencyHashArgs): Promise<void>;
        abstract buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;
        abstract writeJSON(ser: core.json.Serializer): void;
        abstract readJSON(ser: core.json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    import json = core.json;
    enum ObjectScope {
        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC"
    }
    abstract class EditorSupport<T extends ISceneObject> {
        private _extension;
        private _object;
        private _prefabId;
        private _label;
        private _scope;
        private _scene;
        private _serializables;
        private _components;
        private _unlockedProperties;
        constructor(extension: SceneObjectExtension, obj: T);
        isUnlockedProperty(propName: string): boolean;
        setUnlockedProperty(propName: string, unlock: boolean): void;
        private static buildPrefabDependencyHash;
        buildDependencyHash(args: IBuildDependencyHashArgs): Promise<void>;
        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
        abstract getCellRenderer(): controls.viewers.ICellRenderer;
        getComponent(ctr: Function): Component<any>;
        hasComponent(ctr: Function): boolean;
        getComponents(): IterableIterator<Component<any>>;
        static getObjectComponent(obj: any, ctr: Function): Component<any>;
        protected addComponent(...components: Array<Component<any>>): void;
        protected setNewId(sprite: sceneobjects.ISceneObject): void;
        getExtension(): SceneObjectExtension;
        getObject(): T;
        getId(): string;
        setId(id: string): void;
        getLabel(): string;
        setLabel(label: string): void;
        getScope(): ObjectScope;
        setScope(scope: ObjectScope): void;
        getScene(): Scene;
        setScene(scene: Scene): void;
        isPrefabInstance(): boolean;
        getOwnerPrefabInstance(): ISceneObject;
        getPrefabId(): string;
        getPrefabName(): string;
        getPrefabData(): json.IObjectData;
        getPrefabSerializer(): json.Serializer;
        getObjectType(): any;
        getPhaserType(): any;
        getSerializer(data: json.IObjectData): json.Serializer;
        writeJSON(data: json.IObjectData): void;
        readJSON(data: json.IObjectData): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface IEnumProperty<T, TValue> extends IProperty<T> {
        values: TValue[];
        getValueLabel(value: TValue): string;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface IProperty<T> {
        getValue(obj: T): any;
        setValue(obj: T, value: any): void;
        name: string;
        defValue: any;
        label?: string;
        tooltip?: string;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface IPropertyXY {
        label: string;
        x: IProperty<any>;
        y: IProperty<any>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface ISceneObjectLike {
        getEditorSupport(): EditorSupport<ISceneObject>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    abstract class LoaderUpdaterExtension extends colibri.Extension {
        static POINT_ID: string;
        constructor();
        abstract acceptAsset(asset: any): boolean;
        abstract updateLoader(scene: Scene, asset: any): any;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ImageLoaderUpdater extends LoaderUpdaterExtension {
        acceptAsset(asset: any): boolean;
        updateLoader(scene: Scene, asset: any): Promise<void>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import code = core.code;
    /**
     * This class provides the methods to build the CodeDOM of the different aspects
     * of the code generation associated to game objects.
     *
     * Each object extension provides an instance of this class, that is used by the Scene compiler.
     */
    abstract class ObjectCodeDOMBuilder {
        /**
         * Build a method call CodeDOM to create the scene object of this extension,
         * using the factories provided by Phaser.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;
        /**
         * Build a CodeDOM expression to create a prefab instance that
         * has as root type the same type of this scene object type.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void;
        /**
         * Build the CodeDOM of the prefab class constructor.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void;
        /**
         * Build the CodeDOM of the super-method call in a prefab constructor.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface ISceneObject extends ISceneObjectLike, Phaser.GameObjects.GameObject {
        getEditorSupport(): EditorSupport<ISceneObject>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    import code = core.code;
    interface ICreateWithAssetArgs {
        x: number;
        y: number;
        scene: Scene;
        asset: any;
    }
    interface ICreateWithDataArgs {
        scene: Scene;
        data: json.IObjectData;
    }
    interface IGetAssetsFromObjectArgs {
        serializer: json.Serializer;
        scene: Scene;
        finder: pack.core.PackFinder;
    }
    interface IUpdateLoaderWithAsset {
        asset: any;
        scene: Scene;
    }
    interface IBuildObjectFactoryCodeDOMArgs {
        obj: ISceneObject;
        gameObjectFactoryExpr: string;
    }
    interface IBuildPrefabConstructorCodeDOMArgs {
        obj: ISceneObject;
        sceneExpr: string;
        methodCallDOM: code.MethodCallCodeDOM;
        prefabSerializer: json.Serializer;
    }
    interface IBuildPrefabConstructorDeclarationCodeDOM {
        ctrDeclCodeDOM: code.MethodDeclCodeDOM;
    }
    interface IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs {
        superMethodCallCodeDOM: code.MethodCallCodeDOM;
        prefabObj: ISceneObject;
    }
    abstract class SceneObjectExtension extends colibri.Extension {
        static POINT_ID: string;
        private _typeName;
        private _phaserTypeName;
        constructor(config: {
            typeName: string;
            phaserTypeName: string;
        });
        getTypeName(): string;
        getPhaserTypeName(): string;
        /**
         * Check if an object dropped into the scene can be used to create the scene object of this extension.
         *
         * @param data Data dropped from outside the scene editor. For example, items from the Blocks view.
         */
        abstract acceptsDropData(data: any): boolean;
        /**
         * Create the scene object of this extension with the data involved in a drop action.
         * The data was tested before with the `acceptsDropData()` method.
         *
         * @param args The data involved in a drop action.
         */
        abstract createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneObject;
        /**
         * Create the scene object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createSceneObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneObject;
        /**
         * Get the assets contained in a scene object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        abstract getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]>;
        /**
         * Gets a CodeDOM provider used by the Scene compiler to generate the object creation and prefab class codes.
         */
        abstract getCodeDOMBuilder(): ObjectCodeDOMBuilder;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    function SimpleProperty(name: string, defValue: any, label?: string, tooltip?: string): IProperty<any>;
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class Container extends Phaser.GameObjects.Container implements ISceneObject {
        private _editorSupport;
        constructor(scene: Scene, x: number, y: number, children: ISceneObject[]);
        getEditorSupport(): ContainerEditorSupport;
        get list(): ISceneObject[];
        set list(list: ISceneObject[]);
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import code = core.code;
    class ContainerCodeDOMBuilder extends ObjectCodeDOMBuilder {
        private static _instance;
        static getInstance(): ContainerCodeDOMBuilder;
        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void;
        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void;
        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void;
        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface IContainerData extends json.IObjectData {
        list: json.IObjectData[];
    }
    class ContainerEditorSupport extends EditorSupport<Container> {
        constructor(obj: Container);
        buildDependencyHash(args: IBuildDependencyHashArgs): Promise<void>;
        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer;
        writeJSON(containerData: IContainerData): void;
        readJSON(containerData: IContainerData): void;
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface IContainerData extends json.IObjectData {
        list: json.IObjectData[];
    }
    class ContainerExtension extends SceneObjectExtension {
        private static _instance;
        static getInstance(): ContainerExtension;
        private constructor();
        getCodeDOMBuilder(): ObjectCodeDOMBuilder;
        getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]>;
        createSceneObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneObject;
        private createContainerObject;
        createContainerObjectWithChildren(scene: Scene, objectList: sceneobjects.ISceneObject[]): sceneobjects.Container;
        acceptsDropData(data: any): boolean;
        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneObject;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class Image extends Phaser.GameObjects.Image implements ISceneObject {
        private _editorSupport;
        constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number);
        getEditorSupport(): ImageEditorSupport;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import code = core.code;
    class ImageCodeDOMBuilder extends ObjectCodeDOMBuilder {
        private static _instance;
        static getInstance(): ObjectCodeDOMBuilder;
        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void;
        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void;
        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void;
        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;
        private addArgsToCreateMethodDOM;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ImageEditorSupport extends EditorSupport<Image> {
        constructor(obj: Image);
        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer;
        getTextureComponent(): TextureComponent;
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ImageExtension extends SceneObjectExtension {
        private static _instance;
        static getInstance(): any;
        private constructor();
        getCodeDOMBuilder(): ObjectCodeDOMBuilder;
        getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]>;
        static isImageOrImageFrameAsset(data: any): boolean;
        acceptsDropData(data: any): boolean;
        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneObject;
        createSceneObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneObject;
        private createImageObject;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface IOriginLike extends ISceneObject {
        originX: number;
        originY: number;
        setOrigin(x: number, y: number): any;
    }
    class OriginComponent extends Component<IOriginLike> {
        static originX: IProperty<IOriginLike>;
        static originY: IProperty<IOriginLike>;
        static origin: IPropertyXY;
        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;
        readJSON(ser: json.Serializer): void;
        writeJSON(ser: json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    abstract class SceneObjectOperation<T extends ISceneObjectLike> extends editor.undo.SceneEditorOperation {
        private _objIdList;
        private _value;
        private _values1;
        private _values2;
        private _objects;
        constructor(editor: editor.SceneEditor, objects: T[], value: any);
        abstract getValue(obj: T): any;
        abstract setValue(obj: T, value: any): void;
        execute(): void;
        undo(): void;
        redo(): void;
        private update;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class SimpleOperation<T extends ISceneObjectLike> extends SceneObjectOperation<T> {
        private _property;
        constructor(editor: editor.SceneEditor, objects: T[], property: IProperty<T>, value: any);
        getValue(obj: T): any;
        setValue(obj: T, value: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface ITransformLikeObject extends ISceneObjectLike {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }
    class TransformComponent extends Component<ITransformLikeObject> {
        static x: IProperty<any>;
        static y: IProperty<any>;
        static position: IPropertyXY;
        static scaleX: IProperty<any>;
        static scaleY: IProperty<any>;
        static scale: IPropertyXY;
        static angle: IProperty<any>;
        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;
        readJSON(ser: json.Serializer): void;
        writeJSON(ser: json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class VariableComponent extends Component<ISceneObjectLike> {
        static label: IProperty<ISceneObjectLike>;
        static scope: IEnumProperty<ISceneObjectLike, ObjectScope>;
        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;
        writeJSON(ser: core.json.Serializer): void;
        readJSON(ser: core.json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    abstract class ObjectSceneSection<T extends ISceneObjectLike> extends editor.properties.BaseSceneSection<T> {
        protected createGridElementWithPropertiesXY(parent: HTMLElement): HTMLDivElement;
        protected createLock(parent: HTMLElement, ...properties: Array<IProperty<T>>): void;
        protected isUnlocked(...properties: Array<IProperty<T>>): boolean;
        protected createNumberPropertyRow(parent: HTMLElement, prop: IProperty<any>, fullWidth?: boolean): void;
        protected createPropertyXYRow(parent: HTMLElement, propXY: IPropertyXY, lockIcon?: boolean): void;
        createEnumField<TValue>(parent: HTMLElement, property: IEnumProperty<T, TValue>, checkUnlocked?: boolean): void;
        createFloatField(parent: HTMLElement, property: IProperty<T>): HTMLInputElement;
        createStringField(parent: HTMLElement, property: IProperty<T>, checkUnlock?: boolean): HTMLInputElement;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class OriginSection extends ObjectSceneSection<IOriginLike> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class PropertyUnlockOperation extends SceneObjectOperation<ISceneObjectLike> {
        private _properties;
        constructor(editor: editor.SceneEditor, objects: ISceneObjectLike[], properties: Array<IProperty<ISceneObjectLike>>, unlocked: boolean);
        getValue(obj: ISceneObjectLike): boolean;
        setValue(obj: ISceneObjectLike, unlocked: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class TransformSection extends ObjectSceneSection<sceneobjects.ITransformLikeObject> {
        constructor(page: colibri.ui.controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class VariableSection extends ObjectSceneSection<ISceneObjectLike> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class RotateLineToolItem extends editor.tools.SceneToolItem {
        private _start;
        constructor(start: boolean);
        render(args: editor.tools.ISceneToolRenderArgs): void;
        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean;
        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class RotateOperation extends editor.tools.SceneToolOperation<number> {
        getInitialValue(obj: any): number;
        getFinalValue(obj: any): number;
        setValue(obj: any, value: number): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class RotateTool extends editor.tools.SceneTool {
        static ID: string;
        constructor();
        canEdit(obj: unknown): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class RotateToolItem extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {
        static COLOR: string;
        private _initCursorPos;
        constructor();
        getPoint(args: editor.tools.ISceneToolContextArgs): {
            x: number;
            y: number;
        };
        render(args: editor.tools.ISceneToolRenderArgs): void;
        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean;
        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        static getInitialAngle(obj: any): number;
        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ScaleTool extends editor.tools.SceneTool {
        static ID: string;
        constructor();
        canEdit(obj: unknown): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    type IScaleAxis = 0 | 0.5 | 1;
    class ScaleToolItem extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {
        private _x;
        private _y;
        private _dragging;
        constructor(x: IScaleAxis, y: IScaleAxis);
        getPoint(args: editor.tools.ISceneToolContextArgs): {
            x: number;
            y: number;
        };
        render(args: editor.tools.ISceneToolRenderArgs): void;
        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean;
        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class TranslateOperation extends editor.tools.SceneToolOperation<{
        x: number;
        y: number;
    }> {
        getInitialValue(obj: any): {
            x: number;
            y: number;
        };
        getFinalValue(obj: any): {
            x: number;
            y: number;
        };
        setValue(obj: any, value: {
            x: number;
            y: number;
        }): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class TranslateTool extends editor.tools.SceneTool {
        static ID: string;
        constructor();
        canEdit(obj: unknown): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class TranslateToolItem extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {
        private _axis;
        private _initCursorPos;
        constructor(axis: "x" | "y" | "xy");
        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean;
        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        onDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        static getInitObjectPosition(obj: any): {
            x: number;
            y: number;
        };
        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void;
        getPoint(args: editor.tools.ISceneToolContextArgs): {
            x: number;
            y: number;
        };
        render(args: editor.tools.ISceneToolRenderArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ChangeTextureOperation extends SceneObjectOperation<ITextureLikeObject> {
        constructor(editor: editor.SceneEditor, objects: ITextureLikeObject[], value: ITextureKeys);
        getValue(obj: ITextureLikeObject): ITextureKeys;
        setValue(obj: ITextureLikeObject, value: ITextureKeys): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class TextureCellRenderer implements controls.viewers.ICellRenderer {
        renderCell(args: controls.viewers.RenderCellArgs): void;
        private getImage;
        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface ITextureLikeObject extends ISceneObject {
        setTexture(key: string, frame?: string | number): void;
    }
    interface ITextureKeys {
        key?: string;
        frame?: string | number;
    }
    interface ITextureData extends json.IObjectData {
        texture: ITextureKeys;
    }
    class TextureComponent extends Component<ITextureLikeObject> {
        static texture: IProperty<ITextureLikeObject>;
        private _textureKeys;
        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void;
        writeJSON(ser: json.Serializer): void;
        readJSON(ser: json.Serializer): void;
        getTextureKeys(): ITextureKeys;
        setTextureKeys(keys: ITextureKeys): void;
        removeTexture(): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class TextureSection extends ObjectSceneSection<ITextureLikeObject> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        private getSelectedFrames;
        getTextureComponent(obj: ITextureLikeObject): TextureComponent;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class TextureSelectionDialog extends controls.dialogs.ViewerDialog {
        private _finder;
        static createDialog(finder: pack.core.PackFinder, selected: pack.core.AssetPackImageFrame[], callback: (selection: pack.core.AssetPackImageFrame[]) => void): Promise<TextureSelectionDialog>;
        private _callback;
        private constructor();
        create(): void;
    }
}
declare namespace phasereditor2d.scene.ui.viewers {
    import controls = colibri.ui.controls;
    class SceneFileCellRenderer implements controls.viewers.ICellRenderer {
        renderCell(args: controls.viewers.RenderCellArgs): void;
        cellHeight(args: controls.viewers.RenderCellArgs): number;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
//# sourceMappingURL=phasereditor2d.scene.d.ts.map