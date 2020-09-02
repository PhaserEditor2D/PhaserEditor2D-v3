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

        static getFactory() {

            return this._factory ?? (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS, () => new AnimationsEditor()
            ));
        }

        constructor() {
            super(AnimationsEditor.ID);

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
            }

            animsData["meta"] = AnimationsPlugin.getInstance().createAnimationsMetaData();

            const content = JSON.stringify(animsData, null, 4);

            await FileUtils.setFileString_async(this.getInput(), content);

            this.setDirty(false);
        }

        protected async onEditorInputContentChangedByExternalEditor() {

            this.deepUpdateEditor();
        }

        private async deepUpdateEditor() {

            console.log("AnimationsEditor.deepUpdate()");

            const scene = this.getScene();

            for (const obj of scene.sys.displayList.list) {

                obj.destroy();
            }

            scene.sys.displayList.removeAll();
            scene.sys.updateList.removeAll();

            const str = colibri.ui.ide.FileUtils.getFileString(this.getInput());

            const data = JSON.parse(str);

            const maker = this.getScene().getMaker();

            await maker.preload();

            this._overlayLayer.setLoading(true);

            await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());

            this._overlayLayer.setLoading(false);

            this.reset(data, false);
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

            this.runOperation(() => {

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

                const viewer = new controls.viewers.TreeViewer(
                    "phasereditor2d.animations.ui.editors.AnimationsEditor.NewAnimation");
                viewer.setLabelProvider(this._blocksProvider.getLabelProvider());
                viewer.setContentProvider(this._blocksProvider.getContentProvider());
                viewer.setCellRendererProvider(this._blocksProvider.getCellRendererProvider());
                viewer.setTreeRenderer(this._blocksProvider.getTreeViewerRenderer(viewer));
                viewer.setInput(this._blocksProvider.getInput());

                const framesDialog = new controls.dialogs.ViewerDialog(viewer, true);
                framesDialog.setSize(window.innerWidth * 2 / 3, window.innerHeight * 2 / 3)
                framesDialog.create();
                framesDialog.setLocation(undefined, window.innerHeight * 1 / 8);
                framesDialog.setTitle("Select Frames");
                framesDialog.addOpenButton("Select", sel => {

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

                        this.runAddAnimationsOperation(data, () => {

                            this.reset(data, false);

                            this.setSelection([this.getAnimation(name)]);

                            this.getElement().focus();

                            colibri.Platform.getWorkbench().setActivePart(this);
                        });
                    }
                });
                framesDialog.addCancelButton();
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
            }
        }

        private async updateIfDependenciesChanged() {

            const hash = await this.getScene().getMaker().buildDependenciesHash();

            if (hash !== this._currentDependenciesHash) {

                this._currentDependenciesHash = hash;

                this.deepUpdateEditor();
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

        async runAddAnimationsOperation(data: Phaser.Types.Animations.JSONAnimations, op: () => void) {

            const maker = this._scene.getMaker();

            await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());

            this.runOperation(op);
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

            for (const sprite of scene.getSprites()) {

                sprite.destroy();
            }

            scene.sys.displayList.removeAll();

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