namespace phasereditor2d.ide.ui.dialogs {

    import io = colibri.core.io;

    export class NewProjectDialogExtension extends files.ui.dialogs.NewDialogExtension {

        constructor() {
            super({
                dialogName: "Project",
                dialogIcon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER)
            });
        }

        createDialog(args: {
            initialFileLocation: io.FilePath
        }): colibri.ui.controls.dialogs.Dialog {

            const dlg = new NewProjectDialog();

            dlg.create();

            return dlg;
        }
    }
}