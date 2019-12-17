/// <reference path="./BaseAtlasImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class UnityAtlasImporter extends BaseAtlasImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_UNITY_ATLAS, core.UNITY_ATLAS_TYPE);
        }
    }

}