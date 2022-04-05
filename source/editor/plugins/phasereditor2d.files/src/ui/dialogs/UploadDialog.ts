namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class UploadDialog extends controls.dialogs.ViewerDialog {

        private _uploadFolder: io.FilePath;
        private _uploadBtnElement: HTMLButtonElement;

        constructor(uploadFolder: io.FilePath) {
            super(new controls.viewers.TreeViewer("phasereditor2d.files.ui.dialogs.UploadDialog"), false);

            this._uploadFolder = uploadFolder;
        }

        async create() {

            const filesViewer = this.getViewer();
            filesViewer.setLabelProvider(new viewers.InputFileLabelProvider());
            filesViewer.setCellRendererProvider(new viewers.InputFileCellRendererProvider());
            filesViewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            filesViewer.setInput([]);

            const dropArea = filesViewer.getElement();

            const preventDefaults = (e: Event) => {

                e.preventDefault();
                e.stopPropagation();
            };

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {

                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            dropArea.addEventListener("dragenter", e => {

                dropArea.classList.add("FilesDragEnter");
            });

            dropArea.addEventListener("dragleave", e => {

                dropArea.classList.remove("FilesDragEnter");
            });

            filesViewer.getElement().addEventListener("drop", e => {

                dropArea.classList.remove("FilesDragEnter");
                this.prepareFilesForUpload(e.dataTransfer.files);
            });

            super.create();

            const filesInputElement = document.createElement("input");

            this.setTitle("Upload Files");

            this._uploadBtnElement = super.addButton("Upload", () => { /* nothing */ });
            this._uploadBtnElement.disabled = true;
            this._uploadBtnElement.innerText = "Upload";
            this._uploadBtnElement.addEventListener("click", async (e) => {

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

                    const wb = colibri.ui.ide.Workbench.getWorkbench();

                    for (const file of ioFiles) {

                        await wb.getContentTypeRegistry().preload(file);
                    }

                    const view = wb.getActiveWindow()
                        .getView(views.FilesView.ID) as views.FilesView;

                    view.getViewer().setSelection(ioFiles);
                    view.getViewer().reveal(ioFiles[0]);
                    view.getViewer().repaint();
                }

                this.close();

                blocks.BlocksPlugin.getInstance().refreshBlocksView();
            });

            super.addButton("Browse", () => {

                filesInputElement.click();
            });

            filesInputElement.type = "file";
            filesInputElement.name = "files";
            filesInputElement.multiple = true;
            filesInputElement.addEventListener("change", e => {

                const files = filesInputElement.files;

                this.prepareFilesForUpload(files);
            });

            super.addButton("Cancel", () => this.close());
        }

        private prepareFilesForUpload(files: FileList) {
            
            const newFiles = [];

            for (let i = 0; i < files.length; i++) {

                const file = files.item(i);

                newFiles.push(file);
            }

            const input = this.getViewer().getInput() as any[];

            input.push(...newFiles);

            this.getViewer().setInput(input);

            this.getViewer().repaint();

            this._uploadBtnElement.disabled = input.length === 0;

            this._uploadBtnElement.textContent = input.length === 0 ? "Upload" : "Upload " + input.length + " Files";
        }
    }
}