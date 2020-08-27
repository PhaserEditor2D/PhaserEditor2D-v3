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
        private _outlineProvider: any;

        static getFactory() {

            return this._factory ?? (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS, () => new AnimationsEditor()
            ));
        }

        constructor() {
            super(AnimationsEditor.ID);

            this.addClass("AnimationsEditor");

            this._outlineProvider = new AnimationsEditorOutlineProvider(this);
        }

        protected onEditorInputContentChangedByExternalEditor() {

            // nothing
        }

        getScene() {

            return this._scene;
        }

        getOverlayLayer() {

            return this._overlayLayer;
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

                // if (this._editorState) {

                //     if (this._editorState) {

                //         this._cameraManager.setState(this._editorState.cameraState);
                //     }

                //     this._editorState = null;
                // }

                // this._currentRefreshHash = await this.buildDependenciesHash();

            }

            this.layout();

            this.repaint();

            this.refreshOutline();
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

                this._scene.events.once(Phaser.Scenes.Events.POST_UPDATE, () => this.repaint());

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

                this.repaint();

                this._scene.events.once(Phaser.Scenes.Events.POST_UPDATE, () => this.repaint());
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

        getEditorViewerProvider(key: string) {

            if (key === outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY) {

                return this._outlineProvider;
            }

            return null;
        }
    }
}