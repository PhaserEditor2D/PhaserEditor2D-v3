namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class BitmapFontPreviewSection

        extends colibri.ui.ide.properties.BaseImagePreviewSection<core.BitmapFontAssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.BitmapFontPreviewSection", "Bitmap Font Preview", true);
        }

        protected getSelectedImage() {

            const obj = this.getSelection()[0];

            const img = core.AssetPackUtils.getImageFromPackUrl(obj.getData().textureURL);

            return img;
        }

        canEdit(obj: any): boolean {
            return obj instanceof core.BitmapFontAssetPackItem;
        }
    }
}