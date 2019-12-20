namespace colibri.ui.ide {

    export interface IEditorInput {

        getEditorInputExtension(): string;
    }
}

namespace colibri.core.io {

    export interface FilePath extends colibri.ui.ide.IEditorInput {

    }
}