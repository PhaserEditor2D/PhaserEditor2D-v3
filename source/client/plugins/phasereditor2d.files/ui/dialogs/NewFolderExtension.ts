namespace phasereditor2d.files.ui.dialogs {

    export class NewFolderExtension extends NewFileExtension {

        constructor() {
            super({
                dialogName: "Folder",
                dialogIcon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER),
                initialFileName: "folder"
            });
        }

        createDialog(): BaseNewFileDialog {

            const dlg = new NewFolderDialog();

            dlg.create();

            return dlg;
        }
    }
}