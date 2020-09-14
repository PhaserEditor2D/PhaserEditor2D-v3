namespace phasereditor2d.ide.ui.dialogs {

    import io = colibri.core.io;

    export class NewProjectDialogExtension extends files.ui.dialogs.NewDialogExtension {

        constructor() {
            super({
                dialogName: "Project",
                dialogIconDescriptor: files.FilesPlugin.getInstance().getIconDescriptor(files.ICON_PROJECT)
            });

            this.setPriority(Number.MAX_VALUE);
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