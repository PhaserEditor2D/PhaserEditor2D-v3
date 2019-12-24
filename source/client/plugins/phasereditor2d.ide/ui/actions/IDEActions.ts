namespace phasereditor2d.ide.ui.actions {

    export const CMD_OPEN_PROJECTS_DIALOG = "phasereditor2d.ide.ui.actions.OpenProjectsDialog";
    export const CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
    export const CMD_CHANGE_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
    export const CMD_EDITOR_TABS_SIZE_UP = "phasereditor2d.ide.ui.actions.EditorTabsSizeUp";
    export const CMD_EDITOR_TABS_SIZE_DOWN = "phasereditor2d.ide.ui.actions.EditorTabsSizeDown";
    export const CMD_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.PlayProject";

    import controls = colibri.ui.controls;
    import commands = colibri.ui.ide.commands;


    function isNotWelcomeWindowScope(args: commands.CommandArgs): boolean {
        return !(args.activeWindow instanceof ui.WelcomeWindow);
    }

    export class IDEActions {

        static registerCommands(manager: commands.CommandManager): void {

            // open project

            manager.addCommandHelper({
                id: CMD_OPEN_PROJECTS_DIALOG,
                name: "Open Project",
                tooltip: "Open other project or create a new one."
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

            manager.addCommandHelper({
                id: CMD_PLAY_PROJECT,
                name: "Play Project",
                tooltip: "Run this project in other tab",
                icon: IDEPlugin.getInstance().getIcon(ICON_PLAY)
            });

            manager.addHandlerHelper(CMD_PLAY_PROJECT,
                isNotWelcomeWindowScope,

                args => {

                    const url = colibri.ui.ide.FileUtils.getRoot().getUrl();

                    controls.Controls.openUrlInNewPage(url);
                });

            manager.addKeyBinding(CMD_PLAY_PROJECT, new commands.KeyMatcher({
                control: true,
                alt: true,
                key: "G"
            }));

            // reload project

            manager.addCommandHelper({
                id: CMD_RELOAD_PROJECT,
                name: "Reload Project",
                tooltip: "Reload the project files."
            });

            manager.addHandlerHelper(CMD_RELOAD_PROJECT,
                isNotWelcomeWindowScope,
                args => IDEPlugin.getInstance().ideOpenProject(
                    colibri.Platform.getWorkbench().getProjectRoot().getName()
                )
            );

            manager.addKeyBinding(CMD_RELOAD_PROJECT, new commands.KeyMatcher({
                control: true,
                alt: true,
                key: "R"
            }));

            // theme dialog

            manager.addCommandHelper({
                id: CMD_CHANGE_THEME,
                name: "Select Color Theme",
                tooltip: "Select the color theme of the IDE."
            });

            manager.addHandlerHelper(CMD_CHANGE_THEME,
                actions.OpenThemeDialogHandler.test,
                actions.OpenThemeDialogHandler
            );

            manager.addKeyBinding(CMD_CHANGE_THEME, new commands.KeyMatcher({
                control: true,
                key: "2",
                filterInputElements: false
            }));

            // editor tabs size

            manager.addCommandHelper({
                id: CMD_EDITOR_TABS_SIZE_DOWN,
                name: "Increment Tab Size",
                tooltip: "Make bigger the editor tabs."
            });

            manager.addCommandHelper({
                id: CMD_EDITOR_TABS_SIZE_UP,
                name: "Decrement Tab Size",
                tooltip: "Make smaller the editor tabs."
            });

            manager.addHandlerHelper(CMD_EDITOR_TABS_SIZE_DOWN,
                isNotWelcomeWindowScope,
                args =>
                    colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(-5)
            );

            manager.addHandlerHelper(CMD_EDITOR_TABS_SIZE_UP,
                isNotWelcomeWindowScope,
                args =>
                    colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(5)
            );

            manager.addKeyBinding(CMD_EDITOR_TABS_SIZE_DOWN, new commands.KeyMatcher({
                control: true,
                key: "3"
            }));

            manager.addKeyBinding(CMD_EDITOR_TABS_SIZE_UP, new commands.KeyMatcher({
                control: true,
                key: "4"
            }));
        }
    }
}