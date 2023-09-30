namespace phasereditor2d.ide.ui.actions {

    import controls = colibri.ui.controls;

    export class OpenMainMenuAction extends controls.Action {

        constructor() {
            super({
                text: "Open Menu",
                tooltip: "Main menu",
                showText: false,
                icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_MENU)
            });
        }

        run(e: MouseEvent) {

            const menu = new controls.Menu();

            menu.addExtension(DesignWindow.MENU_MAIN_START);

            menu.addCommand(actions.CMD_RELOAD_PROJECT);

            menu.addCommand(actions.CMD_COMPILE_PROJECT);

            if (IDEPlugin.getInstance().isDesktopMode()) {

                menu.addSeparator();

                menu.addCommand(actions.CMD_OPEN_VSCODE);
            }

            menu.addSeparator();

            menu.addCommand(colibri.ui.ide.actions.CMD_CHANGE_THEME);

            menu.addCommand(colibri.ui.ide.actions.CMD_SHOW_COMMAND_PALETTE);

            menu.addExtension(DesignWindow.MENU_MAIN_END);

            menu.addSeparator();

            if (IDEPlugin.getInstance().isDesktopMode()) {

                const activated = IDEPlugin.getInstance().isLicenseActivated();

                menu.add(new controls.Action({
                    text: activated ? "Change License Key" : "Unlock Phaser Editor 2D",
                    callback: () => {
                        new dialogs.UnlockDialog().create();
                    }
                }));

                menu.add(new controls.Action({
                    text: "Check For Updates",
                    callback: async () => {

                        const dlg = new controls.dialogs.AlertDialog();
                        dlg.create();
                        dlg.setTitle("Updates");
                        dlg.setMessage("Checking for updates...");

                        const available = await IDEPlugin.getInstance().isNewUpdateAvailable();

                        dlg.setMessage(available ? "A new version is available!" : "Updates not found.");
                    }
                }));
            }

            menu.add(new controls.Action({
                text: "Unofficial Phaser Help Center",
                callback: () => controls.Controls.openUrlInNewPage("https://helpcenter.phasereditor2d.com")
            }));

            menu.add(new controls.Action({
                text: "Help",
                callback: () => controls.Controls.openUrlInNewPage("https://help.phasereditor2d.com")
            }));

            menu.add(new controls.Action({
                text: "About",
                callback: () => {
                    new dialogs.AboutDialog().create();
                }
            }));

            menu.createWithEvent(e);
        }
    }
}