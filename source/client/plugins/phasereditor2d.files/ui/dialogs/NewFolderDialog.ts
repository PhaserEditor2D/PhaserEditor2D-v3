namespace phasereditor2d.files.ui.dialogs {

    export class NewFolderDialog extends BaseNewFileDialog {

        protected async createFile(container: colibri.core.io.FilePath, name: string)
            : Promise<colibri.core.io.FilePath> {

            const folder = await colibri.ui.ide.FileUtils.createFolder_async(container, name);

            const window = colibri.Platform.getWorkbench().getActiveWindow();

            const view = window.getView(views.FilesView.ID) as views.FilesView;

            view.getViewer().reveal(folder);

            view.getViewer().setSelection([folder]);

            view.getViewer().repaint();

            return Promise.resolve(folder);
        }
    }
}