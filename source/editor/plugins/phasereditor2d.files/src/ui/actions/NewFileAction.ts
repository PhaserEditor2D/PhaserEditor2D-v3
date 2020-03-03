namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class NewFileAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        constructor(view: views.FilesView) {
            super(view, {
                text: "New...",
                commandId: CMD_NEW_FILE,
                enabled: true
            });
        }

        run() {

            const openDialogAction = new actions.OpenNewFileDialogAction();

            let folder = this.getViewViewer().getSelectionFirstElement() as io.FilePath;

            if (folder) {

                if (folder.isFile()) {
                    folder = folder.getParent();
                }

                openDialogAction.setInitialLocation(folder);
            }

            openDialogAction.run();
        }
    }
}