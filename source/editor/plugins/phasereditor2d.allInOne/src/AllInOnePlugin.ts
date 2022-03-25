namespace phasereditor2d.allInOne {

    export const CMD_CAT_ALL_IN_ONE = "phasereditor2d.allInOne";
    export const CMD_OPEN_PROJECT = "phasereditor2d.allInOne.openProject";
    export const CMD_CLOSE_PROJECT = "phasereditor2d.allInOne.closeProject";
    export const CMD_NEW_WINDOW = "phasereditor2d.allInOne.newWindow";

    export class AllInOnePlugin extends colibri.Plugin {

        private static _instance: AllInOnePlugin;

        static getInstance() {

            return this._instance || (this._instance = new AllInOnePlugin());
        }

        constructor() {
            super("phasereditor2d.allInOne");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => {

                manager.addCategory({
                    id: CMD_CAT_ALL_IN_ONE,
                    name: "All In One"
                });

                manager.add({
                    command: {
                        category: CMD_CAT_ALL_IN_ONE,
                        id: CMD_OPEN_PROJECT,
                        name: "Open Project",
                        tooltip: "Open an existing project.",
                    },
                    handler: {
                        executeFunc: args => {

                            colibri.Platform.getElectron().sendMessage({
                                method: "open-project"
                            });
                        }
                    },
                    keys: {
                        control: true,
                        alt: true,
                        key: "KeyJ"
                    }
                });

                manager.add({
                    command: {
                        category: CMD_CAT_ALL_IN_ONE,
                        id: CMD_CLOSE_PROJECT,
                        name: "Close Project",
                        tooltip: "Close the current project.",
                    },
                    handler: {
                        executeFunc: args => {

                            colibri.Platform.getElectron().sendMessage({
                                method: "close-project"
                            });
                        }
                    },
                    keys: {
                        control: true,
                        alt: true,
                        key: "KeyC"
                    }
                });

                manager.add({
                    command: {
                        category: CMD_CAT_ALL_IN_ONE,
                        id: CMD_NEW_WINDOW,
                        name: "New Window",
                        tooltip: "Open a new window.",
                    },
                    handler: {
                        executeFunc: args => {

                            colibri.Platform.getElectron().sendMessage({
                                method: "new-window"
                            });
                        }
                    }
                });
            }));

            reg.addExtension(new colibri.ui.controls.MenuExtension(
                phasereditor2d.ide.ui.DesignWindow.MENU_MAIN_START,
                {
                    command: CMD_OPEN_PROJECT,
                },
                {
                    command: CMD_CLOSE_PROJECT,
                },
                {
                    separator: true
                },
                {
                    command: CMD_NEW_WINDOW
                },
                {
                    separator: true
                }));

        }
    }

    colibri.Platform.addPlugin(AllInOnePlugin.getInstance());
}