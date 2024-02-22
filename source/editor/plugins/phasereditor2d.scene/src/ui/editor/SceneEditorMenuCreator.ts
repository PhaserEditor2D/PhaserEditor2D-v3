namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class SceneEditorMenuCreator {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;
        }

        fillMenu(menu: controls.Menu) {

            menu.addMenu(this.createToolsMenu());

            menu.addMenu(this.createCoordsMenu());

            menu.addMenu(this.createLayoutMenu());

            menu.addSeparator();

            menu.addMenu(this.createAddObjectMenu())

            menu.addMenu(this.createAddCodeSnippetMenu())

            menu.addSeparator();

            menu.addMenu(this.createPrefabMenu());

            menu.addMenu(this.createScriptingMenu());

            menu.addMenu(this.createTypeMenu());

            menu.addMenu(this.createOriginMenu());

            menu.addMenu(this.createTextureMenu());

            menu.addMenu(this.createArcadePhysicsMenu());

            menu.addMenu(this.createFXMenu());

            menu.addMenu(this.createParentMenu());

            menu.addSeparator();

            menu.addMenu(this.createSnappingMenu());

            menu.addMenu(this.createEditMenu());

            menu.addSeparator();

            menu.addMenu(this.createSceneMenu());

            menu.addMenu(this.createCompilerMenu());
        }

        private createFXMenu(): controls.Menu {

            const menu = new controls.Menu("FX");

            const exts = ScenePlugin.getInstance().getFXExtensions();

            const selection = this._editor.getSelectedGameObjects();

            const parents = selection.map(obj => {

                if (obj.getEditorSupport().isDisplayObject()) {

                    return obj;
                }

                if (obj instanceof sceneobjects.FXObject) {

                    return obj.getParent();
                }

                return undefined;

            }).filter(obj => obj && sceneobjects.FXObjectExtension.allowGameObject(obj));

            const enabled = parents.length > 0;

            for (const ext of exts) {

                const factories = ext.getFXObjectFactories();

                if (factories.length > 0) {

                    const menu2 = new controls.Menu(ext.getTypeName(), ext.getIcon());

                    menu.addMenu(menu2);

                    for (const factory of factories) {

                        menu2.addAction({
                            text: "Add " + factory.factoryName,
                            icon: ext.getIcon(),
                            enabled,
                            callback: () => {

                                this._editor.getDropManager().addFXObjects(factory);
                            }
                        });
                    }

                } else {

                    menu.addAction({
                        text: "Add " + ext.getTypeName(),
                        icon: ext.getIcon(),
                        enabled,
                        callback: () => {

                            this._editor.getDropManager().addFXObjects(ext);
                        }
                    });
                }
            }

            return menu;
        }

        private createAddCodeSnippetMenu(): controls.Menu {

            const menu = new controls.Menu("Code Snippets");

            for (const ext of ScenePlugin.getInstance().getCodeSnippetExtensions()) {

                menu.addAction({
                    text: "Add " + ext.getName(),
                    icon: resources.getIcon(resources.ICON_BUILD),
                    enabled: ext.isEnabledFor(this._editor),
                    callback: async () => {

                        const snippets = await ext.createAndConfigureCodeSnippets();

                        if (snippets) {

                            this._editor.getUndoManager().add(new codesnippets.CodeSnippetsSnapshotOperation(this._editor, async () => {

                                for (const snippet of snippets) {

                                    this._editor.getScene().addCodeSnippet(snippet);
                                }

                                this._editor.setSelection(snippets);
                            }));
                        }
                    }
                });
            }

            return menu;
        }

        private createScriptingMenu(): controls.Menu {

            const menu = new controls.Menu("Scripting");

            menu.addCommand(commands.CMD_OPEN_ADD_SCRIPT_DIALOG);
            menu.addCommand(commands.CMD_OPEN_SCRIPT_DIALOG);

            menu.addSeparator();

            menu.addCommand(commands.CMD_ADD_USER_COMPONENT);
            menu.addCommand(commands.CMD_BROWSE_USER_COMPONENTS);

            return menu;
        }

        createArcadePhysicsMenu(): controls.Menu {

            const menu = new controls.Menu("Arcade Physics");

            menu.addCommand(editor.commands.CMD_ARCADE_ENABLE_BODY, {
                text: "Add Body"
            });

            menu.addCommand(editor.commands.CMD_ARCADE_DISABLE_BODY, {
                text: "Remove Body"
            });

            menu.addSeparator();

            menu.addCommand(editor.commands.CMD_ARCADE_CENTER_BODY, {
                text: "Center Body"
            });
            menu.addCommand(editor.commands.CMD_ARCADE_RESIZE_TO_OBJECT_BODY, {
                text: "Resize Body To Object Size"
            });

            return menu;
        }

        private createAddObjectMenu() {

            const blocksProvider = this._editor.getEditorViewerProvider(phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY);
            const contentProvider = blocksProvider.getContentProvider();
            const labelProvider = blocksProvider.getLabelProvider();
            const cellRendererProvider = blocksProvider.getCellRendererProvider();

            const menu = new controls.Menu("Add Object");

            menu.addCommand(commands.CMD_ADD_OBJECT, {
                text: "Add..."
            });

            for (const cat of SCENE_OBJECT_CATEGORIES) {

                const menu2 = new controls.Menu(cat);

                const list = contentProvider.getChildren(cat);

                for (const obj of list) {

                    menu2.addAction({
                        text: labelProvider.getLabel(obj),
                        icon: new controls.viewers.ImageFromCellRenderer(
                            obj, cellRendererProvider.getCellRenderer(obj), controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE),
                        callback: () => {

                            this._editor.getDropManager().dropDataAtCenter([obj]);
                        }
                    });
                }

                menu.addMenu(menu2);
            }

            return menu;
        }

        private createSceneMenu() {

            const menu = new controls.Menu("Scene");

            menu.addCommand(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR, {
                text: "Refresh Scene"
            });

            menu.addCommand(commands.CMD_DUPLICATE_SCENE_FILE, {
                text: "Duplicate Scene"
            });

            menu.addAction({
                text: "Settings",
                callback: () => this._editor.setSelection([])
            });

            menu.addCommand(commands.CMD_PREVIEW_SCENE, {
                text: "Preview"
            });

            return menu;
        }

        createCompilerMenu(menu: controls.Menu = new controls.Menu("Compiler")) {

            menu.addCommand(commands.CMD_COMPILE_SCENE_EDITOR);

            menu.addSeparator();

            menu.addCommand(commands.CMD_OPEN_COMPILED_FILE);

            if (ide.IDEPlugin.getInstance().isDesktopMode()) {

                menu.addCommand(commands.CMD_OPEN_OUTPUT_FILE_IN_VSCODE);
            }

            menu.addCommand(commands.CMD_QUICK_EDIT_OUTPUT_FILE);

            return menu;
        }

        private createEditMenu() {

            const menu = new controls.Menu("Edit");

            menu.addCommand(colibri.ui.ide.actions.CMD_UNDO);
            menu.addCommand(colibri.ui.ide.actions.CMD_REDO);

            menu.addSeparator();

            menu.addCommand(colibri.ui.ide.actions.CMD_CUT);
            menu.addCommand(colibri.ui.ide.actions.CMD_COPY);
            menu.addCommand(colibri.ui.ide.actions.CMD_PASTE);
            menu.addCommand(commands.CMD_PASTE_IN_PLACE);
            menu.addCommand(colibri.ui.ide.actions.CMD_DELETE);

            menu.addSeparator();

            menu.addCommand(commands.CMD_SORT_OBJ_UP);
            menu.addCommand(commands.CMD_SORT_OBJ_DOWN);
            menu.addCommand(commands.CMD_SORT_OBJ_TOP);
            menu.addCommand(commands.CMD_SORT_OBJ_BOTTOM);

            return menu;
        }

        private createOriginMenu(): controls.Menu {

            const menu = new controls.Menu("Origin");

            this.createOriginMenuItems(menu);

            return menu;
        }

        createOriginMenuItems(menu: controls.Menu) {

            for (const data of commands.SceneEditorCommands.computeOriginCommandData()) {

                menu.addCommand(data.command);
            }
        }

        createCoordsMenuItems(menu: controls.Menu) {

            menu.add(new controls.Action({
                callback: () => this._editor.setLocalCoords(true),
                text: "Local",
                selected: this._editor.isLocalCoords()
            }));

            menu.add(new controls.Action({
                callback: () => this._editor.setLocalCoords(false),
                text: "Global",
                selected: !this._editor.isLocalCoords()
            }));
        }

        private createCoordsMenu() {

            const menu = new controls.Menu("Coords");

            this.createCoordsMenuItems(menu);

            return menu;
        }

        private createLayoutMenu() {

            const menu = new controls.Menu("Layout");

            menu.addAction({
                text: "Show Layout Bar",
                callback: () => this._editor.getLayoutToolsManager().togglePaneVisible(),
                selected: this._editor.getLayoutToolsManager().isPaneVisible()
            });

            const extsByGroup = ScenePlugin.getInstance().getLayoutExtensionsByGroup();

            for (const groupSet of extsByGroup) {

                const groupMenu = new controls.Menu(groupSet.group);

                menu.addMenu(groupMenu);

                for (const ext of groupSet.extensions) {

                    const config = ext.getConfig();

                    groupMenu.addAction({
                        text: config.name,
                        icon: config.icon,
                        callback: () => ext.performLayout(this._editor)
                    });
                }
            }

            return menu;
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

        private createPrefabMenu() {

            const menu = new controls.Menu("Prefab");

            menu.addCommand(commands.CMD_OPEN_PREFAB);
            menu.addCommand(commands.CMD_CREATE_PREFAB_WITH_OBJECT);
            menu.addSeparator();
            menu.addCommand(commands.CMD_ADD_PREFAB_PROPERTY);

            return menu;
        }

        createTypeMenuItems(menu: controls.Menu) {

            menu.addCommand(commands.CMD_CONVERT_OBJECTS);
            menu.addCommand(commands.CMD_CONVERT_TO_TILE_SPRITE_OBJECTS);
        }

        private createTypeMenu(): controls.Menu {

            const menu = new controls.Menu("Type");

            this.createTypeMenuItems(menu);

            return menu;
        }

        private createParentMenu(): controls.Menu {

            const menu = new controls.Menu("Parent");

            menu.addCommand(commands.CMD_JOIN_IN_LAYER);
            menu.addSeparator();
            menu.addCommand(commands.CMD_JOIN_IN_CONTAINER);
            menu.addCommand(commands.CMD_TRIM_CONTAINER);
            menu.addSeparator();
            menu.addCommand(commands.CMD_BREAK_PARENT);
            menu.addCommand(commands.CMD_MOVE_TO_PARENT);
            menu.addCommand(commands.CMD_SELECT_PARENT);
            menu.addCommand(commands.CMD_SELECT_CHILDREN);

            return menu;
        }

        private createSnappingMenu(): controls.Menu {

            const menu = new controls.Menu("Snapping");

            menu.addCommand(commands.CMD_TOGGLE_SNAPPING);
            menu.addCommand(commands.CMD_SET_SNAPPING_TO_OBJECT_SIZE);
            menu.addSeparator();
            menu.addCommand(commands.CMD_MOVE_OBJECT_LEFT);
            menu.addCommand(commands.CMD_MOVE_OBJECT_RIGHT);
            menu.addCommand(commands.CMD_MOVE_OBJECT_UP);
            menu.addCommand(commands.CMD_MOVE_OBJECT_DOWN);
            menu.addCommand(commands.CMD_MOVE_OBJECT_LEFT + "Large");
            menu.addCommand(commands.CMD_MOVE_OBJECT_RIGHT + "Large");
            menu.addCommand(commands.CMD_MOVE_OBJECT_UP + "Large");
            menu.addCommand(commands.CMD_MOVE_OBJECT_DOWN + "Large");

            return menu;
        }

        private createTextureMenu() {

            const menu = new controls.Menu("Texture");

            this.createTextureMenuItems(menu);

            return menu;
        }

        createTextureMenuItems(menu: controls.Menu) {

            menu.addCommand(commands.CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE);
            menu.addCommand(commands.CMD_REPLACE_TEXTURE);
            menu.addCommand(commands.CMD_REPLACE_TEXTURE_FRAME);

            const obj = this._editor.getSelectedGameObjects()[0];

            if (obj) {

                if (obj.getEditorSupport().hasComponent(sceneobjects.TextureComponent)) {

                    const comp = obj.getEditorSupport().getComponent(sceneobjects.TextureComponent) as sceneobjects.TextureComponent;

                    const keys = comp.getTextureKeys();

                    if (keys) {

                        const item = this._editor.getScene().getMaker().getPackFinder().findAssetPackItem(keys.key);

                        if (item) {

                            menu.addAction({
                                text: "Show Texture In Asset Pack Editor",
                                callback: () => {

                                    const file = item.getPack().getFile();

                                    const editor = colibri.Platform.getWorkbench().openEditor(file) as pack.ui.editor.AssetPackEditor;

                                    editor.revealKey(item.getKey());
                                }
                            })
                        }
                    }
                }
            }
        }
    }
}