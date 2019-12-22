namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;
    import commands = colibri.ui.ide.commands;

    export function OpenThemeDialogHandler(args: commands.CommandArgs) {

        const dlg = new dialogs.ThemesDialog();

        dlg.create();

        dlg.getViewer().setSelection([controls.Controls.getTheme()]);

        dlg.getViewer().addEventListener(controls.EVENT_SELECTION_CHANGED, e => {

            const theme = dlg.getViewer().getSelectionFirstElement() as controls.Theme;

            if (theme) {
                IDEPlugin.getInstance().setTheme(theme);
            }
        });
    }

    OpenThemeDialogHandler.test = function (args: commands.CommandArgs) {
        return !(args.activeDialog instanceof dialogs.ThemesDialog)
    }
}