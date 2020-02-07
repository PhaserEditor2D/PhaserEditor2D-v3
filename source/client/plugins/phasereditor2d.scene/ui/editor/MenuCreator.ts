namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class MenuCreator {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;
        }

        fillMenu(menu: controls.Menu) {

            menu.addCommand(commands.CMD_ADD_SCENE_OBJECT);

            menu.addSeparator();

            menu.addMenu(this.createToolsMenu());

            menu.addMenu(this.createTypeMenu());

            menu.addMenu(this.createTextureMenu());

            menu.addMenu(this.createContainerMenu());

            menu.addMenu(this.createSnappingMenu());

            menu.addSeparator();

            menu.addCommand(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR, {
                text: "Refresh Scene"
            });
            menu.addCommand(commands.CMD_COMPILE_SCENE_EDITOR);
            menu.addCommand(commands.CMD_OPEN_COMPILED_FILE);
        }

        private createToolsMenu(): controls.Menu {

            const menu = new controls.Menu("Tools");

            const activeTool = this._editor.getToolsManager().getActiveTool();

            const exts = colibri.Platform.getExtensions<tools.SceneToolExtension>(tools.SceneToolExtension.POINT_ID);

            for (const ext of exts) {

                for (const tool of ext.getTools()) {

                    menu.addCommand(tool.getCommandId(), {
                        selected: activeTool === tool
                    });
                }
            }

            return menu;
        }

        private createTypeMenu(): controls.Menu {

            const menu = new controls.Menu("Type");

            menu.addCommand(commands.CMD_CONVERT_OBJECTS);
            menu.addCommand(commands.CMD_CONVERT_TO_TILE_SPRITE_OBJECTS);

            return menu;
        }

        private createContainerMenu(): controls.Menu {

            const menu = new controls.Menu("Container");

            menu.addCommand(commands.CMD_JOIN_IN_CONTAINER);
            menu.addCommand(commands.CMD_MOVE_TO_PARENT);

            return menu;
        }

        private createSnappingMenu(): controls.Menu {

            const menu = new controls.Menu("Snapping");

            menu.addCommand(commands.CMD_TOGGLE_SNAPPING);
            menu.addCommand(commands.CMD_SET_SNAPPING_TO_OBJECT_SIZE);

            return menu;
        }

        private createTextureMenu() {

            const menu = new controls.Menu("Texture");

            menu.addCommand(commands.CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE);
            menu.addCommand(commands.CMD_REPLACE_TEXTURE);

            return menu;
        }
    }
}