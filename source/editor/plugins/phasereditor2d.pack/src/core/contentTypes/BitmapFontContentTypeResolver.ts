namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_BITMAP_FONT = "phasereditor2d.pack.core.bitmapFont";

    export class BitmapFontContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.BitmapFontContentTypeResolver";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "xml") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(content, "text/xml");
                const fontElements = xmlDoc.getElementsByTagName("font");
                const charsElements = xmlDoc.getElementsByTagName("chars");

                if (fontElements.length === 1 && charsElements.length === 1) {
                    return CONTENT_TYPE_BITMAP_FONT;
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }

    }

}