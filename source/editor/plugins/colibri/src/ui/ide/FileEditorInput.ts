namespace colibri.core.io {

    // tslint:disable-next-line:interface-name
    export interface FilePath extends colibri.ui.ide.IEditorInput {
        // nothing
    }

    FilePath.prototype.getEditorInputExtension = () => ui.ide.FileEditorInputExtension.ID;
}
