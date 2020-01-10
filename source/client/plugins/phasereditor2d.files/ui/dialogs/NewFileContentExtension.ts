/// <reference path="./NewFileExtension.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class NewFileContentExtension extends NewFileExtension {

        private _fileExtension: string;

        constructor(config: {
            dialogName: string,
            dialogIcon: controls.IImage,
            initialFileName: string,
            fileExtension: string
        }) {
            super(config);

            this._fileExtension = config.fileExtension;
        }

        abstract createFileContent(): string;

        createDialog(args: {
            initialFileLocation: io.FilePath
        }) {
            const dlg = new files.ui.dialogs.NewFileDialog();

            dlg.create();

            dlg.setFileExtension(this._fileExtension);
            dlg.setFileContent(this.createFileContent());
            dlg.setFileCreatedCallback(async (file) => {

                const wb = colibri.Platform.getWorkbench();

                const reg = wb.getContentTypeRegistry();

                await reg.preload(file);

                wb.openEditor(file);
            });

            dlg.setInitialFileName(this.getInitialFileName());
            dlg.setInitialLocation(args.initialFileLocation ?? this.getInitialFileLocation());
            dlg.validate();

            return dlg;
        }

    }
}