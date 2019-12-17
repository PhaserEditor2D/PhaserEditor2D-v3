namespace phasereditor2d.pack.core.contentTypes {

    import ide = colibri.ui.ide;
    import core = colibri.core;

    export const CONTENT_TYPE_ASSET_PACK = "phasereditor2d.pack.core.AssetContentType";

    export class AssetPackContentTypeResolver extends core.ContentTypeResolver {

        constructor() {
            super("phasereditor2d.pack.core.AssetPackContentTypeResolver");
        }

        async computeContentType(file: core.io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                if (content !== null) {

                    try {

                        const data = JSON.parse(content);

                        if (data.meta.contentType === CONTENT_TYPE_ASSET_PACK) {
                            return CONTENT_TYPE_ASSET_PACK;
                        }
                    } catch (e) {
                        // nothing
                    }
                }
            }

            return core.CONTENT_TYPE_ANY;
        }
    }
}