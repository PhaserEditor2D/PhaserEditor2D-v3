namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export function OpenProjectHandler(args: colibri.ui.ide.commands.CommandArgs) {
        
        const dlg = new dialogs.ProjectsDialog();

        dlg.create();

        dlg.addButton("Cancel", () => dlg.close());
    }
}