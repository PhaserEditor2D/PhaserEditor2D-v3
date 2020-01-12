
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

    interface EditorState {

        cameraState: CameraState;
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
        private _gameBooted: boolean;
        private _sceneRead: boolean;
        private _currentRefreshHash: string;
        private _editorState: EditorState;

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

        saveState(state: EditorState) {

            if (!this._scene) {

                return;
            }

            state.cameraState = this._cameraManager.getState();
        }

        restoreState(state: EditorState) {

            this._editorState = state;
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

        }

        private createGame() {

            this._scene = new Scene();

            this._game = new Phaser.Game({
                type: ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
                canvas: this._gameCanvas,
                backgroundColor: "#8e8e8e",
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

        createEditorToolbar(parent: HTMLElement) {

            const manager = new controls.ToolbarManager(parent);

            manager.add(new controls.Action({
                icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_PLUS),
                showText: false
            }));

            manager.add(new controls.Action({
                icon: ScenePlugin.getInstance().getIcon(ICON_TRANSLATE),
                showText: false
            }));

            manager.add(new controls.Action({
                icon: ScenePlugin.getInstance().getIcon(ICON_SCALE),
                showText: false
            }));

            manager.add(new controls.Action({
                icon: ScenePlugin.getInstance().getIcon(ICON_ANGLE),
                showText: false
            }));

            manager.add(new controls.Action({
                icon: ScenePlugin.getInstance().getIcon(ICON_ORIGIN),
                showText: false
            }));

            manager.addCommand(commands.CMD_OPEN_COMPILED_FILE, {
                showText: false
            });

            manager.addCommand(commands.CMD_COMPILE_SCENE_EDITOR, {
                showText: false
            });

            return manager;
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

                .map(obj => obj as sceneobjects.SceneObject);
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

                obj.destroy();
            }

            this._scene.sys.updateList.removeAll();
            this._scene.sys.displayList.removeAll();

            const maker = this.getSceneMaker();

            await maker.preload();

            await maker.updateSceneLoader(sceneData);

            maker.createScene(sceneData);

            this.repaint();

            this._currentRefreshHash = await this.buildDependenciesHash();

            this.refreshOutline();

            await this.updateTitleIcon(true);
        }

        private async buildDependenciesHash() {

            const maker = this._scene.getMaker();

            const hash = await maker.buildDependenciesHash();

            return hash;
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
            setTimeout(() => this._game.loop.stop(), 500);

            this.updateTitleIcon(true);
        }

        repaint(): void {

            if (!this._gameBooted) {
                return;
            }

            this._game.loop.tick();

            this._overlayLayer.render();
        }
    }

}