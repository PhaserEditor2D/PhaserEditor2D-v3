namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;

    export class ProjectsDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new controls.viewers.TreeViewer());
        }

        async create() {

            super.create();

            const viewer = this.getViewer();

            viewer.setLabelProvider(new controls.viewers.LabelProvider());
            viewer.setCellRendererProvider(new viewers.ProjectCellRendererProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setInput([]);

            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => this.openProject());

            const activeWindow = colibri.Platform.getWorkbench().getActiveWindow();

            this.setTitle("Projects");

            this.addButton("New Project", () => this.openNewProjectDialog());

            const root = colibri.ui.ide.FileUtils.getRoot();

            {
                const btn = this.addButton("Open Project", () => this.openProject());

                btn.disabled = true;

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {

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

            let projects = await colibri.ui.ide.FileUtils.getProjects_async();

            // if (root) {

            //     projects = projects.filter(project => root.getName() !== project);
            // }

            viewer.setInput(projects);

            if (root) {
                viewer.setSelection([root.getName()]);
            }

            viewer.repaint();
        }

        private async openProject() {

            this.close();

            const project = this.getViewer().getSelectionFirstElement();

            IDEPlugin.getInstance().ideOpenProject(project);
        }

        private openNewProjectDialog() {

            const dlg = new NewProjectDialog();

            dlg.create();
        }
    }
}