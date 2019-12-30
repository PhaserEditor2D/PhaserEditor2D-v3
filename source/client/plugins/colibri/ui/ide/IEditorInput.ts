namespace colibri.ui.ide {

    export interface IEditorInput {

        getEditorInputExtension(): string;
    }
}

namespace colibri.core.io {

    // tslint:disable-next-line:no-empty-interface
    export interface FilePath extends colibri.ui.ide.IEditorInput {

    }
}