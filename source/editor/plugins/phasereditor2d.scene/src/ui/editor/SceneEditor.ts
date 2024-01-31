
namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    interface IEditorState {
        cameraState: ICameraState;
        toolsState: tools.ISceneToolsState;
        selectionState: string[];
    }

    export class SceneEditor extends colibri.ui.ide.FileEditor {

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;

        static getFactory() {

            return this._factory || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("Scene Editor",
                core.CONTENT_TYPE_SCENE, () => new SceneEditor()
            ));
        }

        private _menuCreator: SceneEditorMenuCreator;
        private _canvasContainer: HTMLDivElement;
        private _layoutToolsManager: LayoutToolsManager;
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
        private _toolsManager: tools.SceneToolsManager;
        private _mouseManager: MouseManager;
        private _clipboardManager: ClipboardManager;
        private _gameBooted: boolean;
        private _sceneRead: boolean;
        private _currentRefreshHash: string;
        private _editorState: IEditorState;
        private _localCoords: boolean;
        private _cellRendererCache: CellRendererCache;

        constructor() {
            super("phasereditor2d.SceneEditor", SceneEditor.getFactory());

            this.addClass("SceneEditor");

            this._blocksProvider = new blocks.SceneEditorBlocksProvider(this);
            this._outlineProvider = new outline.SceneEditorOutlineProvider(this);
            this._propertyProvider = new properties.SceneEditorSectionProvider(this);
            this._menuCreator = new SceneEditorMenuCreator(this);
            this._localCoords = true;
            this._cellRendererCache = new CellRendererCache();
        }

        getMenuCreator() {

            return this._menuCreator;
        }

        isLocalCoords() {

            return this._localCoords;
        }

        setLocalCoords(local: boolean, repaint = true) {

            this._localCoords = local;

            if (repaint) {

                this.repaint();
            }
        }

        async confirmUnlockProperty(props: Array<sceneobjects.IProperty<any>>, propLabel: string, ...sectionId: string[]): Promise<boolean> {

            const lockedObjects = this.getSelectedGameObjects().filter(obj => {

                for (const prop of props) {

                    if (!obj.getEditorSupport().isUnlockedProperty(prop)) {

                        return true;
                    }

                    return false;
                }
            });

            if (lockedObjects.length > 0) {

                return new Promise((resolve, _) => {

                    controls.dialogs.ConfirmDialog.show(
                        `The ${propLabel} property is locked in ${lockedObjects.length} objects. Do you want to unlock it?`, "Unlock")
                        .then(ok => {

                            if (ok) {

                                this.getUndoManager()
                                    .add(new sceneobjects.PropertyUnlockOperation(this, lockedObjects, props, true));

                                for (const id of sectionId) {

                                    this.updateInspectorViewSection(id);
                                }
                            }

                            resolve(ok);
                        });
                });
            }

            return true;
        }

        openSourceFileInEditor(): void {

            const lang = this._scene.getSettings().compilerOutputLanguage;

            const ext = lang === phasereditor2d.ide.core.code.SourceLang.JAVA_SCRIPT ? ".js" : ".ts";

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

                await this.updateTitleIcon();

            } catch (e) {

                console.error(e);
            }
        }

        private _outputFileEditorState: any;

        openOutputFileQuickEditorDialog() {

            const file = this.getOutputFile();

            if (!file) {

                alert("The scene is not compiled yet. There isn't any file to edit.");

                return;
            }

            const dlg = new colibri.ui.ide.QuickEditorDialog(file, this._outputFileEditorState);

            dlg.create();

            dlg.addButton("Play", () => {

                colibri.Platform.getWorkbench().getCommandManager()
                    .executeCommand(ide.ui.actions.CMD_PLAY_PROJECT);
            });

            dlg.eventDialogClose.addListener(() => {

                this._outputFileEditorState = dlg.getEditorState();

                colibri.Platform.getWorkbench().setActiveEditor(this);
            });
        }

        getOutputFile() {

            const compiler = new core.code.SceneCompiler(this._scene, this.getInput());

            const outputFile = compiler.getOutputFile();

            return outputFile;
        }

        async compile() {

            const compiler = new core.code.SceneCompiler(this._scene, this.getInput());

            const outputFile = compiler.getOutputFile();

            const dirtyEditors = colibri.Platform.getWorkbench()

                .getOpenEditorsWithInput(outputFile)

                .filter(editor => editor.isDirty());

            if (dirtyEditors.length > 0) {

                alert("Cannot overwrite the '" + outputFile.getName() + "' file, it is open in a dirty editor.");

                return;
            }


            await compiler.compile();
        }

        saveState(state: IEditorState) {

            if (!this._scene) {

                return;
            }

            state.cameraState = this._cameraManager.getState();
            state.toolsState = this._toolsManager.getState();
            state.selectionState = this._selectionManager.getState();
        }

        restoreState(state: IEditorState) {

            this._editorState = state;

            this._toolsManager.setState(state.toolsState);
        }

        protected async onEditorInputContentChangedByExternalEditor() {

            const file = this.getInput();

            const str = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

            const sceneData = JSON.parse(str) as json.ISceneData;

            this.refreshSceneWithData(sceneData);
        }

        setInput(file: io.FilePath) {

            super.setInput(file);

            // we do this here because the icon should be shown even if the editor is not created yet.
            this.updateTitleIcon(true);
        }

        protected createPart() {

            this.setLayoutChildren(false);

            const container = document.createElement("div");
            container.classList.add("SceneEditorContainer");

            this.getElement().appendChild(container);

            this._gameCanvas = ScenePlugin.getInstance().getCanvasManager().takeCanvas();
            this._gameCanvas.style.visibility = "hidden";

            this._gameCanvas.classList.add("GameCanvas");

            this._gameCanvas.style.position = "absolute";

            container.appendChild(this._gameCanvas);

            this._overlayLayer = new OverlayLayer(this);
            container.appendChild(this._overlayLayer.getCanvas());

            this._canvasContainer = container;

            this.createGame();

            // init managers and factories

            this._dropManager = new DropManager(this);
            this._selectionManager = new SelectionManager(this);
            this._toolsManager = new tools.SceneToolsManager(this);
            this._mouseManager = new MouseManager(this);
            this._cameraManager = new CameraManager(this);
            this._clipboardManager = new ClipboardManager(this);
            this._layoutToolsManager = new LayoutToolsManager(this);

            this._overlayLayer.getCanvas().addEventListener("contextmenu", e => this.onMenu(e));

            this._layoutToolsManager.createElement();
        }

        getLayoutToolsManager() {

            return this._layoutToolsManager;
        }

        getCanvasContainer() {

            return this._canvasContainer;
        }

        private registerThemeListener() {

            colibri.Platform.getWorkbench().eventThemeChanged.addListener((theme: controls.ITheme) => {   

                const color = Phaser.Display.Color.HexStringToColor(theme.sceneBackground);

                this._scene.renderer.config["backgroundColor"] = color;

                this.repaint();
            });
        }

        private createGame() {

            this._scene = new Scene(this);

            this._game = new Phaser.Game({
                type: ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
                canvas: this._gameCanvas,
                scale: {
                    mode: Phaser.Scale.NONE
                },
                // resolution: window.devicePixelRatio,
                backgroundColor: controls.Controls.getTheme().sceneBackground,
                render: {
                    pixelArt: ScenePlugin.DEFAULT_EDITOR_PIXEL_ART,
                    transparent: false
                },
                audio: {
                    noAudio: true
                },
                physics: {
                    default: "arcade"
                },
                plugins: {
                    scene: [
                        { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" }
                    ]
                },
                scene: this._scene,
            });


            this._sceneRead = false;

            this._gameBooted = false;

            (this._game.config as any).postBoot = () => {
                // the scene is created just at this moment!
                this.onGameBoot();
            };

            this.registerThemeListener();
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

                if (ScenePlugin.getInstance().getSceneFinder().isScriptPrefabFile(file)) {

                    return resources.getIcon(resources.ICON_BUILD);
                }

                const img = SceneThumbnailCache.getInstance().getContent(file);

                if (img) {

                    return img;
                }
            }

            return super.getIcon();
        }

        private _toolbarActionMap: Map<string, controls.Action>;
        private _toolsInToolbar: string[];

        private createToolbarActions() {

            if (this._toolbarActionMap) {
                return;
            }

            this._toolbarActionMap = new Map();

            this._toolsInToolbar = [
                sceneobjects.TranslateTool.ID,
                sceneobjects.ScaleTool.ID,
                sceneobjects.RotateTool.ID,
                sceneobjects.OriginTool.ID,
                sceneobjects.SelectionRegionTool.ID
            ];

            for (const toolId of this._toolsInToolbar) {

                const tool = ScenePlugin.getInstance().getTool(toolId);

                this._toolbarActionMap.set(toolId, new controls.Action({
                    commandId: tool.getCommandId(),
                    showText: false
                }));
            }
        }

        getToolbarActionMap() {
            return this._toolbarActionMap;
        }

        createEditorToolbar(parent: HTMLElement) {

            this.createToolbarActions();

            const manager = new controls.ToolbarManager(parent);

            for (const toolID of this._toolsInToolbar) {

                const action = this._toolbarActionMap.get(toolID);

                manager.add(action);
            }

            return manager;
        }

        private onMenu(e: MouseEvent) {

            e.preventDefault();

            const menu = new controls.Menu();

            this.fillContextMenu(menu);

            menu.createWithEvent(e);
        }

        fillContextMenu(menu: controls.Menu) {

            this._menuCreator.fillMenu(menu);
        }

        toggleSnapping() {

            const enabled = !this.getScene().getSettings().snapEnabled;

            this.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                editor: this,
                props: [
                    {
                        name: "snapEnabled",
                        value: enabled,
                    }
                ],
                repaint: true
            }));
        }

        setSnappingToObjectSize() {

            const obj = this.getSelectedGameObjects()[0] as any;

            if (obj) {

                if (obj.width !== undefined && obj.height !== undefined) {

                    this.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                        editor: this,
                        props: [
                            {
                                name: "snapEnabled",
                                value: true,
                            },
                            {
                                name: "snapWidth",
                                value: obj.width
                            },
                            {
                                name: "snapHeight",
                                value: obj.height
                            }
                        ],
                        repaint: true
                    }));
                }
            }
        }

        private async readScene() {

            const maker = this._scene.getMaker();

            this._sceneRead = true;

            try {

                const file = this.getInput();

                await FileUtils.preloadFileString(file);

                const content = FileUtils.getFileString(file);

                const data = JSON.parse(content) as core.json.ISceneData;

                ScenePlugin.getInstance().runSceneDataMigrations(data);

                if (SceneMaker.isValidSceneDataFormat(data)) {

                    this._overlayLayer.setLoading(true);
                    this._overlayLayer.render();

                    await maker.preload();

                    await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());

                    const errors = [];

                    maker.createScene(data, errors);

                    this._overlayLayer.setLoading(false);
                    this._overlayLayer.render();

                    if (errors.length > 0) {

                        alert(errors.join("<br>"));
                    }

                    this.refreshBlocks();

                } else {

                    alert("Invalid file format.");
                }

            } catch (e) {
                alert(e.message);
                throw e;
            }
        }

        isLoading() {
            return this._overlayLayer && this._overlayLayer.isLoading();
        }

        getSelectedGameObjects(): sceneobjects.ISceneGameObject[] {

            return this.getSelection()

                .filter(obj => sceneobjects.isGameObject(obj));
        }

        getSelectedLists(): sceneobjects.ObjectList[] {

            return this.getSelection()

                .filter(obj => obj instanceof sceneobjects.ObjectList);
        }

        getSelectedListItems(): sceneobjects.ObjectListItem[] {

            return this.getSelection()

                .filter(obj => obj instanceof sceneobjects.ObjectListItem);
        }

        getSelectedPlainObjects(): sceneobjects.IScenePlainObject[] {

            return this.getSelection().filter(obj => sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj));
        }

        getSelectedCodeSnippets(): codesnippets.CodeSnippet[] {

            return this.getSelection()
                .filter(obj => obj instanceof codesnippets.CodeSnippet);
        }

        getSelectedUserComponentNodes(): sceneobjects.UserComponentNode[] {

            return this.getSelection().filter(obj => obj instanceof sceneobjects.UserComponentNode);
        }

        getSelectedPrefabProperties(): sceneobjects.UserProperty[] {

            return this.getSelection().filter(obj => obj instanceof sceneobjects.UserProperty);
        }

        getCameraManager() {

            return this._cameraManager;
        }

        getDropManager() {

            return this._dropManager;
        }

        getClipboardManager() {

            return this._clipboardManager;
        }

        getToolsManager() {

            return this._toolsManager;
        }

        getMouseManager() {

            return this._mouseManager;
        }

        getSelectionManager() {

            return this._selectionManager;
        }

        getOverlayLayer() {

            return this._overlayLayer;
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

        updateInspectorViewSection(sectionId: string, repaint = true) {

            if (repaint) {

                this.repaint();
            }

            const window = colibri.Platform.getWorkbench().getActiveWindow();
            const view = window.getView(colibri.inspector.ui.views.InspectorView.VIEW_ID) as colibri.inspector.ui.views.InspectorView;

            const section = view.getPropertyPage().getSection(sectionId);

            if (section) {

                section.updateWithSelection();
            }
        }

        getPropertyProvider() {

            return this._propertyProvider;
        }

        getCellRendererCache() {

            return this._cellRendererCache;
        }

        onPartClosed() {

            if (super.onPartClosed()) {

                if (this._scene) {

                    this._scene.destroyGame();

                    ScenePlugin.getInstance().getCanvasManager().releaseCanvas(this._game.canvas);
                }

                this._cellRendererCache.clear();

                return true;
            }

            return false;
        }

        async refreshScene() {

            console.log("Scene Editor: refreshing.");

            const writer = new json.SceneWriter(this._scene);

            const sceneData = writer.toJSON();

            await this.refreshSceneWithData(sceneData);
        }

        private async refreshSceneWithData(sceneData: json.ISceneData) {

            for (const obj of this._scene.getGameObjects()) {

                obj.getEditorSupport().destroy();
            }

            this._scene.removeAll();

            const maker = this.getSceneMaker();

            await maker.preload();

            await maker.updateSceneLoader(sceneData);

            maker.createScene(sceneData);

            const sel = this.getSelection()

                .map(obj =>
                    sceneobjects.isGameObject(obj) ?
                        this._scene.getByEditorId((obj as sceneobjects.ISceneGameObject).getEditorSupport().getId())
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

        override async onPartActivated() {

            super.onPartActivated();

            await this.updateWithExternalChanges();
        }

        protected onFileStorageChanged(change: io.FileStorageChange): void {

            if (change.getCause() === colibri.core.io.FileStorageChangeCause.WINDOW_FOCUS) {

                this.updateWithExternalChanges();
            }
        }

        private async updateWithExternalChanges() {

            console.log("SceneEditor.updateWithExternalChanges()");

            if (this._scene) {

                const hash = await this.buildDependenciesHash();

                if (this._currentRefreshHash !== null

                    && this._currentRefreshHash !== undefined

                    && hash !== this._currentRefreshHash) {

                    console.log("Scene Editor: " + this.getInput().getFullName() + " dependency changed.");

                    await this.refreshScene();
                }
            }

            await this.refreshBlocks();
        }

        async refreshBlocks() {

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

        getBlocksProvider() {

            return this._blocksProvider;
        }

        getOutlineProvider() {

            return this._outlineProvider;
        }

        refreshOutline() {

            this._outlineProvider.repaint();
        }

        private async onGameBoot() {

            this._gameBooted = true;

            this._gameCanvas.style.visibility = "visible";

            if (!this._sceneRead) {

                await this.readScene();

                if (this._editorState) {

                    this._cameraManager.setState(this._editorState.cameraState);
                    this._selectionManager.setState(this._editorState.selectionState)

                } else {

                    this.setSelection([]);
                }

                this._editorState = null;

                this._currentRefreshHash = await this.buildDependenciesHash();
            }

            this.layout();

            this.refreshOutline();

            // for some reason, we should do this after a time, or the game is not stopped well.
            setTimeout(() => {

                this._game.loop.stop();

            }, 500);

            await this.updateTitleIcon(true);
        }

        repaint(): void {

            if (!this._gameBooted) {

                return;
            }

            try {

                this._game.loop.tick();

                this._overlayLayer.render();

            } catch (e) {

                console.log(e);

                alert(e.message);
            }
        }
    }
}