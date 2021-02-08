namespace phasereditor2d.animations.ui.editors {

    import FileUtils = colibri.ui.ide.FileUtils;
    import controls = colibri.ui.controls;

    export class AnimationsEditor extends colibri.ui.ide.FileEditor {

        static ID = "phasereditor2d.animations.ui.editors.AnimationsEditor";

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        private _gameCanvas: HTMLCanvasElement;
        private _scene: AnimationsScene;
        private _game: Phaser.Game;
        private _sceneRead: boolean;
        private _gameBooted: boolean;
        private _overlayLayer: AnimationsOverlayLayer;
        private _outlineProvider: AnimationsEditorOutlineProvider;
        private _blocksProvider: AnimationsEditorBlocksProvider;
        private _propertiesProvider: properties.AnimationsEditorPropertyProvider;
        private _selectedAnimations: Phaser.Animations.Animation[];
        private _currentDependenciesHash: string;
        private _menuCreator: AnimationsEditorMenuCreator;

        static getFactory() {

            return this._factory ?? (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("Animations Editor",
                phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS, () => new AnimationsEditor()
            ));
        }

        constructor() {
            super(AnimationsEditor.ID, AnimationsEditor.getFactory());

            this.addClass("AnimationsEditor");

            this._outlineProvider = new AnimationsEditorOutlineProvider(this);
            this._blocksProvider = new AnimationsEditorBlocksProvider(this);
            this._propertiesProvider = new properties.AnimationsEditorPropertyProvider();

            this._selectedAnimations = [];
        }

        protected async doSave() {

            const animsData = this._scene.anims.toJSON();

            for (const a of animsData.anims) {

                if (a.delay === 0) delete a.delay;

                if (a.repeat === 0) delete a.repeat;

                if (a.repeatDelay === 0) delete a.repeatDelay;

                if (!a.yoyo) delete a.yoyo;

                if (!a.showOnStart) delete a.showOnStart;

                if (!a.hideOnComplete) delete a.hideOnComplete;

                if (!a.skipMissedFrames) delete a.skipMissedFrames;

                delete a.duration;

                for (const frame of a.frames) {

                    try {
                        const item = this.getScene().getMaker().getPackFinder().findAssetPackItem(frame.key);

                        if (item instanceof pack.core.ImageAssetPackItem) {

                            delete frame.frame;
                        }
                    } catch (e) {
                        // nothing
                    }
                }
            }

            animsData["meta"] = AnimationsPlugin.getInstance().createAnimationsMetaData();

            const content = JSON.stringify(animsData, null, 4);

            await FileUtils.setFileString_async(this.getInput(), content);

            this.setDirty(false);
        }

        openAddFramesDialog(cmd: "prepend" | "append"): void {

            this.openSelectFramesDialog(async (frames) => {

                const data = this.getScene().anims.toJSON();

                const animData = data.anims.find(a => a.key === this.getSelection()[0].key);

                for (const frame of frames) {

                    const frameData = {
                        key: frame.getPackItem().getKey()
                    };

                    if (!(frame.getPackItem() instanceof pack.core.ImageAssetPackItem)) {

                        frameData["frame"] = frame.getName();
                    }

                    if (cmd === "append") {

                        animData.frames.push(frameData as any);

                    } else {

                        animData.frames.splice(0, 0, frameData as any);
                    }
                }


                this.fullResetDataOperation(data);
            });
        }

        protected async onEditorInputContentChangedByExternalEditor() {

            console.log("onEditorInputContentChangedByExternalEditor");

            const str = colibri.ui.ide.FileUtils.getFileString(this.getInput());

            const data = JSON.parse(str);

            this.fullReset(data, false);
        }

        private async fullReset(data: any, useAnimationIndexAsKey: boolean) {

            const scene = this.getScene();

            scene.removeAll();

            const maker = scene.getMaker();

            await maker.preload();

            this._overlayLayer.setLoading(true);

            await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());

            this._overlayLayer.setLoading(false);

            this.reset(data, useAnimationIndexAsKey);

            await this.updateDependenciesHash();
        }

        getScene() {

            return this._scene;
        }

        getOverlayLayer() {

            return this._overlayLayer;
        }

        selectAll() {

            this.setSelection(this.getAnimations());
        }

        deleteSelected() {

            const selectedFrames = new Set();
            const selectedParentAnimations = new Set<Phaser.Animations.Animation>();
            const selectedAnimations = new Set(this.getSelection().filter(a => a instanceof Phaser.Animations.Animation));

            for (const obj of this.getSelection()) {

                if (obj instanceof Phaser.Animations.AnimationFrame) {

                    const anim = AnimationsEditor.getAnimationOfAFrame(obj);

                    if (!selectedAnimations.has(anim)) {

                        selectedFrames.add(obj);
                        selectedParentAnimations.add(anim);
                    }
                }
            }

            let exitMethod = false;

            for (const anim of selectedParentAnimations) {

                const found = anim.frames.find(frame => !selectedFrames.has(frame));

                if (!found && !selectedAnimations.has(anim)) {

                    alert(`Cannot delete all frames of the animation "${anim.key}".`);

                    exitMethod = true;
                }
            }

            if (exitMethod) {

                return;
            }

            this.runOperation(() => {

                this.setDirty(true);

                for (const obj of this.getSelection()) {

                    if (obj instanceof Phaser.Animations.Animation) {

                        const sprite = this.getSpriteForAnimation(obj);

                        sprite.destroy();

                        this.getScene().anims.remove(obj.key);
                    }
                }

                for (const obj of this.getSelection()) {

                    if (obj instanceof Phaser.Animations.AnimationFrame) {

                        const anim = AnimationsEditor.getAnimationOfAFrame(obj);

                        anim.removeFrame(obj);
                    }
                }
            });
        }

        createEditorToolbar(parent: HTMLElement) {

            const manager = new controls.ToolbarManager(parent);

            manager.addCommand(CMD_ADD_ANIMATION);

            return manager;
        }

        private openSelectFramesDialog(selectFramesCallback: (frames: pack.core.AssetPackImageFrame[]) => void) {

            const viewer = new controls.viewers.TreeViewer(
                "phasereditor2d.animations.ui.editors.AnimationsEditor.SelectFrames");
            viewer.setLabelProvider(this._blocksProvider.getLabelProvider());
            viewer.setContentProvider(this._blocksProvider.getContentProvider());
            viewer.setCellRendererProvider(this._blocksProvider.getCellRendererProvider());
            viewer.setTreeRenderer(this._blocksProvider.getTreeViewerRenderer(viewer));
            viewer.setInput(this._blocksProvider.getInput());
            viewer.expandRoots();

            const dlg = new controls.dialogs.ViewerDialog(viewer, true);
            dlg.setSize(window.innerWidth * 2 / 3, window.innerHeight * 2 / 3);
            dlg.create();
            dlg.setTitle("Select Frames");
            dlg.addOpenButton("Select", sel => {

                const frames: pack.core.AssetPackImageFrame[] = [];
                const used = new Set();

                for (const elem of sel) {

                    let elemFrames: pack.core.AssetPackImageFrame[];

                    if (elem instanceof pack.core.ImageFrameContainerAssetPackItem) {

                        elemFrames = elem.getFrames();

                    } else {

                        elemFrames = [elem];
                    }

                    for (const frame of elemFrames) {

                        const id = frame.getPackItem().getKey() + "$" + frame.getName();

                        if (used.has(id)) {

                            continue;
                        }

                        used.add(id);
                        frames.push(frame);
                    }
                }

                selectFramesCallback(frames);
            });

            dlg.addCancelButton();
        }

        openAddAnimationDialog() {

            const dlg = new controls.dialogs.InputDialog();
            dlg.create();
            dlg.setTitle("New Animation");
            dlg.setMessage("Enter the animation name");
            dlg.setInputValidator(name => {

                if (name.trim().length === 0) {

                    return false;
                }

                const found = this.getAnimation(name);

                return found === null || found === undefined;
            });
            dlg.setInitialValue("animation");
            dlg.validate();

            dlg.setResultCallback(name => {

                this.openSelectFramesDialog(frames => {

                    const animData = {
                        key: name,
                        frameRate: 24,
                        repeat: -1,
                        delay: 0,
                        frames: frames.map(frame => {

                            const packItem = frame.getPackItem();

                            if (packItem instanceof pack.core.ImageAssetPackItem) {

                                return {
                                    key: packItem.getKey()
                                }

                            }

                            return {
                                key: packItem.getKey(),
                                frame: frame.getName()
                            }
                        })
                    }

                    const data = this.getScene().anims.toJSON();

                    data.anims.push(animData as any);

                    this.fullResetDataOperation(data, () => {

                        this.setSelection([this.getAnimation(name)]);

                        this.getElement().focus();

                        colibri.Platform.getWorkbench().setActivePart(this);
                    });
                });
            });
        }

        protected createPart(): void {

            this.setLayoutChildren(false);

            const container = document.createElement("div");
            container.classList.add("AnimationsEditorContainer");

            this.getElement().appendChild(container);

            this._overlayLayer = new AnimationsOverlayLayer(this);
            container.appendChild(this._overlayLayer.getCanvas());

            const pool = Phaser.Display.Canvas.CanvasPool;

            this._gameCanvas = pool.create2D(this.getElement(), 100, 100);
            this._gameCanvas.style.position = "absolute";
            this._gameCanvas.tabIndex = 1;
            container.appendChild(this._gameCanvas);

            this.createGame();

            this.registerMenu();

            this.registerDropListeners();
        }

        private registerDropListeners() {

            this._gameCanvas.addEventListener("dragover", e => {

                const dataArray = controls.Controls.getApplicationDragData();

                for (const elem of dataArray) {

                    if (elem instanceof pack.core.ImageFrameContainerAssetPackItem
                        || elem instanceof pack.core.AssetPackImageFrame) {

                        e.preventDefault();

                        return;
                    }
                }
            });

            this._gameCanvas.addEventListener("drop", e => {

                e.preventDefault();

                const data = controls.Controls.getApplicationDragData();

                const builder = new AnimationsBuilder(this, data);

                builder.build();
            });
        }

        private registerMenu() {

            this._menuCreator = new AnimationsEditorMenuCreator(this);

            this._gameCanvas.addEventListener("contextmenu", e => this.onMenu(e));
        }

        private onMenu(e: MouseEvent) {

            e.preventDefault();

            const menu = new controls.Menu();

            this.fillMenu(menu);

            menu.createWithEvent(e);
        }

        fillMenu(menu: controls.Menu) {

            this._menuCreator.fillMenu(menu);
        }

        private createGame() {

            this._scene = new AnimationsScene(this);

            this._game = new Phaser.Game({
                type: Phaser.CANVAS,
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
        }

        private async onGameBoot() {

            this._gameBooted = true;

            if (!this._sceneRead) {

                await this.readScene();
            }

            this.layout();

            this.refreshOutline();

            this.setSelection([]);
        }

        private async readScene() {

            const maker = this._scene.getMaker();

            this._sceneRead = true;

            try {

                const file = this.getInput();

                await FileUtils.preloadFileString(file);

                const content = FileUtils.getFileString(file);

                const data = JSON.parse(content);

                this._overlayLayer.setLoading(true);
                this._overlayLayer.render();

                await maker.preload();

                await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());

                const errors = [];

                maker.createScene(data, errors);

                this._overlayLayer.setLoading(false);

                if (errors.length > 0) {

                    alert(errors.join("<br>"));
                }

            } catch (e) {

                alert(e.message);

                throw e;
            }

            this._currentDependenciesHash = await this.getScene().getMaker().buildDependenciesHash();
        }

        refreshOutline() {

            this._outlineProvider.repaint();
        }

        private async refreshBlocks() {

            await this._blocksProvider.preload();

            this._blocksProvider.repaint();
        }

        repaint() {

            this._overlayLayer.render();
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
            }
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

        onPartDeactivated() {

            super.onPartActivated();

            if (colibri.Platform.getWorkbench().getActiveEditor() !== this) {

                if (this._game.loop) {

                    this._game.loop.stop();
                }
            }
        }

        async onPartActivated() {

            super.onPartActivated();

            if (this._gameBooted) {

                if (!this._game.loop.running) {

                    this._game.loop.start(this._game.loop.callback);
                }

                this.updateIfDependenciesChanged();

                this.refreshBlocks();
            }
        }

        private async updateDependenciesHash() {

            const hash = await this.getScene().getMaker().buildDependenciesHash();

            this._currentDependenciesHash = hash;
        }

        private async updateIfDependenciesChanged() {

            const hash = await this.getScene().getMaker().buildDependenciesHash();

            if (hash !== this._currentDependenciesHash) {

                this._currentDependenciesHash = hash;

                const data = this.getScene().anims.toJSON();

                this.fullReset(data, false);
            }
        }

        getPropertyProvider() {

            return this._propertiesProvider;
        }

        getEditorViewerProvider(key: string) {

            if (key === outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY) {

                return this._outlineProvider;

            } else if (key === blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY) {

                return this._blocksProvider;
            }

            return null;
        }

        async fullResetDataOperation(data: Phaser.Types.Animations.JSONAnimations, op?: () => any) {

            const before = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            await this.fullReset(data, false);

            if (op) {

                await op();
            }

            const after = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new AnimationsEditorSnapshotOperation(this, before, after, false));
        }

        runOperation(op: () => void, useAnimationIndexAsKey = false) {

            const before = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            op();

            const after = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new AnimationsEditorSnapshotOperation(this, before, after, useAnimationIndexAsKey));
        }

        private computeSelectedAnimations() {

            const used = new Set();

            const list: Phaser.Animations.Animation[] = [];

            for (const obj of this.getSelection()) {

                let anim: Phaser.Animations.Animation;

                if (obj instanceof Phaser.Animations.Animation) {

                    anim = obj;

                } else {

                    const frame = obj as Phaser.Animations.AnimationFrame;

                    anim = AnimationsEditor.getAnimationOfAFrame(frame);
                }

                if (anim && !used.has(anim)) {

                    used.add(anim);
                    list.push(anim);
                }
            }

            return list;
        }

        getAnimations() {

            return this._scene.anims["anims"].getArray();
        }

        getSpriteForAnimation(animation: Phaser.Animations.Animation) {

            return this.getScene().getSprites().find(sprite => sprite.anims.currentAnim === animation);
        }

        setSelection(sel: any[], notify = true) {

            super.setSelection(sel, notify);

            this._selectedAnimations = this.computeSelectedAnimations();
        }

        getSelectedAnimations() {

            return this._selectedAnimations;
        }

        getAnimation(key: string) {

            return this.getScene().anims.get(key);
        }

        getAnimationFrame(animKey: string, frameTextureKey: string, frameTextureFrame: string) {

            const anim = this.getAnimation(animKey);

            if (anim) {

                return anim.frames.find(f => f.textureKey === frameTextureKey && f.textureFrame === frameTextureFrame);
            }

            return undefined;
        }

        static getAnimationOfAFrame(obj: Phaser.Animations.AnimationFrame) {

            return obj["__animation"] as Phaser.Animations.Animation;
        }

        static setAnimationToFrame(frame: Phaser.Animations.AnimationFrame, anim: Phaser.Animations.Animation) {

            frame["__animation"] = anim;
        }

        reset(animsData: Phaser.Types.Animations.JSONAnimations, useAnimationIndexAsKey: boolean) {

            let selectedIndexes: number[];

            if (useAnimationIndexAsKey) {

                const allAnimations = this.getAnimations();

                selectedIndexes = this.getSelectedAnimations().map(anim => allAnimations.indexOf(anim));
            }

            const scene = this.getScene();

            scene.removeAll();

            scene.getMaker().createScene(animsData);

            this.refreshOutline();

            this.refreshBlocks();

            if (useAnimationIndexAsKey) {

                const allAnimations = this.getAnimations();

                this.setSelection(selectedIndexes.map(i => allAnimations[i]));

            } else {

                this.setSelection(this._selectedAnimations.map(obj => {

                    return this.getAnimation(obj.key);

                }).filter(o => {

                    return o !== undefined && o !== null
                }));
            }
        }
    }
}