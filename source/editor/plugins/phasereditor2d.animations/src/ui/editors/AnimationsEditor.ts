namespace phasereditor2d.animations.ui.editors {

    import FileUtils = colibri.ui.ide.FileUtils;

    export class AnimationsEditor extends colibri.ui.ide.FileEditor {

        static ID = "phasereditor2d.animations.ui.editors.AnimationsEditor";

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        private _gameCanvas: HTMLCanvasElement;
        _scene: AnimationsScene;
        private _game: Phaser.Game;
        private _sceneRead: boolean;
        private _gameBooted: boolean;
        private _overlayLayer: AnimationsOverlayLayer;

        static getFactory() {

            return this._factory ?? (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS, () => new AnimationsEditor()
            ));
        }

        constructor() {
            super(AnimationsEditor.ID);

            this.addClass("AnimationsEditor");
        }

        protected onEditorInputContentChangedByExternalEditor() {

            // nothing
        }


        protected createPart(): void {

            const container = document.createElement("div");
            container.classList.add("AnimationsEditorContainer");

            this.getElement().appendChild(container);

            const pool = Phaser.Display.Canvas.CanvasPool;

            this._gameCanvas = pool.create2D(this.getElement(), 100, 100);

            this._gameCanvas.style.position = "absolute";

            this._overlayLayer = new AnimationsOverlayLayer(this);

            container.appendChild(this._overlayLayer.getCanvas());

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
                this._overlayLayer.render();

                if (errors.length > 0) {

                    alert(errors.join("<br>"));
                }

            } catch (e) {

                alert(e.message);

                throw e;
            }
        }

        refreshOutline() {

            // this._outlineProvider.repaint();
        }
    }
}