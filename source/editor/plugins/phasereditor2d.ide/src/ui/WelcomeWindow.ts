namespace phasereditor2d.ide.ui {

    import controls = colibri.ui.controls;

    export class WelcomeWindow extends colibri.ui.ide.WorkbenchWindow {

        static ID = "phasereditor2d.welcome.ui.WelcomeWindow";

        constructor() {

            super(WelcomeWindow.ID);
        }

        getEditorArea(): colibri.ui.ide.EditorArea {
            return new colibri.ui.ide.EditorArea();
        }

        protected async createParts() {

            const { projects } = await colibri.ui.ide.FileUtils.getProjects_async();

            if (projects.length === 0) {

                const dlg = new dialogs.NewProjectDialog();

                dlg.setCancellable(false);
                dlg.setCloseWithEscapeKey(false);

                dlg.create();

            } else {

                const dlg = new dialogs.ProjectsDialog();

                dlg.setCloseWithEscapeKey(false);

                dlg.create();
            }
        }
    }
}