namespace colibri.core.io {

    // tslint:disable-next-line:no-empty-interface
    export interface FilePath extends colibri.ui.ide.IEditorInput {

    }

    FilePath.prototype.getEditorInputExtension = () => ui.ide.FileEditorInputExtension.ID;
}
