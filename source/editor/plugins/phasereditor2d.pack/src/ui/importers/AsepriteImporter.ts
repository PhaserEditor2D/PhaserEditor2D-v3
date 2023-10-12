/// <reference path="./BaseAtlasImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class AsepriteImporter extends BaseAtlasImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_ASEPRITE, core.ASEPRITE_TYPE);
        }
    }
}