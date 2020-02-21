namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class UploadDialog extends controls.dialogs.ViewerDialog {

        private _uploadFolder: io.FilePath;

        constructor(uploadFolder: io.FilePath) {
            super(new controls.viewers.TreeViewer());

            this._uploadFolder = uploadFolder;
        }

        create() {

            const filesViewer = this.getViewer();
            filesViewer.setLabelProvider(new viewers.InputFileLabelProvider());
            filesViewer.setCellRendererProvider(new viewers.InputFileCellRendererProvider());
            filesViewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            filesViewer.setInput([]);

            super.create();

            const filesInput = document.createElement("input");

            this.setTitle("Upload Files");

            const uploadBtn = super.addButton("Upload", () => { /* nothing */ });

            uploadBtn.disabled = true;

            uploadBtn.disabled = true;
            uploadBtn.innerText = "Upload";
            uploadBtn.addEventListener("click", async (e) => {

                const input = filesViewer.getInput() as File[];

                const files = input.slice();

                const uploadFolder = this._uploadFolder;

                const cancelFlag = {
                    canceled: false
                };

                const dlg = new controls.dialogs.ProgressDialog();
                dlg.create();
                dlg.setTitle("Uploading");
                dlg.setCloseWithEscapeKey(false);

                {
                    const btn = dlg.addButton("Cancel", () => {

                        if (cancelFlag.canceled) {
                            return;
                        }

                        cancelFlag.canceled = true;

                        btn.innerText = "Canceling";
                    });
                }

                dlg.setProgress(0);

                const ioFiles: io.FilePath[] = [];

                for (const file of files) {

                    if (cancelFlag.canceled) {

                        dlg.close();
                        break;
                    }

                    try {

                        const ioFile = await colibri.ui.ide.FileUtils.uploadFile_async(uploadFolder, file);

                        ioFiles.push(ioFile);

                    } catch (error) {
                        break;
                    }

                    input.shift();

                    filesViewer.repaint();

                    dlg.setProgress(1 - (input.length / files.length));
                }

                dlg.close();

                if (ioFiles.length > 0) {

                    const view = colibri.ui.ide.Workbench
                        .getWorkbench()
                        .getActiveWindow()
                        .getView(views.FilesView.ID) as views.FilesView;

                    view.getViewer().setSelection(ioFiles);
                    view.getViewer().reveal(ioFiles[0]);
                    view.getViewer().repaint();
                }

                this.close();
            });

            super.addButton("Browse", () => {

                filesInput.click();
            });

            filesInput.type = "file";
            filesInput.name = "files";
            filesInput.multiple = true;
            filesInput.addEventListener("change", e => {

                const files = filesInput.files;

                const input = [];

                for (let i = 0; i < files.length; i++) {
                    input.push(files.item(i));
                }

                filesViewer.setInput(input);

                filesViewer.repaint();

                uploadBtn.disabled = input.length === 0;

                uploadBtn.textContent = input.length === 0 ? "Upload" : "Upload " + input.length + " Files";
            });

            super.addButton("Cancel", () => this.close());
        }
    }
}