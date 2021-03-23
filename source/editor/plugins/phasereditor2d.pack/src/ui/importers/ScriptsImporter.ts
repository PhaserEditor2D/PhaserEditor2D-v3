namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class ScriptsImporter extends ContentTypeImporter {

        constructor() {
            super(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCRIPTS_TYPE);

            this.setMultipleFiles(true);
        }

        createItemData(pack: core.AssetPack, files: io.FilePath[]): any {

            const data = {
                url: files.map(file => pack.getUrlFromAssetFile(file))
            };

            return data;
        }
    }
}