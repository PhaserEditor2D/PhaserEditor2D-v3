namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class OpenMainMenuAction extends controls.Action {

        constructor() {
            super({
                text: "Open Menu",
                tooltip: "Main menu",
                icon: IDEPlugin.getInstance().getIcon(ICON_MENU)
            });
        }

        run(e: MouseEvent) {

            const menu = new controls.Menu();

            menu.add(new controls.Action({
                text: "Help",
                callback: () => controls.Controls.openUrlInNewPage("https://phasereditor2d.com/docs/v3")
            }));

            menu.addSeparator();

            menu.addCommand(actions.CMD_RELOAD_PROJECT);

            menu.addCommand(actions.CMD_CHANGE_THEME);

            menu.addSeparator();

            menu.add(new controls.Action({
                text: "Unlock Phaser Editor 2D"
            }));

            menu.add(new controls.Action({
                text: "About",
                callback: () => {
                    new dialogs.AboutDialog().create();
                }
            }));

            menu.create(e);
        }
    }
}