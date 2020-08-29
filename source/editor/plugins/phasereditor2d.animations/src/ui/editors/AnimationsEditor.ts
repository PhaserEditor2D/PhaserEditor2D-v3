namespace phasereditor2d.animations.ui.editors {

    import FileUtils = colibri.ui.ide.FileUtils;

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

        protected onEditorInputContentChangedByExternalEditor() {

            //TODO
        }

        getScene() {

            return this._scene;
        }

        getOverlayLayer() {

            return this._overlayLayer;
        }

        selectAll() {

            this.setSelection(this.getAllAnimations());
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
        }

        refreshOutline() {

            this._outlineProvider.repaint();
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

        onPartActivated() {

            super.onPartActivated();

            if (this._gameBooted && !this._game.loop.running) {

                this._game.loop.start(this._game.loop.callback);
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

        runOperation(op: () => void, useAnimationIndexAsKey = false) {

            const before = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            op();

            const after = AnimationsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new AnimationsEditorSnapshotOperation(this, before, after, useAnimationIndexAsKey));
        }

        getSelectedAnimations() {

            const used = new Set();

            const list = [];

            const map = this.buildAnimationFrame_AnimationMap();

            for (const obj of this.getSelection()) {

                let anim: Phaser.Animations.Animation;

                if (obj instanceof Phaser.Animations.Animation) {

                    anim = obj;

                } else {

                    const frame = obj as Phaser.Animations.AnimationFrame;

                    anim = map.get(frame);
                }

                if (anim && !used.has(anim)) {

                    used.add(anim);
                    list.push(anim);
                }
            }

            return list;
        }

        getAllAnimations() {

            return this._scene.anims["anims"].getArray();
        }

        buildAnimationFrame_AnimationMap() {

            const map = new Map<Phaser.Animations.AnimationFrame, Phaser.Animations.Animation>();

            for (const anim of this.getAllAnimations()) {

                for (const frame of anim.frames) {

                    map.set(frame, anim);
                }
            }

            return map;
        }

        reset(animsData: Phaser.Types.Animations.JSONAnimations, useAnimationIndexAsKey: boolean) {

            let selectedIndexes: number[];

            if (useAnimationIndexAsKey) {

                const allAnimations = this.getAllAnimations();

                selectedIndexes = this.getSelectedAnimations().map(anim => allAnimations.indexOf(anim));
            }

            const scene = this.getScene();

            for (const sprite of scene.getSprites()) {

                sprite.destroy();
            }

            scene.sys.displayList.removeAll();

            scene.getMaker().createScene(animsData);

            this.refreshOutline();

            if (useAnimationIndexAsKey) {

                const allAnimations = this.getAllAnimations();

                this.setSelection(selectedIndexes.map(i => allAnimations[i]));

            } else {

                this.setSelection(this.getSelection().map(obj => {

                    if (obj instanceof Phaser.Animations.Animation) {

                        return scene.anims.get(obj.key);
                    }

                }).filter(o => {

                    return o !== undefined && o !== null
                }));
            }
        }
    }
}