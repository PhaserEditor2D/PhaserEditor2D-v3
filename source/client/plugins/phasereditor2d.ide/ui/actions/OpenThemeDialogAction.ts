namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class OpenThemeDialogAction extends controls.Action {

        constructor() {
            super({
                text: "Color Theme"
            });
        }

        run() {

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

        static commandTest(args : colibri.ui.ide.commands.CommandArgs) {
            return !(args.activeDialog instanceof dialogs.ThemesDialog);
        }
    }
}