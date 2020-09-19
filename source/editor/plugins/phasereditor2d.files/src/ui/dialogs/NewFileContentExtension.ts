/// <reference path="./NewFileExtension.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class NewFileContentExtension extends NewFileExtension {

        private _fileExtension: string;
        private _openInEditor: boolean;
        private _createdCallback: (file: io.FilePath) => void;

        constructor(config: {
            dialogName: string,
            dialogIconDescriptor: controls.IconDescriptor,
            initialFileName: string,
            fileExtension: string,
        }) {
            super(config);

            this._fileExtension = config.fileExtension;

            this._openInEditor = true;
        }

        isOpenInEditor() {

            return this._openInEditor;
        }

        setOpenInEditor(openInEditor: boolean) {

            this._openInEditor = openInEditor;
        }

        getCreatedCallback() {

            return this._createdCallback;
        }

        setCreatedCallback(callback: (file: io.FilePath) => void) {

            this._createdCallback = callback;
        }

        abstract getCreateFileContentFunc(): (args: ICreateFileContentArgs) => string;

        createDialog(args: {
            initialFileLocation: io.FilePath
        }) {
            const dlg = new files.ui.dialogs.NewFileDialog();

            dlg.create();

            dlg.setFileExtension(this._fileExtension);
            dlg.setCreateFileContent(this.getCreateFileContentFunc());
            dlg.setFileCreatedCallback(async (file) => {

                const wb = colibri.Platform.getWorkbench();

                const reg = wb.getContentTypeRegistry();

                await reg.preload(file);

                if (this._openInEditor) {

                    wb.openEditor(file);
                }

                if (this._createdCallback) {

                    this._createdCallback(file);
                }
            });

            dlg.setInitialFileName(this.getInitialFileName());
            dlg.setInitialLocation(args.initialFileLocation ?? this.getInitialFileLocation());
            dlg.validate();

            return dlg;
        }
    }
}