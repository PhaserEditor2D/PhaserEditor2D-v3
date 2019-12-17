namespace phasereditor2d.files.ui.dialogs {

    export class NewFolderExtension extends NewFileExtension {

        constructor() {
            super({
                icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER),
                initialFileName: "folder",
                wizardName: "Folder"
            });
        }

        createDialog(): BaseNewFileDialog {
            
            const dlg = new NewFolderDialog();
            
            dlg.create();

            return dlg;
        }
    }
}