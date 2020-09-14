namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class NewDialogExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.dialogs.NewDialogExtension";

        private _dialogName: string;
        private _dialogIconDescriptor: controls.IconDescriptor;

        constructor(
            config: {
                dialogName: string,
                dialogIconDescriptor: controls.IconDescriptor,
            }) {

            super(NewDialogExtension.POINT_ID);

            this._dialogName = config.dialogName;
            this._dialogIconDescriptor = config.dialogIconDescriptor;
        }

        getDialogName() {
            return this._dialogName;
        }

        getDialogIcon() {

            return this._dialogIconDescriptor.getIcon();
        }

        abstract createDialog(args: {
            initialFileLocation: io.FilePath
        }): controls.dialogs.Dialog;
    }
}