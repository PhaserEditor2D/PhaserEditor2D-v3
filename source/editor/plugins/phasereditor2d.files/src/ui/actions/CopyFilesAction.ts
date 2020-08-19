namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class CopyFilesAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        constructor(view: views.FilesView) {
            super(view, {
                text: "Copy To"
            });
        }

        run() {

            const rootFolder = colibri.ui.ide.FileUtils.getRoot();

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.CopyFilesAction");

            viewer.setLabelProvider(new viewers.FileLabelProvider());
            viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
            viewer.setContentProvider(new viewers.FileTreeContentProvider(true));
            viewer.setInput(rootFolder);
            viewer.setExpanded(rootFolder, true);

            const dlg = new controls.dialogs.ViewerDialog(viewer, false);

            dlg.create();

            dlg.setTitle("Copy Files");

            {
                const btn = dlg.addButton("Copy", async () => {

                    const dstFile = viewer.getSelectionFirstElement() as io.FilePath;

                    const srcFiles = this.getViewViewer().getSelection();

                    const progressDlg = new controls.dialogs.ProgressDialog();

                    progressDlg.create();

                    progressDlg.setTitle("Copy");

                    const monitor = new controls.dialogs.ProgressDialogMonitor(progressDlg);

                    monitor.addTotal(srcFiles.length);

                    let lastAddedFile: io.FilePath;

                    for (const file of srcFiles) {

                        lastAddedFile = await colibri.ui.ide.FileUtils.copyFile_async(file, dstFile);

                        monitor.step();
                    }

                    progressDlg.close();

                    if (lastAddedFile) {
                        this.getViewViewer().reveal(lastAddedFile);
                    }

                    this.getViewViewer().repaint();

                    dlg.close();

                    blocks.BlocksPlugin.getInstance().refreshBlocksView();
                });

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    const sel = viewer.getSelection();

                    let enabled = true;

                    if (sel.length !== 1) {

                        enabled = false;

                    } else {

                        const copyTo = sel[0] as io.FilePath;

                        for (const obj of this.getViewViewerSelection()) {

                            const file = obj as io.FilePath;

                            if (
                                copyTo.getFullName().startsWith(file.getFullName())
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