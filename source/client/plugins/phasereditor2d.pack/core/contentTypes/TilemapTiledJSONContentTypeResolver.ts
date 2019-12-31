namespace phasereditor2d.pack.core.contentTypes {

    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_TILEMAP_TILED_JSON = "phasereditor2d.pack.core.contentTypes.tilemapTiledJSON";

    export class TilemapTiledJSONContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string {
            return "phasereditor2d.pack.core.contentTypes.TilemapTiledJSONContentTypeResolver";
        }

        async computeContentType(file: colibri.core.io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (Array.isArray(data.layers)
                        && Array.isArray(data.tilesets)
                        && typeof (data.tilewidth === "number")
                        && typeof (data.tileheight)) {

                        return CONTENT_TYPE_TILEMAP_TILED_JSON;
                    }

                } catch (e) {
                    // nothing
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }
    }
}