namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_MULTI_ATLAS = "phasereditor2d.pack.core.multiAtlas";

    export class MultiatlasContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.atlasHashOrArray";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (data.hasOwnProperty("textures")) {

                        const frames = data["textures"];

                        if (typeof (frames) === "object") {
                            return CONTENT_TYPE_MULTI_ATLAS;
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