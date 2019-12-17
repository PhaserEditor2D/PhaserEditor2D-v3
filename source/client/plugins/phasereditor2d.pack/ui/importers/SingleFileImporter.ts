/// <reference path="./Importer.ts" />

namespace phasereditor2d.pack.ui.importers {

    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class SingleFileImporter extends ContentTypeImporter {
        private _urlIsArray: boolean;
        private _defaultValues: any;

        constructor(contentType: string, assetPackType: string, urlIsArray: boolean = false, defaultValues : any = {}) {
            super(contentType, assetPackType);

            this._urlIsArray = urlIsArray;
            this._defaultValues = defaultValues;
        }

        acceptFile(file: io.FilePath): boolean {

            const fileContentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            return fileContentType === this.getContentType();
        }

        createItemData(file: io.FilePath): any {

            const url = core.AssetPackUtils.getFilePackUrl(file);

            const data = {
                url: this._urlIsArray ? [url] : url
            };

            for(const k in this._defaultValues) {
                data[k] = this._defaultValues[k];
            }

            return data;
        }
    }

}