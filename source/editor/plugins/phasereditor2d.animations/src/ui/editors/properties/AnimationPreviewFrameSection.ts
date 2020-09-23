namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class AnimationPreviewFrameSection
        extends colibri.ui.ide.properties.BaseImagePreviewSection<Phaser.Animations.AnimationFrame> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.AnimationPreviewFrameSection",
                "Animation Frame Preview", true, false);
        }

        protected getSelectedImage(): colibri.ui.controls.IImage {

            const frame = this.getSelectionFirstElement();

            const finder = this.getEditor().getScene().getMaker().getPackFinder();

            const image = finder.getAssetPackItemImage(frame.textureKey, frame.textureFrame);

            return image;
        }

        private getEditor() {

            return colibri.Platform.getWorkbench().getActiveEditor() as AnimationsEditor;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.Animations.AnimationFrame;
        }
    }
}