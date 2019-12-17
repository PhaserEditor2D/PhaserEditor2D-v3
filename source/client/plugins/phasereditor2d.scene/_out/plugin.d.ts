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
declare namespace Phaser.Cameras.Scene2D {
    interface Camera {
        getScreenPoint(worldX: number, worldY: number): Phaser.Math.Vector2;
    }
}
declare namespace phasereditor2d.scene.ui {
}
declare namespace phasereditor2d.scene.ui {
    class GameScene extends Phaser.Scene {
        private _sceneType;
        private _inEditor;
        private _initialState;
        constructor(inEditor?: boolean);
        getDisplayListChildren(): gameobjects.EditorObject[];
        visit(visitor: (obj: gameobjects.EditorObject) => void): void;
        makeNewName(baseName: string): string;
        getByEditorId(id: string): any;
        static findByEditorId(list: gameobjects.EditorObject[], id: string): any;
        getSceneType(): json.SceneType;
        setSceneType(sceneType: json.SceneType): void;
        getCamera(): Phaser.Cameras.Scene2D.Camera;
        setInitialState(state: any): void;
        create(): void;
    }
}
declare namespace phasereditor2d.scene.ui {
    class SceneMaker {
        private _scene;
        constructor(scene: GameScene);
        createObject(objData: any): gameobjects.EditorObject;
        createContainerWithObjects(objects: gameobjects.EditorObject[]): gameobjects.EditorContainer;
        createWithDropEvent_async(e: DragEvent, dropDataArray: any[]): Promise<gameobjects.EditorObject[]>;
    }
}
declare namespace phasereditor2d.scene.ui {
    import controls = colibri.ui.controls;
    import core = colibri.core;
    class SceneThumbnail implements controls.IImage {
        private _file;
        private _image;
        private _promise;
        constructor(file: core.io.FilePath);
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
        constructor(getPacks: () => pack.core.AssetPack[]);
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
        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void;
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
        private _sceneMaker;
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
        getSelectedGameObjects(): gameobjects.EditorObject[];
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
    class GameObjectCellRenderer implements controls.viewers.ICellRenderer {
        renderCell(args: controls.viewers.RenderCellArgs): void;
        cellHeight(args: colibri.ui.controls.viewers.RenderCellArgs): number;
        preload(args: controls.viewers.PreloadCellArgs): Promise<colibri.ui.controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.scene.ui.editor.outline {
    import controls = colibri.ui.controls;
    class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
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
declare namespace phasereditor2d.scene.ui.editor.properties {
    abstract class SceneSection<T> extends colibri.ui.controls.properties.PropertySection<T> {
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class OriginSection extends SceneSection<gameobjects.EditorImage> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class TextureSection extends SceneSection<gameobjects.EditorImage> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    class TransformSection extends SceneSection<gameobjects.EditorImage> {
        constructor(page: colibri.ui.controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.scene.ui.editor.properties {
    import controls = colibri.ui.controls;
    class VariableSection extends SceneSection<gameobjects.EditorObject> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
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
        constructor(editor: SceneEditor, objects: gameobjects.EditorObject[]);
        undo(): void;
        redo(): void;
        private updateEditor;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class JoinObjectsInContainerOperation extends SceneEditorOperation {
        private _containerId;
        private _objectsIdList;
        constructor(editor: SceneEditor, container: gameobjects.EditorContainer);
        undo(): void;
        redo(): void;
        private updateEditor;
    }
}
declare namespace phasereditor2d.scene.ui.editor.undo {
    class RemoveObjectsOperation extends AddObjectsOperation {
        constructor(editor: SceneEditor, objects: gameobjects.EditorObject[]);
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    class EditorObjectMixin extends Phaser.GameObjects.GameObject {
        private _label;
        private _scene;
        getEditorId(): string;
        setEditorId(id: string): void;
        getEditorLabel(): string;
        setEditorLabel(label: string): void;
        getEditorScene(): GameScene;
        setEditorScene(scene: GameScene): void;
    }
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    class EditorContainer extends Phaser.GameObjects.Container implements EditorObject {
        static add(scene: Phaser.Scene, x: number, y: number, list: EditorObject[]): EditorContainer;
        get list(): EditorObject[];
        set list(list: EditorObject[]);
        writeJSON(data: any): void;
        readJSON(data: any): void;
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
    }
    interface EditorContainer extends EditorObjectMixin {
    }
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    class EditorImage extends Phaser.GameObjects.Image implements EditorObject {
        static add(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number): EditorImage;
        writeJSON(data: any): void;
        readJSON(data: any): void;
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
        setEditorTexture(key: string, frame: any): void;
        getEditorTexture(): {
            key: any;
            frame: any;
        };
    }
    interface EditorImage extends EditorObjectMixin {
    }
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    interface EditorObject extends Phaser.GameObjects.GameObject, json.ReadWriteJSON {
        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): any;
    }
    interface EditorObject extends EditorObjectMixin {
    }
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    function getContainerScreenBounds(container: EditorContainer, camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
}
declare namespace phasereditor2d.scene.ui.gameobjects {
    function getScreenBounds(sprite: EditorImage, camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];
}
declare namespace phasereditor2d.scene.ui.json {
    class ObjectComponent {
        static write(sprite: gameobjects.EditorObject, data: any): void;
        static read(sprite: gameobjects.EditorObject, data: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    interface ReadWriteJSON {
        writeJSON(data: any): void;
        readJSON(data: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    type SceneType = "Scene" | "Prefab";
    type SceneData = {
        sceneType: SceneType;
        displayList: any[];
        meta: {
            app: string;
            url: string;
            contentType: string;
        };
    };
}
declare namespace phasereditor2d.scene.ui.json {
    class SceneParser {
        private _scene;
        constructor(scene: GameScene);
        static isValidSceneDataFormat(data: SceneData): boolean;
        createScene(data: SceneData): void;
        createSceneCache_async(data: SceneData): Promise<void>;
        private updateSceneCacheWithObjectData_async;
        addToCache_async(data: pack.core.AssetPackItem | pack.core.AssetPackImageFrame): Promise<void>;
        createObject(data: any): gameobjects.EditorObject;
        static initSprite(sprite: Phaser.GameObjects.GameObject): void;
        static setNewId(sprite: gameobjects.EditorObject): void;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    class SceneWriter {
        private _scene;
        constructor(scene: GameScene);
        toJSON(): SceneData;
        toString(): string;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    class TextureComponent {
        static textureKey: string;
        static frameKey: string;
        static write(sprite: gameobjects.EditorImage, data: any): void;
        static read(sprite: gameobjects.EditorImage, data: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    type TransformLike = gameobjects.EditorImage | gameobjects.EditorContainer;
    class TransformComponent {
        static write(sprite: TransformLike, data: any): void;
        static read(sprite: TransformLike, data: any): void;
    }
}
declare namespace phasereditor2d.scene.ui.json {
    class VariableComponent {
        static write(sprite: gameobjects.EditorObject, data: any): void;
        static read(sprite: gameobjects.EditorObject, data: any): void;
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
//# sourceMappingURL=plugin.d.ts.map