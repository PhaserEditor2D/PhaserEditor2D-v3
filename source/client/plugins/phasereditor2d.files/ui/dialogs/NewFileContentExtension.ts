/// <reference path="./NewFileExtension.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;

    export abstract class NewFileContentExtension extends NewFileExtension {

        private _fileExtension : string;
        private _fileContent : string;

        constructor(config: {
            id: string,
            wizardName: string,
            icon: controls.IImage,
            initialFileName: string,
            fileExtension: string,
            fileContent: string
        }) {
            super(config);

            this._fileExtension = config.fileExtension;
            this._fileContent = config.fileContent;
        }

        createDialog() {
            const dlg = new files.ui.dialogs.NewFileDialog();

            dlg.create();

            dlg.setFileExtension(this._fileExtension);
            dlg.setFileContent(this._fileContent);
            dlg.setFileCreatedCallback(async (file) => {

                const wb = colibri.Platform.getWorkbench();

                const reg = wb.getContentTypeRegistry();

                await reg.preload(file);

                wb.openEditor(file);
            });

            return dlg;
        }

    }
}