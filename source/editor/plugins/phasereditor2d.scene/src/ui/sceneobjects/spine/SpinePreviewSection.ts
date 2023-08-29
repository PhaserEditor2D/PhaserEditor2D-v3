namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpinePreviewSection extends colibri.ui.ide.properties.BaseImagePreviewSection<pack.core.SpineSkinItem> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SpinePreviewSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, SpinePreviewSection.ID, "Spine Preview", true, false);
        }

        protected getSelectedImage(): controls.IImage {

            return ScenePlugin.getInstance()
                .getSpineThumbnailCache()
                .getImage(this.getSelectionFirstElement());
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.SpineSkinItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}