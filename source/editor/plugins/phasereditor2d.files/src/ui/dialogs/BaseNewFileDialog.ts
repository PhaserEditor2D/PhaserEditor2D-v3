namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import viewers = colibri.ui.controls.viewers;
    import io = colibri.core.io;

    export declare type CreateFileCallback = (folder: io.FilePath, filename: string) => void;

    export abstract class BaseNewFileDialog extends controls.dialogs.Dialog {

        protected _filteredViewer: controls.viewers.FilteredViewerInElement<controls.viewers.TreeViewer>;
        protected _fileNameText: HTMLInputElement;
        private _createBtn: HTMLButtonElement;
        private _fileCreatedCallback: (file: io.FilePath) => void;

        constructor() {
            super("NewFileDialog");

        }

        protected createDialogArea() {

            const clientArea = document.createElement("div");
            clientArea.classList.add("DialogClientArea");

            clientArea.style.display = "grid";
            clientArea.style.gridTemplateRows = "1fr auto";
            clientArea.style.gridTemplateRows = "1fr";
            clientArea.style.gridRowGap = "5px";

            clientArea.appendChild(this.createCenterArea());

            clientArea.appendChild(this.createBottomArea());

            this.getElement().appendChild(clientArea);
        }

        private createBottomArea() {

            const bottomArea = document.createElement("div");
            bottomArea.classList.add("DialogSection");
            bottomArea.style.display = "grid";
            bottomArea.style.gridTemplateColumns = "auto 1fr";
            bottomArea.style.gridTemplateRows = "auto";
            bottomArea.style.columnGap = "10px";
            bottomArea.style.rowGap = "10px";
            bottomArea.style.alignItems = "center";

            {
                const label = document.createElement("label");
                label.innerText = "Location";
                bottomArea.appendChild(label);

                const text = document.createElement("input");
                text.type = "text";
                text.readOnly = true;
                bottomArea.appendChild(text);

                this._filteredViewer.getViewer().eventSelectionChanged.addListener(() => {

                    const file = this._filteredViewer.getViewer().getSelectionFirstElement() as io.FilePath;

                    text.value = file === null ? "" : `${file.getFullName()}/`;
                });
            }

            {
                const label = document.createElement("label");
                label.innerText = "Name";
                bottomArea.appendChild(label);

                const text = document.createElement("input");
                text.type = "text";
                bottomArea.appendChild(text);
                setTimeout(() => text.focus(), 10);
                text.addEventListener("keyup", e => this.validate());
                this._fileNameText = text;
            }

            return bottomArea;
        }

        protected normalizedFileName(): string {
            return this._fileNameText.value;
        }

        validate() {

            const folder = this._filteredViewer.getViewer().getSelectionFirstElement() as io.FilePath;

            let valid = folder !== null;

            if (valid) {

                const name = this.normalizedFileName();

                if (name.indexOf("/") >= 0 || name.trim() === "") {

                    valid = false;

                } else {

                    const file = folder.getFile(name);

                    if (file) {
                        valid = false;
                    }
                }
            }

            this._createBtn.disabled = !valid;
        }

        setFileCreatedCallback(callback: (file: io.FilePath) => void) {
            this._fileCreatedCallback = callback;
        }

        getFileCreatedCallback() {
            return this._fileCreatedCallback;
        }

        setInitialFileName(filename: string) {
            this._fileNameText.value = filename;
        }

        setInitialLocation(folder: io.FilePath) {

            this._filteredViewer.getViewer().setSelection([folder]);
            this._filteredViewer.getViewer().reveal(folder);
        }

        create() {

            super.create();

            this._createBtn = this.addButton("Create", () => this.createFile_priv());

            this.connectInputWithButton(this._fileNameText, this._createBtn);

            this.addButton("Cancel", () => this.close());

            this.validate();
        }

        private async createFile_priv() {

            const folder = this._filteredViewer.getViewer().getSelectionFirstElement() as io.FilePath;

            const name = this.normalizedFileName();

            const file = await this.createFile(folder, name);

            this.close();

            if (this._fileCreatedCallback) {
                this._fileCreatedCallback(file);
            }
        }

        protected abstract createFile(container: io.FilePath, name: string): Promise<io.FilePath>;

        private createCenterArea() {

            const centerArea = document.createElement("div");

            this.createFilteredViewer();

            centerArea.appendChild(this._filteredViewer.getElement());

            return centerArea;
        }

        private createFilteredViewer() {

            const viewer = new viewers.TreeViewer("phasereditor2d.files.ui.dialogs.BaseNewFileDialog");

            viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
            viewer.setContentProvider(new files.ui.viewers.FileTreeContentProvider(true));
            viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider());
            viewer.setInput(colibri.Platform.getWorkbench().getProjectRoot());

            viewer.eventSelectionChanged.addListener(() => {

                this.validate();
            });

            this._filteredViewer = new viewers.FilteredViewerInElement(viewer, false);
        }

        layout() {

            super.layout();

            this._filteredViewer.resizeTo();
        }
    }
}