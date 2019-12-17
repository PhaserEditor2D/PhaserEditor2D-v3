namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class OpenProjectsDialogAction extends controls.Action {


        constructor() {
            super({
                // text: "Open Project",
                icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER)
            });
        }

        run() {

            const dlg = new dialogs.ProjectsDialog();

            dlg.create();

            dlg.addButton("Cancel", () => dlg.close());
        }
    }
}