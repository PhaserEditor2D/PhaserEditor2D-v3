namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class MoveFilesAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        static isEnabled(view: views.FilesView): boolean {
            return view.getViewer().getSelection().length > 0;
        }

        constructor(view: views.FilesView) {
            super(view, {
                text: "Move",
                enabled: MoveFilesAction.isEnabled(view)
            });
        }

        run() {

            const rootFolder = colibri.ui.ide.FileUtils.getRoot();

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.MoveFilesAction");

            viewer.setLabelProvider(new viewers.FileLabelProvider());
            viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
            viewer.setContentProvider(new viewers.FileTreeContentProvider(true));
            viewer.setInput(rootFolder);
            viewer.setExpanded(rootFolder, true);

            const dlg = new controls.dialogs.ViewerDialog(viewer, false);

            dlg.create();

            dlg.setTitle("Move Files");

            {
                const btn = dlg.addButton("Move", async () => {

                    const moveTo = viewer.getSelectionFirstElement() as io.FilePath;

                    const movingFiles = this.getViewViewer().getSelection();

                    await colibri.ui.ide.FileUtils.moveFiles_async(movingFiles, moveTo);

                    this.getViewViewer().reveal(movingFiles[0]);
                    this.getViewViewer().repaint();

                    blocks.BlocksPlugin.getInstance().refreshBlocksView();

                    dlg.close();
                });

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    const sel = viewer.getSelection();

                    let enabled = true;

                    if (sel.length !== 1) {

                        enabled = false;

                    } else {

                        const moveTo = sel[0] as io.FilePath;

                        for (const obj of this.getViewViewerSelection()) {

                            const file = obj as io.FilePath;

                            if (
                                moveTo.getFullName().startsWith(file.getFullName())
                                || moveTo === file.getParent()
                                || moveTo.getFile(file.getName())
                            ) {
                                enabled = false;
                                break;
                            }
                        }
                    }

                    btn.disabled = !enabled;
                });
            }

            dlg.addButton("Cancel", () => dlg.close());
        }
    }
}