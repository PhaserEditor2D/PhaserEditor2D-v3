namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
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
                text: "Delete",
                enabled: DeleteFilesAction.isEnabled(view)
            });
        }

        run() {

            const files = this.getViewViewerSelection();

            if (confirm(`Do you want to delete ${files.length} files?\This operation cannot be undone.`)) {

                if (files.length > 0) {

                    colibri.ui.ide.FileUtils.deleteFiles_async(files);
                }
            }
        }
    }
}