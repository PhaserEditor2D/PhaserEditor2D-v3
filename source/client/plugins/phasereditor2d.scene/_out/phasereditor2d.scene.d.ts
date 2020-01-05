declare namespace phasereditor2d.scene {
    const ICON_GROUP = "group";
    const ICON_TRANSLATE = "translate";
    const ICON_ANGLE = "angle";
    const ICON_SCALE = "scale";
    const ICON_ORIGIN = "origin";
    class ScenePlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): ScenePlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        getObjectExtensions(): ui.sceneobjects.SceneObjectExtension[];
        getObjectExtensionByObjectType(type: string): ui.sceneobjects.SceneObjectExtension;
        getLoaderUpdaterForAsset(asset: any): ui.sceneobjects.LoaderUpdaterExtension;
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
    class AssignPropertyCodeDOM {
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
    class CodeDOM {
        private _offset;
        getOffset(): number;
        setOffset(offset: number): void;
        static toHex(n: number): string;
        static quote(s: string): string;
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
        private _members;
        private _constructor;
        private _superClass;
        constructor(name: string);
        getConstructor(): MethodDeclCodeDOM;
        setConstructor(constructor: MethodDeclCodeDOM): void;
        getSuperClass(): string;
        setSuperClass(superClass: string): void;
        getMembers(): MemberDeclCodeDOM[];
    }
}
declare namespace phasereditor2d.scene.core.code {
    class FieldDeclCodeDOM extends MemberDeclCodeDOM {
        private _type;
        constructor(name: string);
        getType(): string;
        setType(type: string): void;
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
        private generateMethodDecl;
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
        private _isConstructor;
        constructor(methodName: string, contextExpr?: string);
        isConstructor(): boolean;
        setConstructor(isConstructor: boolean): void;
        getReturnToVar(): string;
        setReturnToVar(returnToVar: string): void;
        setDeclareReturnToVar(declareReturnToVar: boolean): void;
        isDeclareReturnToVar(): boolean;
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
    class MethodDeclCodeDOM extends MemberDeclCodeDOM {
        private _instructions;
        constructor(name: string);
        getInstructions(): CodeDOM[];
        setInstructions(instructions: CodeDOM[]): void;
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
        private _file;
        constructor(scene: ui.GameScene, file: io.FilePath);
        build(): Promise<UnitCodeDOM>;
        private buildCreateMethod;
        private buildConstructorMethod;
        private buildPreloadMethod;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class TypeScriptUnitCodeGenerator extends JavaScriptUnitCodeGenerator {
        constructor(unit: UnitCodeDOM);
        protected generateMemberDecl(memberDecl: MemberDeclCodeDOM): void;
        protected generateTypeAnnotation(assign: AssignPropertyCodeDOM): void;
    }
}
declare namespace phasereditor2d.scene.core.code {
    class UnitCodeDOM {
        private _elements;
        constructor(elements: object[]);
        getElements(): object[];
        setElements(elements: object[]): void;
    }
}
declare namespace phasereditor2d.scene.core.json {
    interface ObjectData {
        id: string;
        type?: string;
        prefabId?: string;
    }
}
declare namespace phasereditor2d.scene.core.json {
    type SceneType = "Scene" | "Prefab";
    type SceneData = {
        id: string;
        sceneType: SceneType;
        displayList: ObjectData[];
        meta: {
            app: string;
            url: string;
            contentType: string;
        };
    };
}
declare namespace phasereditor2d.scene.core.json {
    import io = colibri.core.io;
    class SceneDataTable {
        private _dataMap;
        private _fileMap;
        constructor();
        preload(): Promise<void>;
        getPrefabData(prefabId: string): ObjectData;
        getPrefabFile(prefabId: string): io.FilePath;
    }
}
declare namespace phasereditor2d.scene.core.json {
    type SourceLang = "JavaScript" | "TypeScript";
    type MethodContextType = "Scene" | "Object";
    class SceneSettings {
        snapEnabled: boolean;
        snapWidth: number;
        snapHeight: number;
        onlyGenerateMethods: boolean;
        superClassName: string;
        preloadMethodName: string;
        createMethodName: string;
        sceneKey: string;
        compilerLang: SourceLang;
        scopeBlocksToFolder: boolean;
        methodContextType: MethodContextType;
        borderX: number;
        borderY: number;
        borderWidth: number;
        borderHeight: number;
        constructor(snapEnabled?: boolean, snapWidth?: number, snapHeight?: number, onlyGenerateMethods?: boolean, superClassName?: string, preloadMethodName?: string, createMethodName?: string, sceneKey?: string, compilerLang?: SourceLang, scopeBlocksToFolder?: boolean, methodContextType?: MethodContextType, borderX?: number, borderY?: number, borderWidth?: number, borderHeight?: number);
    }
}
declare namespace phasereditor2d.scene.core.json {
    class SceneWriter {
        private _scene;
        constructor(scene: ui.GameScene);
        toJSON(): SceneData;
        toString(): string;
    }
}
declare namespace phasereditor2d.scene.core.json {
    interface WriteArgs {
        data: ObjectData;
        table: SceneDataTable;
    }
    interface ReadArgs {
        data: ObjectData;
        table: SceneDataTable;
    }
    interface Serializable {
        writeJSON(ser: Serializer): void;
        readJSON(ser: Serializer): void;
    }
}
declare namespace phasereditor2d.scene.core.json {
    class Serializer {
        private _data;
        private _prefabSer;
        private _table;
        constructor(data: ObjectData, table: SceneDataTable);
        getSerializer(data: ObjectData): Serializer;
        getData(): ObjectData;
        getType(): any;
        private getDefaultValue;
        write(name: string, value: any, defValue?: any): void;
        read(name: string, defValue?: any): any;
    }
}
declare namespace Phaser.Cameras.Scene2D {
    interface Camera {
        getScreenPoint(worldX: number, worldY: number): Phaser.Math.Vector2;
    }
}
declare namespace phasereditor2d.scene.ui {
}
declare namespace phasereditor2d.scene.ui {
    class GameScene extends Phaser.Scene {
        private _id;
        private _sceneType;
        private _inEditor;
        private _initialState;
        private _maker;
        private _settings;
        constructor(inEditor?: boolean);
        getSettings(): core.json.SceneSettings;
        getId(): string;
        setId(id: string): void;
        getMaker(): SceneMaker;
        getDisplayListChildren(): sceneobjects.SceneObject[];
        visit(visitor: (obj: sceneobjects.SceneObject) => void): void;
        makeNewName(baseName: string): string;
        getByEditorId(id: string): any;
        static findByEditorId(list: sceneobjects.SceneObject[], id: string): any;
        getSceneType(): core.json.SceneType;
        setSceneType(sceneType: core.json.SceneType): void;
        getCamera(): Phaser.Cameras.Scene2D.Camera;
        setInitialState(state: any): void;
        create(): void;
    }
}
declare namespace phasereditor2d.scene.ui {
    import io = colibri.core.io;
    import json = core.json;
    class SceneMaker {
        private _scene;
        private _sceneDataTable;
        constructor(scene: GameScene);
        static isValidSceneDataFormat(data: json.SceneData): boolean;
        preload(): Promise<void>;
        isPrefabFile(file: io.FilePath): boolean;
        createPrefabInstanceWithFile(file: io.FilePath): Promise<sceneobjects.SceneObject>;
        getSceneDataTable(): json.SceneDataTable;
        getSerializer(data: json.ObjectData): json.Serializer;
        createScene(data: json.SceneData): void;
        updateSceneLoader(sceneData: json.SceneData): Promise<void>;
        createObject(data: json.ObjectData): sceneobjects.SceneObject;
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
    }
}
declare namespace phasereditor2d.scene.ui.dialogs {
    class NewSceneFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {
        constructor();
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
    class CameraManager {
        private _editor;
        private _dragStartPoint;
        private _dragStartCameraScroll;
        constructor(editor: SceneEditor);
        private getCamera;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private onWheel;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class DropManager {
        private _editor;
        constructor(editor: SceneEditor);
        onDragDrop_async(e: DragEvent): Promise<void>;
        private createWithDropEvent;
        private onDragOver;
        private acceptsDropData;
        private acceptsDropDataArray;
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
        private renderSelection;
        private renderGrid;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class SceneEditor extends colibri.ui.ide.FileEditor {
        private _blocksProvider;
        private _outlineProvider;
        private _propertyProvider;
        private _game;
        private _overlayLayer;
        private _gameCanvas;
        private _gameScene;
        private _dropManager;
        private _cameraManager;
        private _selectionManager;
        private _actionManager;
        private _gameBooted;
        private _sceneRead;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        doSave(): Promise<void>;
        saveState(state: any): void;
        restoreState(state: any): void;
        protected onEditorInputContentChanged(): void;
        setInput(file: io.FilePath): void;
        protected createPart(): void;
        private updateTitleIcon;
        getIcon(): controls.IImage;
        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager;
        private readScene;
        getSelectedGameObjects(): sceneobjects.SceneObject[];
        getActionManager(): ActionManager;
        getSelectionManager(): SelectionManager;
        getOverlayLayer(): OverlayLayer;
        getGameCanvas(): HTMLCanvasElement;
        getGameScene(): GameScene;
        getGame(): Phaser.Game;
        getSceneMaker(): SceneMaker;
        layout(): void;
        getPropertyProvider(): properties.SceneEditorSectionProvider;
        onPartActivated(): Promise<void>;
        getEditorViewerProvider(key: string): blocks.SceneEditorBlocksProvider | outline.SceneEditorOutlineProvider;
        getOutlineProvider(): outline.SceneEditorOutlineProvider;
        refreshOutline(): void;
        private onGameBoot;
        repaint(): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor {
    class SelectionManager {
        private _editor;
        constructor(editor: SceneEditor);
        clearSelection(): void;
        refreshSelection(): void;
        selectAll(): void;
        private updateOutlineSelection;
        private onMouseClick;
        hitTestOfActivePointer(): Phaser.GameObjects.GameObject[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.commands {
    class SceneEditorCommands {
        static registerCommands(manager: colibri.ui.ide.commands.CommandManager): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: sceneobjects.SceneObject): any[];
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
        private _editor;
        private _assetRendererProvider;
        constructor(editor: SceneEditor);
        getCellRenderer(element: any): controls.viewers.ICellRenderer;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {
        constructor(viewer: controls.viewers.TreeViewer);
        setTextColor(args: controls.viewers.RenderCellArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    type GetPropertySection = (page: controls.properties.PropertyPage) => SceneSection<any>;
    class SceneEditorPropertySectionExtension extends colibri.Extension {
        static POINT_ID: string;
        private _sectionProviders;
        constructor(...sectionProviders: GetPropertySection[]);
        getSectionProviders(): GetPropertySection[];
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    abstract class SceneSection<T> extends colibri.ui.controls.properties.PropertySection<T> {
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    import ide = colibri.ui.ide;
    abstract class SceneEditorOperation extends ide.undo.Operation {
        protected _editor: SceneEditor;
        constructor(editor: SceneEditor);
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class AddObjectsOperation extends SceneEditorOperation {
        private _dataList;
        constructor(editor: SceneEditor, objects: sceneobjects.SceneObject[]);
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
        constructor(editor: SceneEditor, objects: sceneobjects.SceneObject[]);
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    import json = core.json;
    abstract class EditorSupport<T extends SceneObject> {
        private _extension;
        private _object;
        private _prefabId;
        private _label;
        private _scene;
        private _serializables;
        private _components;
        constructor(extension: SceneObjectExtension, obj: T);
        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
        abstract getCellRenderer(): controls.viewers.ICellRenderer;
        getComponent(ctr: Function): any;
        hasComponent(ctr: Function): boolean;
        static getObjectComponent(obj: any, ctr: Function): any;
        protected addComponent(...components: any[]): void;
        protected setNewId(sprite: sceneobjects.SceneObject): void;
        getExtension(): SceneObjectExtension;
        getObject(): T;
        getId(): string;
        setId(id: string): void;
        getLabel(): string;
        setLabel(label: string): void;
        getScene(): GameScene;
        setScene(scene: GameScene): void;
        isPrefabInstance(): boolean;
        getOwnerPrefabInstance(): SceneObject;
        getPrefabId(): string;
        getPrefabName(): string;
        getObjectType(): any;
        writeJSON(ser: json.Serializer): void;
        readJSON(ser: json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    abstract class LoaderUpdaterExtension extends colibri.Extension {
        static POINT_ID: string;
        constructor();
        abstract acceptAsset(asset: any): boolean;
        abstract updateLoader(scene: GameScene, asset: any): any;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class ImageLoaderUpdater extends LoaderUpdaterExtension {
        acceptAsset(asset: any): boolean;
        updateLoader(scene: GameScene, asset: any): Promise<void>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    interface SceneObject extends Phaser.GameObjects.GameObject {
        getEditorSupport(): EditorSupport<SceneObject>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface CreateWithAssetArgs {
        x: number;
        y: number;
        nameMaker: colibri.ui.ide.utils.NameMaker;
        scene: GameScene;
        asset: any;
    }
    interface CreateWithDataArgs {
        scene: GameScene;
        data: json.ObjectData;
    }
    interface GetAssetsFromObjectArgs {
        serializer: json.Serializer;
        scene: GameScene;
        finder: pack.core.PackFinder;
    }
    interface UpdateLoaderWithAsset {
        asset: any;
        scene: GameScene;
    }
    interface BuildObjectFactoryCodeDOMArgs {
        obj: SceneObject;
        gameObjectFactoryExpr: string;
    }
    interface BuildPrefabConstructorCodeDOMArgs {
        obj: SceneObject;
        sceneExpr: string;
        methodCallDOM: core.code.MethodCallCodeDOM;
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
        abstract createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject;
        /**
         * Create the scene object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject;
        /**
         * Get the assets contained in a scene object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        abstract getAssetsFromObjectData(args: GetAssetsFromObjectArgs): Promise<any[]>;
        /**
         * Build a method call CodeDOM to create the scene object of this extension.
         * This method is used by the Scene compiler.
         *
         * @param obj The scene object to be created.
         */
        abstract buildAddObjectCodeDOM(args: BuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM;
        /**
         * Build a CodeDOM expression to create a prefab instance that
         * has as root type the same type of this scene object type.
         * This method is used by the Scene compiler.
         *
         * @param obj The scene object to be created.
         */
        abstract buildNewPrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class Container extends Phaser.GameObjects.Container implements SceneObject {
        private _editorSupport;
        constructor(scene: GameScene, x: number, y: number, children: SceneObject[]);
        getEditorSupport(): ContainerEditorSupport;
        get list(): SceneObject[];
        set list(list: SceneObject[]);
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface ContainerData extends json.ObjectData {
        list: json.ObjectData[];
    }
    class ContainerEditorSupport extends EditorSupport<Container> {
        constructor(obj: Container);
        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer;
        writeJSON(ser: json.Serializer): void;
        readJSON(ser: json.Serializer): void;
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    import code = core.code;
    interface ContainerData extends json.ObjectData {
        list: json.ObjectData[];
    }
    class ContainerExtension extends SceneObjectExtension {
        private static _instance;
        static getInstance(): ContainerExtension;
        private constructor();
        buildNewPrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs): void;
        buildAddObjectCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;
        getAssetsFromObjectData(args: GetAssetsFromObjectArgs): Promise<any[]>;
        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject;
        private createContainerObject;
        createContainerObjectWithChildren(scene: GameScene, objectList: sceneobjects.SceneObject[]): sceneobjects.Container;
        acceptsDropData(data: any): boolean;
        createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class Image extends Phaser.GameObjects.Image implements SceneObject {
        private _editorSupport;
        constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number);
        getEditorSupport(): ImageEditorSupport;
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
    import code = core.code;
    class ImageExtension extends SceneObjectExtension {
        private static _instance;
        static getInstance(): any;
        private constructor();
        buildNewPrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs): void;
        buildAddObjectCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;
        private addArgsToCreateMethodDOM;
        getAssetsFromObjectData(args: GetAssetsFromObjectArgs): Promise<any[]>;
        static isImageOrImageFrameAsset(data: any): boolean;
        acceptsDropData(data: any): boolean;
        createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject;
        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject;
        private createImageObject;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface IOriginLike {
        originX: number;
        originY: number;
    }
    class OriginComponent implements json.Serializable {
        private _obj;
        constructor(obj: IOriginLike);
        readJSON(ser: json.Serializer): void;
        writeJSON(ser: json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class OriginSection extends editor.properties.SceneSection<IOriginLike> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface ITransformLike {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }
    class TransformComponent implements json.Serializable {
        private _obj;
        constructor(obj: ITransformLike);
        getObject(): ITransformLike;
        readJSON(ser: json.Serializer): void;
        writeJSON(ser: json.Serializer): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    class TransformSection extends editor.properties.SceneSection<sceneobjects.ITransformLike> {
        constructor(page: colibri.ui.controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class VariableSection extends editor.properties.SceneSection<sceneobjects.SceneObject> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class TextureCellRenderer implements controls.viewers.ICellRenderer {
        renderCell(args: controls.viewers.RenderCellArgs): void;
        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number;
        preload(args: controls.viewers.PreloadCellArgs): Promise<colibri.ui.controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import json = core.json;
    interface TextureData extends json.ObjectData {
        textureKey: string;
        frameKey: string;
    }
    class TextureComponent implements json.Serializable {
        private _textureKey;
        private _textureFrameKey;
        private _obj;
        constructor(obj: Image);
        writeJSON(ser: json.Serializer): void;
        readJSON(ser: json.Serializer): void;
        getKey(): string;
        setKey(key: string): void;
        setTexture(key: string, frame: string | number): void;
        getTexture(): {
            key: string;
            frame: string | number;
        };
        getFrame(): string | number;
        setFrame(frame: string | number): void;
    }
}
declare namespace phasereditor2d.scene.ui.sceneobjects {
    import controls = colibri.ui.controls;
    class TextureSection extends editor.properties.SceneSection<sceneobjects.Image> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
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