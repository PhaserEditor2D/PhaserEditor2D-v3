/// <reference path="./Importer.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class SpineAtlasImporter extends SingleFileImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_SPINE_ATLAS, core.SPINE_ATLAS_TYPE);
        }

        protected computeItemFromKey(file: colibri.core.io.FilePath): string {
            
            let key = file.getNameWithoutExtension();

            key = SpineImporter.removeSuffix(key, "-pma") + "-atlas";

            return key;
        }
    }
}