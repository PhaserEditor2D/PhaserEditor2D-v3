/// <reference path="./Importer.ts" />

namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class MultiatlasImporter extends ContentTypeImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_MULTI_ATLAS, core.MULTI_ATLAS_TYPE);
        }

        createItemData(file: io.FilePath) {
            return {
                type: core.MULTI_ATLAS_TYPE,
                url: core.AssetPackUtils.getFilePackUrl(file),
                path: core.AssetPackUtils.getFilePackUrl(file.getParent()),
            }
        }
    }

}