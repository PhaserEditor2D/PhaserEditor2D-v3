/// <reference path="./BaseNewFileDialog.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import viewers = colibri.ui.controls.viewers;
    import io = colibri.core.io;

    export class NewFileDialog extends BaseNewFileDialog {

        private _fileExtension: string;
        private _fileContent: string;

        constructor() {
            super();

            this._fileExtension = "";
            this._fileContent = "";
        }

        protected normalizedFileName() {

            const name = super.normalizedFileName();

            if (name.endsWith("." + this._fileExtension)) {
                return name;
            }

            return name + "." + this._fileExtension;
        }


        setFileContent(fileContent: string) {
            this._fileContent = fileContent;
        }

        setFileExtension(fileExtension: string) {
            this._fileExtension = fileExtension;
        }

        protected createFile(folder : io.FilePath, name : string) {
            return colibri.ui.ide.FileUtils.createFile_async(folder, name, this._fileContent);
        }

    }
}