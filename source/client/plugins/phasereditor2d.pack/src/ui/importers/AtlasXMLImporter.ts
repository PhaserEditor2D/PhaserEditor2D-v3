/// <reference path="./BaseAtlasImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class AtlasXMLImporter extends BaseAtlasImporter {

        constructor() {
            super(core.contentTypes.CONTENT_TYPE_ATLAS_XML, core.ATLAS_XML_TYPE);
        }
    }

}