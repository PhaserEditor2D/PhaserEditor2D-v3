namespace phasereditor2d.pack.ui.editor {

    export interface IImportData {
        importer: importers.Importer;
        files: colibri.core.io.FilePath[];
    }
}