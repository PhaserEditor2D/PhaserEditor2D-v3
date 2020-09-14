namespace phasereditor2d.files.ui.dialogs {

    import io = colibri.core.io;

    export class NewFolderExtension extends NewFileExtension {

        constructor() {
            super({
                dialogName: "Folder",
                dialogIconDescriptor: colibri.ColibriPlugin.getInstance().getIconDescriptor(colibri.ICON_FOLDER),
                initialFileName: "folder"
            });
        }

        createDialog(args: {
            initialFileLocation: io.FilePath
        }): BaseNewFileDialog {

            const dlg = new NewFolderDialog();

            dlg.create();

            dlg.setInitialFileName(this.getInitialFileName());
            dlg.setInitialLocation(args.initialFileLocation ?? this.getInitialFileLocation());
            dlg.validate();

            return dlg;
        }
    }
}