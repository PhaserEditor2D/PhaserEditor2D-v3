namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;
    import commands = colibri.ui.ide.commands;

    export function OpenThemeDialogHandler(args: commands.HandlerArgs) {

        const dlg = new dialogs.ThemesDialog();

        dlg.create();

        dlg.getViewer().setSelection([controls.Controls.getTheme()]);

        dlg.getViewer().eventSelectionChanged.addListener(() => {

            const theme = dlg.getViewer().getSelectionFirstElement() as controls.ITheme;

            if (theme) {
                IDEPlugin.getInstance().setTheme(theme);
            }
        });
    }

    OpenThemeDialogHandler.test = (args: commands.HandlerArgs) => {
        return !(args.activeDialog instanceof dialogs.ThemesDialog);
    };
}