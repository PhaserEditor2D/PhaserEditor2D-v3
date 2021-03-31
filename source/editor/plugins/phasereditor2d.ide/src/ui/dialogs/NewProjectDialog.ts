namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;
    import viewers = colibri.ui.controls.viewers;

    interface ITemplateInfo {
        name: string;
        path: string;
        info: {
            openFiles: string[];
        };
    }

    export class NewProjectDialog extends controls.dialogs.Dialog {

        protected _filteredViewer: controls.viewers.FilteredViewerInElement<controls.viewers.TreeViewer>;
        protected _projectNameText: HTMLInputElement;
        private _createBtn: HTMLButtonElement;
        private _projectNames: Set<string>;
        private _cancellable: boolean;
        private _workspacePath: string;

        constructor(workspacePath?: string) {
            super("NewProjectDialog");

            this._workspacePath = workspacePath;
            this._projectNames = new Set();
            this._cancellable = true;

            this.setSize(window.innerWidth / 4, window.innerHeight / 2);
        }

        setCancellable(cancellable: boolean) {
            this._cancellable = cancellable;
        }

        protected createDialogArea() {

            const clientArea = document.createElement("div");
            clientArea.classList.add("DialogClientArea");

            clientArea.style.display = "grid";
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
                label.innerText = "Project Name";
                bottomArea.appendChild(label);

                const text = document.createElement("input");
                text.type = "text";
                text.addEventListener("keyup", e => this.validate());

                setTimeout(() => text.focus(), 10);

                bottomArea.appendChild(text);
                this._projectNameText = text;

                this.setInitialProjectName();
            }

            return bottomArea;
        }

        private setInitialProjectName() {

            let name = "Game";

            let i = 1;

            while (this._projectNames.has(name.toLowerCase())) {
                name = "Game" + i;
                i += 1;
            }

            this._projectNameText.value = name;
        }

        private validate() {

            let disabled = false;

            const viewer = this._filteredViewer.getViewer();

            if (viewer.getSelection().length !== 1) {
                disabled = true;
            }

            if (!disabled) {

                const obj = viewer.getSelectionFirstElement();

                if (obj.path === undefined) {
                    disabled = true;
                }
            }

            if (!disabled) {

                const name = this._projectNameText.value;

                if (name.trim() === ""
                    || name.startsWith(".")
                    || name.indexOf("/") >= 0
                    || name.indexOf("\\") >= 0) {

                    disabled = true;
                }
            }

            if (!disabled) {

                if (this._projectNames.has(this._projectNameText.value.toLowerCase())) {

                    disabled = true;
                }
            }

            this._createBtn.disabled = disabled;
        }

        private async requestProjectsData() {

            const list = ((await colibri.ui.ide.FileUtils.getProjects_async(this._workspacePath)).projects).map(s => s.toLowerCase());

            this._projectNames = new Set(list);
        }

        create() {

            super.create();

            this.setTitle("New Project");

            this._createBtn = this.addButton("Create Project", () => {

                const templateInfo = this._filteredViewer.getViewer().getSelectionFirstElement() as ITemplateInfo;

                this.closeAll();

                this.createProject(templateInfo);
            });

            this.connectInputWithButton(this._projectNameText, this._createBtn);

            if (this._cancellable) {

                this.addButton("Cancel", () => this.close());
            }

            this.requestProjectsData();

            const projectDlg = this;

            colibri.Platform.getWorkbench().getFileStorage().isValidAccount().then(msg => {

                if (msg) {

                    projectDlg.close();

                    alert(msg);
                }
            });
        }

        private async createProject(templateInfo: ITemplateInfo) {

            const projectName = this._projectNameText.value;

            if (this._workspacePath) {

                await colibri.Platform.getWorkbench().getFileStorage().changeWorkspace(this._workspacePath);
            }

            const ok = await colibri.ui.ide.FileUtils.createProject_async(templateInfo.path, projectName);

            if (ok) {

                this.closeAll();

                await IDEPlugin.getInstance().ideOpenProject(projectName);

                const wb = colibri.Platform.getWorkbench();

                for (const openFile of templateInfo.info.openFiles) {

                    const file = colibri.ui.ide.FileUtils.getFileFromPath(projectName + "/" + openFile);

                    wb.openEditor(file);
                }
            }
        }

        private createCenterArea() {

            const centerArea = document.createElement("div");

            this.createFilteredViewer();

            centerArea.appendChild(this._filteredViewer.getElement());

            return centerArea;
        }

        private createFilteredViewer() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.ide.ui.dialogs.NewProjectDialog");

            viewer.setLabelProvider(new TemplatesLabelProvider());
            viewer.setCellRendererProvider(new TemplatesCellRendererProvider());
            viewer.setContentProvider(new TemplatesContentProvider());

            viewer.setInput({
                providers: []
            });

            colibri.ui.ide.FileUtils.getProjectTemplates_async().then(data => {

                viewer.setInput(data);

                for (const provider of data.providers) {
                    viewer.setExpanded(provider, true);
                }

                viewer.setSelection([data.providers[0].templates[0]]);

                viewer.repaint();
            });

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

    class TemplatesContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const data = input as colibri.core.io.ProjectTemplatesData;

            return data.providers;
        }

        getChildren(parent: any): any[] {

            if (parent.templates) {

                return parent.templates;
            }

            return [];
        }
    }

    class TemplatesLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {
            return obj.name;
        }
    }

    class TemplatesCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(
                colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER)
            );
        }

        preload(element: any): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}