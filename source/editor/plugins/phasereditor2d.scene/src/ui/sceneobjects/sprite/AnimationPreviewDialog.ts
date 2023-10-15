namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class AnimationPreviewDialog extends controls.dialogs.Dialog {
        private _previewManager: AnimationPreviewManager;
        private _animationAsset: pack.core.BaseAnimationsAssetPackItem;
        private _animationKey: string;

        constructor(animationAsset: pack.core.BaseAnimationsAssetPackItem, animationKey: string) {
            super();

            const size = Math.min(window.innerWidth * 0.5, window.innerHeight * 0.5);

            this.setSize(size, size);

            this._animationAsset = animationAsset;
            this._animationKey = animationKey;
        }

        protected createDialogArea(): void {

            const clientArea = document.createElement("div")

            clientArea.classList.add("DialogClientArea");

            const style = clientArea.style;

            style.width = "100%";
            style.height = "100%";

            this.getElement().appendChild(clientArea);

            this._previewManager = new AnimationPreviewManager(clientArea);
        }

        createUI() {

            const finder = new pack.core.PackFinder();

            finder.preload().then(() => {

                setTimeout(() => {

                    this._previewManager.createGame({
                        animationAsset: this._animationAsset,
                        animationKey: this._animationKey,
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

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}