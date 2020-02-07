namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class OpenMainMenuAction extends controls.Action {

        constructor() {
            super({
                text: "Open Menu",
                tooltip: "Main menu",
                showText: false,
                icon: IDEPlugin.getInstance().getIcon(ICON_MENU)
            });
        }

        run(e: MouseEvent) {

            const menu = new controls.Menu();

            menu.addCommand(actions.CMD_OPEN_PROJECTS_DIALOG);

            menu.addCommand(actions.CMD_RELOAD_PROJECT);

            menu.addSeparator();

            menu.addCommand(actions.CMD_CHANGE_THEME);

            menu.addExtension(DesignWindow.MENU_MAIN);

            menu.addSeparator();

            menu.addCommand(colibri.ui.ide.actions.CMD_SHOW_COMMAND_PALETTE);

            menu.add(new controls.Action({
                text: "Help",
                callback: () => controls.Controls.openUrlInNewPage("https://phasereditor2d.com/docs/v3")
            }));

            menu.add(new controls.Action({
                text: "About",
                callback: () => {
                    new dialogs.AboutDialog().create();
                }
            }));

            menu.add(new controls.Action({
                text: "Unlock Phaser Editor 2D"
            }));

            menu.createWithEvent(e);
        }
    }
}