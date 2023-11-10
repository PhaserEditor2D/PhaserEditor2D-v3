namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class AnimationPreviewDialog extends controls.dialogs.Dialog {
        private _previewManager: AnimationPreviewManager;
        private _animationAsset: pack.core.BaseAnimationsAssetPackItem;
        private _config: Phaser.Types.Animations.PlayAnimationConfig;

        constructor(animationAsset: pack.core.BaseAnimationsAssetPackItem, config: Phaser.Types.Animations.PlayAnimationConfig) {
            super();

            const size = Math.min(window.innerWidth * 0.5, window.innerHeight * 0.5);

            this.setSize(size, size);

            this._animationAsset = animationAsset;
            this._config = config;
        }

        protected createDialogArea(): void {

            const clientArea = document.createElement("div")

            clientArea.classList.add("DialogClientArea");

            this.getElement().appendChild(clientArea);

            this._previewManager = new AnimationPreviewManager(clientArea);
        }

        createUI() {

            const finder = new pack.core.PackFinder();

            finder.preload().then(() => {

                setTimeout(() => {

                    this._previewManager.createGame({
                        animationAsset: this._animationAsset,
                        config: this._config,
                        finder
                    });
                }, 10);
            });
        }

        create(hideParentDialog?: boolean): void {

            super.create(hideParentDialog);

            this.createUI();

            this.setTitle("Animation Preview");

            this.addButton("Close", () => this.close());

            this.addButton("Play", () => {

                this._previewManager.play(false);
            });

            this.addButton("Play Repeat", () => {

                this._previewManager.play(true);
            });

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}