/// <reference path="./BaseAtlasImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class AtlasImporter extends BaseAtlasImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_ATLAS, core.ATLAS_TYPE);
        }
    }
}