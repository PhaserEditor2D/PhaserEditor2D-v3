namespace phasereditor2d.files.ui.actions {

    import io = colibri.core.io;

    export class DeleteFilesAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        static isEnabled(view: views.FilesView): boolean {

            const sel = view.getViewer().getSelection();

            if (sel.length > 0) {

                for (const obj of sel) {

                    const file = obj as io.FilePath;

                    if (!file.getParent()) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        constructor(view: views.FilesView) {
            super(view, {
                commandId: colibri.ui.ide.actions.CMD_DELETE,
                enabled: DeleteFilesAction.isEnabled(view)
            });
        }

        async run() {

            const files = this.getViewViewerSelection();

            if (confirm(`Do you want to delete ${files.length} files?\This operation cannot be undone.`)) {

                if (files.length > 0) {

                    await colibri.ui.ide.FileUtils.deleteFiles_async(files);

                    blocks.BlocksPlugin.getInstance().refreshBlocksView();
                }
            }
        }
    }
}