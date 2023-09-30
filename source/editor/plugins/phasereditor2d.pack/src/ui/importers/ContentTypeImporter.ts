/// <reference path="./Importer.ts" />

namespace phasereditor2d.pack.ui.importers {

    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export abstract class ContentTypeImporter extends Importer {

        private _contentType: string;

        constructor(contentType: string, assetPackItemType: string) {
            super(assetPackItemType);

            this._contentType = contentType;
        }

        getContentType() {
            
            return this._contentType;
        }

        acceptFile(file: io.FilePath): boolean {

            const fileContentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            return fileContentType === this._contentType;
        }
    }

}