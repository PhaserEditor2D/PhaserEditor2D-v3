namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;

    export abstract class NewDialogExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.dialogs.NewDialogExtension";

        private _dialogName: string;
        private _dialogIcon: controls.IImage;

        constructor(config: {
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

        getIcon() {
            return this._dialogIcon;
        }


        abstract createDialog(): controls.dialogs.Dialog;
    }
}