namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;

    export class ProjectsDialog extends controls.dialogs.ViewerFormDialog {
        private _wsInputElement: HTMLInputElement;
        private _workspacePath: string;

        constructor() {
            super(new controls.viewers.TreeViewer("phasereditor2d.ide.ui.dialogs.ProjectsDialog"), false);

            this.setSize(undefined, Math.floor(window.innerHeight * 0.45));
        }

        async create() {

            super.create();

            const viewer = this.getViewer();

            viewer.setLabelProvider(new controls.viewers.LabelProvider());
            viewer.setCellRendererProvider(new viewers.ProjectCellRendererProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setInput([]);

            viewer.eventOpenItem.addListener(() => this.openProject());

            this.setTitle("Projects");

            this.addButton("New Project", () => this.openNewProjectDialog());

            const root = colibri.ui.ide.FileUtils.getRoot();

            {
                const btn = this.addButton("Open Project", () => this.openProject());

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    let disabled = false;

                    const sel = viewer.getSelection();

                    try {

                        if (root) {

                            if (sel[0] === root.getName()) {

                                disabled = true;

                                return;
                            }
                        }

                        if (sel.length !== 1) {

                            disabled = true;

                            return;
                        }

                    } finally {

                        btn.disabled = disabled;
                    }
                });
            }

            this.refreshData();
        }

        private async refreshData() {

            const viewer = this.getViewer();

            const root = colibri.ui.ide.FileUtils.getRoot();
            const { projects, workspacePath } = await colibri.ui.ide.FileUtils.getProjects_async(this._workspacePath);

            viewer.setInput(projects);

            if (root) {

                viewer.setSelection([root.getName()]);
            }

            viewer.repaint();

            if (this._wsInputElement) {

                this._wsInputElement.value = workspacePath;
            }
        }

        createFormArea(formArea: HTMLDivElement) {

            const electron = colibri.Platform.getElectron();

            if (!electron) {

                formArea.remove();

                this.layout();

                return;
            }

            formArea.style.gridTemplateColumns = "auto 1fr auto";

            const label = document.createElement("label");
            label.innerHTML = "Workspace";
            formArea.appendChild(label);

            const input = document.createElement("input");
            input.readOnly = true;
            formArea.appendChild(input);

            const btn = document.createElement("button");
            btn.innerText = "Change";
            formArea.appendChild(btn);
            btn.addEventListener("click", async () => {

                const dir = electron.sendMessageSync({
                    method: "open-directory",
                    body: {
                        current: this._wsInputElement.value
                    }
                });

                if (dir) {

                    this._workspacePath = dir;

                    await this.refreshData();
                }
            });

            this._wsInputElement = input;
        }

        private async openProject() {

            this.close();

            const project = this.getViewer().getSelectionFirstElement();

            IDEPlugin.getInstance().ideOpenProject(project, this._workspacePath);
        }

        private openNewProjectDialog() {

            const dlg = new NewProjectDialog(this._workspacePath);

            dlg.create();
        }
    }
}