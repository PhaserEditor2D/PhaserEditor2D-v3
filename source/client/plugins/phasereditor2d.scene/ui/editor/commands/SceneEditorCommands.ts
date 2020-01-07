namespace phasereditor2d.scene.ui.editor.commands {

    export const CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
    export const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";

    function isSceneScope(args: colibri.ui.ide.commands.CommandArgs) {
        return args.activePart instanceof SceneEditor ||
            args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
            && args.activeEditor instanceof SceneEditor;
    }

    export class SceneEditorCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // select all

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL,

                args => args.activePart instanceof SceneEditor,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().selectAll();
                });

            // clear selection

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,

                isSceneScope,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().clearSelection();
                });

            // delete

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                isSceneScope,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getActionManager().deleteObjects();
                });

            // join in container

            manager.addCommandHelper({
                id: CMD_JOIN_IN_CONTAINER,
                name: "Join Objects",
                tooltip: "Create a container with the selected objects"
            });

            manager.addHandlerHelper(CMD_JOIN_IN_CONTAINER,

                args => isSceneScope(args),

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getActionManager().joinObjectsInContainer();
                });

            manager.addKeyBinding(CMD_JOIN_IN_CONTAINER, new colibri.ui.ide.commands.KeyMatcher({
                key: "j"
            }));

            // open compiled file

            manager.addCommandHelper({
                id: CMD_OPEN_COMPILED_FILE,
                icon: webContentTypes.WebContentTypesPlugin.getInstance().getIcon(webContentTypes.ICON_FILE_SCRIPT),
                name: "Open Scene Output File",
                tooltip: "Open the output source file of the scene."
            });

            manager.addHandlerHelper(
                CMD_OPEN_COMPILED_FILE,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).openSourceFileInEditor());
        }

    }

}