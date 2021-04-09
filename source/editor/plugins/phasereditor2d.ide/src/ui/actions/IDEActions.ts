namespace phasereditor2d.ide.ui.actions {

    export const CAT_PROJECT = "phasereditor2d.ide.ui.actions.ProjectCategory";
    export const CMD_LOCATE_FILE = "phasereditor2d.ide.ui.actions.LocateFile";
    export const CMD_OPEN_PROJECTS_DIALOG = "phasereditor2d.ide.ui.actions.OpenProjectsDialog";
    export const CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
    export const CMD_COMPILE_PROJECT = "phasereditor2d.ide.ui.actions.CompileProject";
    export const CMD_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.PlayProject";
    export const CMD_QUICK_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.QuickPlayProject";
    export const CMD_OPEN_VSCODE = "phasereditor2d.ide.ui.actions.OpenVSCode";

    import controls = colibri.ui.controls;
    import commands = colibri.ui.ide.commands;
    import io = colibri.core.io;

    export function isNotWelcomeWindowScope(args: commands.HandlerArgs): boolean {
        return !(args.activeWindow instanceof ui.WelcomeWindow);
    }

    export class IDEActions {

        static registerCommands(manager: commands.CommandManager): void {

            manager.addCategory({
                id: CAT_PROJECT,
                name: "Project"
            });

            // open project

            manager.addCommandHelper({
                id: CMD_OPEN_PROJECTS_DIALOG,
                name: "Open Project",
                tooltip: "Open other project or create a new one.",
                category: CAT_PROJECT
            });

            manager.addHandlerHelper(CMD_OPEN_PROJECTS_DIALOG,
                args => isNotWelcomeWindowScope(args) && !args.activeDialog,
                OpenProjectHandler);

            manager.addKeyBinding(CMD_OPEN_PROJECTS_DIALOG, new commands.KeyMatcher({
                control: true,
                alt: true,
                key: "P",
                filterInputElements: false
            }));

            // play game

            manager.add({

                command: {
                    id: CMD_PLAY_PROJECT,
                    name: "Play Project",
                    tooltip: "Run this project in other tab",
                    icon: IDEPlugin.getInstance().getIcon(ICON_PLAY),
                    category: CAT_PROJECT
                },

                handler: {

                    testFunc: isNotWelcomeWindowScope,

                    executeFunc: args => {

                        const url = colibri.ui.ide.FileUtils.getRoot().getExternalUrl();

                        controls.Controls.openUrlInNewPage(url);
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
                    icon: IDEPlugin.getInstance().getIcon(ICON_PLAY),
                    category: CAT_PROJECT
                },

                handler: {

                    testFunc: isNotWelcomeWindowScope,

                    executeFunc: args => {

                        const url = colibri.ui.ide.FileUtils.getRoot().getExternalUrl();
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
                        args => IDEPlugin.getInstance().ideOpenProject(
                            colibri.Platform.getWorkbench().getProjectRoot().getName()
                        )
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "R"
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
                    key: "B"
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
                        key: "L",
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
                        key: "U"
                    },
                    handler: {
                        executeFunc: args => IDEPlugin.getInstance().openProjectInVSCode()
                    }
                });
            }
        }
    }
}