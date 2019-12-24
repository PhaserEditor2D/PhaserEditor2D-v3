namespace phasereditor2d.ide.ui.dialogs {

    export class NewProjectDialogExtension extends files.ui.dialogs.NewDialogExtension {

        constructor() {
            super({
                dialogName: "Project",
                dialogIcon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER)
            });
        }

        createDialog(): colibri.ui.controls.dialogs.Dialog {

            const dlg = new NewProjectDialog();

            dlg.create();

            return dlg;
        }
    }
}