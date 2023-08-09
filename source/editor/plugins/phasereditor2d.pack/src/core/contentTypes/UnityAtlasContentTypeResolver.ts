namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_UNITY_ATLAS = "phasereditor2d.pack.core.unityAtlas";

    export class UnityAtlasContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.unityAtlas";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "meta") {

                return CONTENT_TYPE_UNITY_ATLAS;
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }
    }
}