namespace phasereditor2d.pack.ui.importers {

    export class BitmapFontImporter extends ContentTypeImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_BITMAP_FONT, core.BITMAP_FONT_TYPE);
        }

        createItemData(file: colibri.core.io.FilePath) {
            return {
                textureURL: core.AssetPackUtils.getFilePackUrlWithNewExtension(file, "png"),
                fontDataURL: core.AssetPackUtils.getFilePackUrl(file)
            }
        }
    }
}