
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

        static getFactory(): colibri.ui.ide.EditorFactory {
            return new SceneEditorFactory();
        }

        constructor() {
            super("phasereditor2d.SceneEditor");

            this.addClass("SceneEditor");

            this._blocksProvider = new blocks.SceneEditorBlocksProvider(this);
            this._outlineProvider = new outline.SceneEditorOutlineProvider(this);
            this._propertyProvider = new properties.SceneEditorSectionProvider();
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

            await this.compile();
        }

        async compile() {

            const compiler = new core.code.SceneCompiler(this._scene, this.getInput());

            await compiler.compile();
        }

        saveState(state: any) {

            if (!this._scene) {
                return;
            }

            const camera = this._scene.cameras.main;

            state.cameraZoom = camera.zoom;
            state.cameraScrollX = camera.scrollX;
            state.cameraScrollY = camera.scrollY;
        }

        restoreState(state: any) {

            this._scene.setInitialState(state);
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

            this._gameCanvas = document.createElement("canvas");
            this._gameCanvas.style.position = "absolute";
            this.getElement().appendChild(container);

            container.appendChild(this._gameCanvas);

            this._overlayLayer = new OverlayLayer(this);
            container.appendChild(this._overlayLayer.getCanvas());

            // create game scene

            this._scene = new Scene();

            this._game = new Phaser.Game({
                type: Phaser.WEBGL,
                canvas: this._gameCanvas,
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

            // init managers and factories

            this._dropManager = new DropManager(this);
            this._cameraManager = new CameraManager(this);
            this._selectionManager = new SelectionManager(this);
            this._actionManager = new ActionManager(this);

        }

        private async updateTitleIcon() {

            const file = this.getInput();

            await SceneThumbnailCache.getInstance().preload(file);

            const img = this.getIcon();

            if (img) {

                img.preload().then(w => this.dispatchTitleUpdatedEvent());

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

        async onPartActivated() {

            super.onPartActivated();

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
            }

            this.layout();

            this.refreshOutline();

            // for some reason, we should do this after a time, or the game is not stopped well.
            setTimeout(() => this._game.loop.stop(), 500);
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