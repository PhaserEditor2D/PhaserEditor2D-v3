
namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    class SceneEditorFactory extends colibri.ui.ide.EditorFactory {

        constructor() {
            super("phasereditor2d.SceneEditorFactory");
        }

        acceptInput(input: any): boolean {

            if (input instanceof io.FilePath) {

                const contentType = colibri.Platform.getWorkbench()
                    .getContentTypeRegistry().getCachedContentType(input);

                return contentType === core.CONTENT_TYPE_SCENE;
            }

            return false;
        }

        createEditor(): colibri.ui.ide.EditorPart {
            return new SceneEditor();
        }
    }

    interface IEditorState {

        cameraState: ICameraState;
        toolsState: tools.ISceneToolsState;
    }

    export class SceneEditor extends colibri.ui.ide.FileEditor {

        private _blocksProvider: blocks.SceneEditorBlocksProvider;
        private _outlineProvider: outline.SceneEditorOutlineProvider;
        private _propertyProvider: properties.SceneEditorSectionProvider;
        private _game: Phaser.Game;
        private _overlayLayer: OverlayLayer;
        private _gameCanvas: HTMLCanvasElement;
        private _scene: Scene;
        private _dropManager: DropManager;
        private _cameraManager: CameraManager;
        private _selectionManager: SelectionManager;
        private _actionManager: ActionManager;
        private _toolsManager: tools.SceneToolsManager;
        private _mouseManager: MouseManager;
        private _gameBooted: boolean;
        private _sceneRead: boolean;
        private _currentRefreshHash: string;
        private _editorState: IEditorState;

        static getFactory(): colibri.ui.ide.EditorFactory {
            return new SceneEditorFactory();
        }

        constructor() {
            super("phasereditor2d.SceneEditor");

            this.addClass("SceneEditor");

            this._blocksProvider = new blocks.SceneEditorBlocksProvider(this);
            this._outlineProvider = new outline.SceneEditorOutlineProvider(this);
            this._propertyProvider = new properties.SceneEditorSectionProvider(this);
        }

        openSourceFileInEditor(): void {

            const lang = this._scene.getSettings().compilerOutputLanguage;

            const ext = lang === json.SourceLang.JAVA_SCRIPT ? ".js" : ".ts";

            const file = this.getInput().getSibling(this.getInput().getNameWithoutExtension() + ext);

            if (file) {

                colibri.Platform.getWorkbench().openEditor(file);
            }
        }

        async doSave() {

            // compile first because the SceneFinder will be updated after the file is changed.

            await this.compile();

            // saves the file

            const sceneFile = this.getInput();

            const writer = new json.SceneWriter(this.getScene());

            const data = writer.toJSON();

            const content = JSON.stringify(data, null, 4);

            try {

                await FileUtils.setFileString_async(sceneFile, content);

                this.setDirty(false);

                this.updateTitleIcon();

            } catch (e) {

                console.error(e);
            }
        }

        async compile() {

            const compiler = new core.code.SceneCompiler(this._scene, this.getInput());

            await compiler.compile();
        }

        saveState(state: IEditorState) {

            if (!this._scene) {

                return;
            }

            state.cameraState = this._cameraManager.getState();
            state.toolsState = this._toolsManager.getState();
        }

        restoreState(state: IEditorState) {

            this._editorState = state;

            this._toolsManager.setState(state.toolsState);
        }

        protected onEditorInputContentChanged() {
            // TODO: missing to implement
        }

        setInput(file: io.FilePath) {

            super.setInput(file);

            // we do this here because the icon should be shown even if the editor is not created yet.
            this.updateTitleIcon();
        }

        protected createPart() {

            this.setLayoutChildren(false);

            const container = document.createElement("div");
            container.classList.add("SceneEditorContainer");

            this.getElement().appendChild(container);

            const pool = Phaser.Display.Canvas.CanvasPool;

            this._gameCanvas = ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT === Phaser.CANVAS

                ? pool.create2D(this.getElement(), 100, 100)

                : pool.createWebGL(this.getElement(), 100, 100);

            this._gameCanvas.classList.add("GameCanvas");

            this._gameCanvas.style.position = "absolute";
            this.getElement().appendChild(container);

            container.appendChild(this._gameCanvas);

            this._overlayLayer = new OverlayLayer(this);
            container.appendChild(this._overlayLayer.getCanvas());

            this.createGame();

            // init managers and factories

            this._dropManager = new DropManager(this);
            this._cameraManager = new CameraManager(this);
            this._selectionManager = new SelectionManager(this);
            this._actionManager = new ActionManager(this);
            this._toolsManager = new tools.SceneToolsManager(this);
            this._mouseManager = new MouseManager(this);

            this._overlayLayer.getCanvas().addEventListener("contextmenu", e => this.onMenu(e));
        }

        private createGame() {

            this._scene = new Scene();

            this._game = new Phaser.Game({
                type: ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
                canvas: this._gameCanvas,
                // backgroundColor: "#8e8e8e",
                scale: {
                    mode: Phaser.Scale.NONE
                },
                render: {
                    pixelArt: true,
                    transparent: true
                },
                audio: {
                    noAudio: true
                },
                scene: this._scene,
            });

            this._sceneRead = false;

            this._gameBooted = false;

            (this._game.config as any).postBoot = () => {
                // the scene is created just at this moment!
                this.onGameBoot();
            };
        }

        private async updateTitleIcon(force = false) {

            const file = this.getInput();

            await SceneThumbnailCache.getInstance().preload(file, force);

            const img = this.getIcon();

            if (img) {

                await img.preload();

                this.dispatchTitleUpdatedEvent();

            } else {

                this.dispatchTitleUpdatedEvent();
            }
        }

        getIcon() {

            const file = this.getInput();

            if (file) {

                const img = SceneThumbnailCache.getInstance().getContent(file);

                if (img) {
                    return img;
                }
            }

            return super.getIcon();
        }

        private _toolActionMap: Map<string, controls.Action>;

        private createToolActions() {

            if (this._toolActionMap) {
                return;
            }

            this._toolActionMap = new Map();

            const tuples = [
                [sceneobjects.TranslateTool.ID, commands.CMD_TRANSLATE_SCENE_OBJECT],
                [sceneobjects.ScaleTool.ID, commands.CMD_SCALE_SCENE_OBJECT],
                [sceneobjects.RotateTool.ID, commands.CMD_ROTATE_SCENE_OBJECT]
            ];

            for (const info of tuples) {

                const [toolId, cmd] = info;

                this._toolActionMap.set(toolId, new controls.Action({
                    commandId: cmd,
                    showText: false
                }));
            }
        }

        getToolActionMap() {
            return this._toolActionMap;
        }

        createEditorToolbar(parent: HTMLElement) {

            this.createToolActions();

            const manager = new controls.ToolbarManager(parent);

            manager.addCommand(commands.CMD_ADD_SCENE_OBJECT, {
                showText: false,
            });

            manager.add(this._toolActionMap.get(sceneobjects.TranslateTool.ID));

            manager.add(this._toolActionMap.get(sceneobjects.ScaleTool.ID));

            manager.add(this._toolActionMap.get(sceneobjects.RotateTool.ID));

            manager.addCommand(commands.CMD_OPEN_COMPILED_FILE, {
                showText: false
            });

            manager.addCommand(commands.CMD_COMPILE_SCENE_EDITOR, {
                showText: false
            });

            return manager;
        }

        private onMenu(e: MouseEvent) {

            e.preventDefault();

            const menu = new controls.Menu();

            this.fillContextMenu(menu);

            menu.create(e);
        }

        private fillContextMenu(menu: controls.Menu) {

            const cmdManager = colibri.Platform.getWorkbench().getCommandManager();
            const activeTool = this.getToolsManager().getActiveTool();

            const exts = colibri.Platform.getExtensions<tools.SceneToolExtension>(tools.SceneToolExtension.POINT_ID);

            for (const ext of exts) {

                for (const tool of ext.getTools()) {

                    menu.addCommand(tool.getCommandId(), {
                        selected: activeTool === tool
                    });
                }
            }

            menu.addSeparator();

            menu.addCommand(commands.CMD_MORPH_OBJECTS);
            menu.addCommand(commands.CMD_ADD_SCENE_OBJECT);

            menu.addSeparator();

            menu.addCommand(colibri.ui.ide.actions.CMD_DELETE);
        }

        openAddObjectDialog() {

            const dlg = new AddObjectDialog(this);

            dlg.create();
        }

        toggleSnapping() {

            const enabled = !this.getScene().getSettings().snapEnabled;

            this.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                editor: this,
                name: "snapEnabled",
                value: enabled,
                repaint: true
            }));
        }

        private async readScene() {

            const maker = this._scene.getMaker();

            this._sceneRead = true;

            try {

                const file = this.getInput();

                await FileUtils.preloadFileString(file);

                const content = FileUtils.getFileString(file);

                const data = JSON.parse(content);

                if (SceneMaker.isValidSceneDataFormat(data)) {

                    await maker.preload();

                    await maker.updateSceneLoader(data);

                    maker.createScene(data);

                } else {
                    alert("Invalid file format.");
                }

            } catch (e) {
                alert(e.message);
                throw e;
            }
        }

        getSelectedGameObjects() {

            return this.getSelection()

                .filter(obj => obj instanceof Phaser.GameObjects.GameObject)

                .map(obj => obj as sceneobjects.ISceneObject);
        }

        getToolsManager() {
            return this._toolsManager;
        }

        getActionManager() {
            return this._actionManager;
        }

        getSelectionManager() {
            return this._selectionManager;
        }

        getOverlayLayer() {
            return this._overlayLayer;
        }

        getGameCanvas() {
            return this._gameCanvas;
        }

        getScene() {
            return this._scene;
        }

        getGame() {
            return this._game;
        }

        getSceneMaker() {
            return this._scene.getMaker();
        }

        getPackFinder() {
            return this.getSceneMaker().getPackFinder();
        }

        layout() {

            super.layout();

            if (!this._game) {
                return;
            }

            this._overlayLayer.resizeTo();

            const parent = this._gameCanvas.parentElement;

            const w = parent.clientWidth;
            const h = parent.clientHeight;

            this._game.scale.resize(w, h);

            if (this._gameBooted) {

                this._scene.getCamera().setSize(w, h);

                this.repaint();
            }
        }

        getPropertyProvider() {
            return this._propertyProvider;
        }

        onPartClosed() {

            if (super.onPartClosed()) {

                if (this._scene) {

                    this._scene.destroyGame();
                }

                return true;
            }

            return false;
        }

        async refreshScene() {

            console.log("Scene Editor: refreshing.");

            const writer = new json.SceneWriter(this._scene);

            const sceneData = writer.toJSON();

            for (const obj of this._scene.getDisplayListChildren()) {

                obj.getEditorSupport().destroy();
            }

            this._scene.sys.updateList.removeAll();
            this._scene.sys.displayList.removeAll();

            const maker = this.getSceneMaker();

            await maker.preload();

            await maker.updateSceneLoader(sceneData);

            maker.createScene(sceneData);

            const sel = this.getSelection()

                .map(obj =>
                    obj instanceof Phaser.GameObjects.GameObject ?
                        this._scene.getByEditorId((obj as sceneobjects.ISceneObject).getEditorSupport().getId())
                        : obj)

                .filter(v => v !== null && v !== undefined);

            this.setSelection(sel);

            this._currentRefreshHash = await this.buildDependenciesHash();

            this.refreshOutline();

            await this.updateTitleIcon(true);
        }

        private async buildDependenciesHash() {

            const maker = this._scene.getMaker();

            await maker.getPackFinder().preload();

            const hash = await maker.buildDependenciesHash();

            return hash;
        }

        async refreshDependenciesHash() {

            this._currentRefreshHash = await this.buildDependenciesHash();
        }

        async onPartActivated() {

            super.onPartActivated();

            {
                if (this._scene) {

                    const hash = await this.buildDependenciesHash();

                    if (this._currentRefreshHash !== null

                        && this._currentRefreshHash !== undefined

                        && hash !== this._currentRefreshHash) {

                        console.log("Scene Editor: " + this.getInput().getFullName() + " dependency changed.");

                        await this.refreshScene();
                    }
                }
            }

            if (this._blocksProvider) {

                await this._blocksProvider.preload();

                this._blocksProvider.repaint();
            }
        }

        getEditorViewerProvider(key: string) {

            switch (key) {
                case phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY:
                    return this._blocksProvider;

                case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:
                    return this._outlineProvider;

                default:
                    break;
            }

            return null;
        }

        getOutlineProvider() {
            return this._outlineProvider;
        }

        refreshOutline() {
            this._outlineProvider.repaint();
        }

        private async onGameBoot() {

            this._gameBooted = true;

            if (!this._sceneRead) {

                await this.readScene();

                if (this._editorState) {

                    if (this._editorState) {

                        this._cameraManager.setState(this._editorState.cameraState);
                    }

                    this._editorState = null;
                }

                this._currentRefreshHash = await this.buildDependenciesHash();

            }

            this.layout();

            this.refreshOutline();

            // for some reason, we should do this after a time, or the game is not stopped well.
            setTimeout(() => {
                this._game.loop.stop();
            }, 500);

            this.updateTitleIcon(true);
        }

        repaint(): void {

            if (!this._gameBooted) {
                return;
            }

            this._game.loop.tick();

            this._overlayLayer.render();
        }

        snapPoint(x: number, y: number): { x: number, y: number } {

            const settings = this._scene.getSettings();

            if (settings.snapEnabled) {

                return {
                    x: Math.round(x / settings.snapWidth) * settings.snapWidth,
                    y: Math.round(y / settings.snapHeight) * settings.snapHeight
                };
            }

            return { x, y };
        }
    }

}