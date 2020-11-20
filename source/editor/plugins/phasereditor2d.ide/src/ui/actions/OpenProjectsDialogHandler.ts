namespace phasereditor2d.ide.ui.actions {

    export function OpenProjectHandler(args: colibri.ui.ide.commands.HandlerArgs) {

        const dlg = new dialogs.ProjectsDialog();

        dlg.create();

        dlg.addCancelButton();
    }
}