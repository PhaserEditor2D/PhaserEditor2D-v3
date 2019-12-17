namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class BitmapFontSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.BitmapFontSection", "Bitmap Font");
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.BitmapFontAssetPackItem;
        }

        protected createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "Font Data URL", "fontDataURL", core.contentTypes.CONTENT_TYPE_BITMAP_FONT);

            this.createFileField(comp, "Texture URL", "textureURL", webContentTypes.core.CONTENT_TYPE_IMAGE);

            this.createFileField(comp, "Normal Map", "normalMap", webContentTypes.core.CONTENT_TYPE_IMAGE);
        }
    }
}