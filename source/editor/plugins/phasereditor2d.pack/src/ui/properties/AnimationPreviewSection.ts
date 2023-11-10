namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class AnimationPreviewSection
        extends colibri.ui.ide.properties.BaseImagePreviewSection<core.AnimationConfigInPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AnimationPreviewSection", "Animation Preview", true);
        }

        protected getSelectedImage(): controls.IImage {

            const anim = this.getSelection()[0];

            const img = anim.getPreviewImageAsset();

            return img;
        }

        canEdit(obj: any): boolean {

            return obj instanceof core.AnimationConfigInPackItem;
        }
    }
}