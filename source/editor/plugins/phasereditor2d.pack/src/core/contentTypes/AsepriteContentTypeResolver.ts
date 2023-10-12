namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_ASEPRITE = "Aseprite";

    export class AsepriteContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.AsepriteContentTypeResolver";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (data.meta) {

                        const app = data.meta.app || "";

                        if (app.indexOf("www.aseprite.org") >= 0) {

                            return CONTENT_TYPE_ASEPRITE;
                        }
                    }

                } catch (e) {
                    // nothing
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }

    }

}