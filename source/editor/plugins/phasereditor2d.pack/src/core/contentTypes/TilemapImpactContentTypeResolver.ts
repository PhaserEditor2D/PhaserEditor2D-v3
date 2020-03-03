namespace phasereditor2d.pack.core.contentTypes {

    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_TILEMAP_IMPACT = "phasereditor2d.pack.core.contentTypes.tilemapImpact";

    export class TilemapImpactContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string {
            return "phasereditor2d.pack.core.contentTypes.TilemapImpactContentTypeResolver";
        }

        async computeContentType(file: colibri.core.io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (Array.isArray(data.entities) && Array.isArray(data.layer)) {
                        return CONTENT_TYPE_TILEMAP_IMPACT;
                    }

                } catch (e) {
                    // nothing
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }
    }
}