var phasereditor2d;
(function (phasereditor2d) {
    var allInOne;
    (function (allInOne) {
        allInOne.CMD_CAT_ALL_IN_ONE = "phasereditor2d.allInOne";
        allInOne.CMD_OPEN_PROJECT = "phasereditor2d.allInOne.openProject";
        allInOne.CMD_CLOSE_PROJECT = "phasereditor2d.allInOne.closeProject";
        allInOne.CMD_NEW_WINDOW = "phasereditor2d.allInOne.newWindow";
        class AllInOnePlugin extends colibri.Plugin {
            static _instance;
            static getInstance() {
                return this._instance || (this._instance = new AllInOnePlugin());
            }
            constructor() {
                super("phasereditor2d.allInOne");
            }
            registerExtensions(reg) {
                reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => {
                    manager.addCategory({
                        id: allInOne.CMD_CAT_ALL_IN_ONE,
                        name: "All In One"
                    });
                    manager.add({
                        command: {
                            category: allInOne.CMD_CAT_ALL_IN_ONE,
                            id: allInOne.CMD_OPEN_PROJECT,
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
                            category: allInOne.CMD_CAT_ALL_IN_ONE,
                            id: allInOne.CMD_CLOSE_PROJECT,
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
                            category: allInOne.CMD_CAT_ALL_IN_ONE,
                            id: allInOne.CMD_NEW_WINDOW,
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
                reg.addExtension(new colibri.ui.controls.MenuExtension(phasereditor2d.ide.ui.DesignWindow.MENU_MAIN_START, {
                    command: allInOne.CMD_OPEN_PROJECT,
                }, {
                    command: allInOne.CMD_CLOSE_PROJECT,
                }, {
                    separator: true
                }, {
                    command: allInOne.CMD_NEW_WINDOW
                }, {
                    separator: true
                }));
            }
        }
        allInOne.AllInOnePlugin = AllInOnePlugin;
        colibri.Platform.addPlugin(AllInOnePlugin.getInstance());
    })(allInOne = phasereditor2d.allInOne || (phasereditor2d.allInOne = {}));
})(phasereditor2d || (phasereditor2d = {}));
