/// <reference path="./EditorInputExtension.ts" />

namespace colibri.ui.ide {

    export class FileEditorInputExtension extends EditorInputExtension {

        static ID = "colibri.ui.ide.FileEditorInputExtension";

        constructor() {
            super(FileEditorInputExtension.ID);
        }

        getEditorInputState(input: core.io.FilePath) {

            return {
                filePath: input.getFullName()
            };
        }

        createEditorInput(state: any): IEditorInput {

            return colibri.ui.ide.FileUtils.getFileFromPath(state.filePath);
        }

        getEditorInputId(input: core.io.FilePath): string {

            return input.getFullName();
        }
    }
}