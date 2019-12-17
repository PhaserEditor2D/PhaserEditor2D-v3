namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class ReloadProjectAction extends controls.Action {

        constructor() {
            super({
                text: "Reload Project"
            });
        }

        run() {
            
            IDEPlugin.getInstance().ideOpenProject(
                colibri.Platform.getWorkbench().getProjectRoot().getName()
            );
        }
    }
}