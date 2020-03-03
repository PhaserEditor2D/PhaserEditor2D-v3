namespace phasereditor2d.files.ui.actions {

    import io = colibri.core.io;

    export class UploadFilesAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        constructor(view: views.FilesView) {
            super(view, {
                text: "Upload Files"
            });
        }

        run() {

            let folder = this.getViewViewer().getSelectionFirstElement();

            if (folder instanceof io.FilePath) {

                if (folder.isFile()) {

                    folder = folder.getParent();
                }

            } else {

                folder = colibri.ui.ide.FileUtils.getRoot();
            }

            const dlg = new dialogs.UploadDialog(folder);
            dlg.create();
        }
    }
}