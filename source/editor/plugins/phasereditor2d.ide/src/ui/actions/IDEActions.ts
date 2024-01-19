namespace phasereditor2d.ide.ui.actions {

    export const CAT_PROJECT = "phasereditor2d.ide.ui.actions.ProjectCategory";
    export const CMD_LOCATE_FILE = "phasereditor2d.ide.ui.actions.LocateFile";
    export const CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
    export const CMD_COMPILE_PROJECT = "phasereditor2d.ide.ui.actions.CompileProject";
    export const CMD_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.PlayProject";
    export const CMD_QUICK_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.QuickPlayProject";
    export const CMD_OPEN_VSCODE = "phasereditor2d.ide.ui.actions.OpenVSCode";
    export const CMD_ENABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR = "phasereditor2d.ide.ui.actions.EnableOpenCodeFileInExternalEditor";
    export const CMD_DISABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR = "phasereditor2d.ide.ui.actions.EnableOpenCodeFileInExternalEditor";

    import commands = colibri.ui.ide.commands;
    import io = colibri.core.io;

    // TODO: Remove
    export function isNotWelcomeWindowScope(args: commands.HandlerArgs): boolean {

        return true;
    }

    export class IDEActions {

        static registerCommands(manager: commands.CommandManager): void {

            manager.addCategory({
                id: CAT_PROJECT,
                name: "Project"
            });

            manager.add({
                command: {
                    id: CMD_ENABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR,
                    category: CAT_PROJECT,
                    name: "Enable Open Code File In External Editor",
                    tooltip: "If enable, clicking on a coding file in the Files view opens the external editor"
                },
                handler: {
                    testFunc: isNotWelcomeWindowScope,
                    executeFunc: () => {

                        IDEPlugin.getInstance().setEnableOpenCodeFileInExternalEditor(true);
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_DISABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR,
                    category: CAT_PROJECT,
                    name: "Disable Open Code File In External Editor",
                    tooltip: "If disabled, clicking on a coding file open the built-in editor."
                },
                handler: {
                    testFunc: isNotWelcomeWindowScope,
                    executeFunc: () => {

                        IDEPlugin.getInstance().setEnableOpenCodeFileInExternalEditor(false);
                    }
                }
            });

            // play game

            manager.add({

                command: {
                    id: CMD_PLAY_PROJECT,
                    name: "Play Project",
                    tooltip: "Run this project in the browser.",
                    icon: resources.getIcon(resources.ICON_PLAY),
                    category: CAT_PROJECT
                },

                handler: {

                    testFunc: isNotWelcomeWindowScope,

                    executeFunc: async (args) => {

                        await colibri.Platform.getWorkbench().saveAllEditors();

                        IDEPlugin.getInstance().playProject();
                    }
                },
                keys: {
                    key: "F12"
                }
            });

            manager.add({

                command: {
                    id: CMD_QUICK_PLAY_PROJECT,
                    name: "Quick Play Project",
                    tooltip: "Run this project in a dialog.",
                    icon: resources.getIcon(resources.ICON_PLAY),
                    category: CAT_PROJECT
                },

                handler: {

                    testFunc: isNotWelcomeWindowScope,

                    executeFunc: async (args) => {

                        await colibri.Platform.getWorkbench().saveAllEditors();

                        const config = await IDEPlugin.getInstance().requestProjectConfig();
                        let url: string;

                        if (colibri.Platform.isOnElectron()) {

                            url = config.playUrl || colibri.ui.ide.FileUtils.getRoot().getExternalUrl();

                        } else {

                            url = config.playUrl || "./external/";
                        }

                        const dlg = new dialogs.PlayDialog(url);
                        
                        dlg.create();
                    }
                },
                keys: {
                    key: "F10"
                }
            });

            // reload project

            manager.add({
                command: {
                    id: CMD_RELOAD_PROJECT,
                    name: "Reload Project",
                    tooltip: "Reload the project files.",
                    category: CAT_PROJECT
                },
                handler: {
                    testFunc: isNotWelcomeWindowScope,
                    executeFunc:
                        args => IDEPlugin.getInstance().ideOpenProject()
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "KeyR"
                }
            });

            // compile project

            manager.add({
                command: {
                    id: CMD_COMPILE_PROJECT,
                    name: "Compile Project",
                    tooltip: "Compile all files.",
                    category: CAT_PROJECT
                },
                handler: {
                    testFunc: isNotWelcomeWindowScope,
                    executeFunc:
                        args => IDEPlugin.getInstance().compileProject()
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "KeyB"
                }
            });

            if (IDEPlugin.getInstance().isDesktopMode()) {

                // locate file

                manager.add({
                    command: {
                        id: CMD_LOCATE_FILE,
                        category: CAT_PROJECT,
                        name: "Locate File",
                        tooltip: "Open the selected file (or project root) in the OS file manager."
                    },
                    keys: {
                        key: "KeyL",
                        control: true,
                        alt: true
                    },
                    handler: {

                        executeFunc: async (args) => {

                            let file = colibri.ui.ide.FileUtils.getRoot();

                            const view = args.activePart;

                            if (view instanceof files.ui.views.FilesView) {

                                const sel = view.getSelection()[0] as io.FilePath;

                                if (sel) {

                                    file = sel;
                                }
                            }

                            if (!file) {

                                return;
                            }

                            if (file.isFile()) {

                                file = file.getParent();
                            }

                            const resp = await colibri.core.io.apiRequest("OpenFileManager", { file: file.getFullName() });

                            if (resp.error) {

                                alert(resp.error);
                            }
                        }
                    }
                });

                // open vscode

                manager.add({
                    command: {
                        id: CMD_OPEN_VSCODE,
                        category: CAT_PROJECT,
                        name: "Open " + IDEPlugin.getInstance().getExternalEditorName(),
                        tooltip: "Open the project in the configured external editor (" + IDEPlugin.getInstance().getExternalEditorName() + ")."
                    },
                    keys: {
                        control: true,
                        alt: true,
                        key: "KeyU"
                    },
                    handler: {
                        executeFunc: args => IDEPlugin.getInstance().openProjectInVSCode()
                    }
                });
            }
        }
    }
}