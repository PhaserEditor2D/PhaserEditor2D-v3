namespace phasereditor2d.pack.ui.editor {

    export interface ImportData {
        importer: importers.Importer;
        files: colibri.core.io.FilePath[];
    }
}