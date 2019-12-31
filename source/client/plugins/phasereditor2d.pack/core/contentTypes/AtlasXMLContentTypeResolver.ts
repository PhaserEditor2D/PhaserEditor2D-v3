namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_ATLAS_XML = "phasereditor2d.pack.core.atlasXML";

    export class AtlasXMLContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.atlasXML";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "xml") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                const parser = new DOMParser();

                const xmlDoc = parser.parseFromString(content, "text/xml");

                const elements = xmlDoc.getElementsByTagName("TextureAtlas");

                if (elements.length === 1) {
                    return CONTENT_TYPE_ATLAS_XML;
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }

    }

}