/// <reference path="./Importer.ts" />

namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class MultiatlasImporter extends ContentTypeImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_MULTI_ATLAS, core.MULTI_ATLAS_TYPE);
        }

        createItemData(pack: core.AssetPack, file: io.FilePath) {
            return {
                type: core.MULTI_ATLAS_TYPE,
                url: pack.getUrlFromAssetFile(file),
                path: pack.getUrlFromAssetFile(file.getParent()),
            };
        }
    }

}