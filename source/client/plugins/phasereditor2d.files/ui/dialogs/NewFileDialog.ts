/// <reference path="./BaseNewFileDialog.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import io = colibri.core.io;

    export interface ICreateFileContentArgs {

        folder: io.FilePath;
        fileName: string;
    }

    export class NewFileDialog extends BaseNewFileDialog {

        private _fileExtension: string;
        private _createFileContentFunc: (args: ICreateFileContentArgs) => string;

        constructor() {
            super();

            this._fileExtension = "";
            this._createFileContentFunc = args => "";
        }

        protected normalizedFileName() {

            const name = super.normalizedFileName();

            if (this._fileExtension === "") {
                return name;
            }

            if (name.endsWith("." + this._fileExtension)) {
                return name;
            }

            return name + "." + this._fileExtension;
        }

        setCreateFileContent(createFileContent: (args: ICreateFileContentArgs) => string) {
            this._createFileContentFunc = createFileContent;
        }

        setFileExtension(fileExtension: string) {
            this._fileExtension = fileExtension;
        }

        protected createFile(folder: io.FilePath, name: string) {

            const content = this._createFileContentFunc({
                folder,
                fileName: name
            });

            return colibri.ui.ide.FileUtils.createFile_async(folder, name, content);
        }
    }
}