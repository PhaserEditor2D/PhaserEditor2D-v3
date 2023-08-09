namespace phasereditor2d.pack.core.contentTypes {

    export const CONTENT_TYPE_SPINE_ATLAS = "phasereditor2d.pack.core.spineAtlas";

    export class SpineAtlasContentTypeResolver extends colibri.core.ContentTypeResolverByExtension {

        constructor() {
            super("phasereditor2d.pack.core.contentTypes.spineAtlas", [
                ["atlas", CONTENT_TYPE_SPINE_ATLAS]
            ]);
        }
    }
}