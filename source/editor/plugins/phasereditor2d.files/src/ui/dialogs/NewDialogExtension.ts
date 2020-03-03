namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class NewDialogExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.dialogs.NewDialogExtension";

        private _dialogName: string;
        private _dialogIcon: controls.IImage;

        constructor(
            config: {
                dialogName: string,
                dialogIcon: controls.IImage
            }) {

            super(NewDialogExtension.POINT_ID);

            this._dialogName = config.dialogName;
            this._dialogIcon = config.dialogIcon;
        }

        getDialogName() {
            return this._dialogName;
        }

        getDialogIcon() {
            return this._dialogIcon;
        }

        abstract createDialog(args: {
            initialFileLocation: io.FilePath
        }): controls.dialogs.Dialog;
    }
}