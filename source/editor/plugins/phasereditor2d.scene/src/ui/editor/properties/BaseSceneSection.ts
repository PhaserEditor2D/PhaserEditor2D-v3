namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export abstract class BaseSceneSection<T> extends controls.properties.PropertySection<T> {

        protected getHelp(key: string) {
            return "";
        }

        protected getSectionHelpPath() {
            return undefined;
        }

        createMenu(menu: controls.Menu) {

            const path = this.getSectionHelpPath();

            if (path) {

                ide.IDEPlugin.getInstance().createHelpMenuItem(menu, path);
            }
        }

        hasMenu() {

            return true;
        }

        createToolMenuItem(menu: controls.Menu, toolId: string) {

            const manager = this.getEditor().getToolsManager();

            const tool = manager.findTool(toolId);

            menu.addCommand(tool.getCommandId(), {
                selected: tool === manager.getActiveTool()
            });
        }

        getEditor(): SceneEditor {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as SceneEditor;
        }

        protected getUndoManager() {

            return this.getEditor().getUndoManager();
        }

    }
}