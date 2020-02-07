namespace phasereditor2d.scene.ui.editor.commands {

    export const CAT_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.SceneEditor";
    export const CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
    export const CMD_MOVE_TO_PARENT = "phasereditor2d.scene.ui.editor.commands.MoveToParent";
    export const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
    export const CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
    export const CMD_COMPILE_ALL_SCENE_FILES = "phasereditor2d.scene.ui.editor.commands.CompileAllSceneFiles";
    export const CMD_TRANSLATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.MoveSceneObject";
    export const CMD_ROTATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.RotateSceneObject";
    export const CMD_SCALE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ScaleSceneObject";
    export const CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ResizeTileSpriteSceneObject";
    export const CMD_ADD_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.AddSceneObject";
    export const CMD_TOGGLE_SNAPPING = "phasereditor2d.scene.ui.editor.commands.ToggleSnapping";
    export const CMD_SET_SNAPPING_TO_OBJECT_SIZE = "phasereditor2d.scene.ui.editor.commands.SetSnappingToObjectSize";
    export const CMD_CONVERT_OBJECTS = "phasereditor2d.scene.ui.editor.commands.MorphObjects";
    export const CMD_CONVERT_TO_TILE_SPRITE_OBJECTS = "phasereditor2d.scene.ui.editor.commands.ConvertToTileSprite";
    export const CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE = "phasereditor2d.scene.ui.editor.commands.SelectAllObjectsWithSameTexture";
    export const CMD_REPLACE_TEXTURE = "phasereditor2d.scene.ui.editor.commands.ReplaceTexture";

    function isSceneScope(args: colibri.ui.ide.commands.HandlerArgs) {
        return args.activePart instanceof SceneEditor

            || (args.activeEditor instanceof SceneEditor &&
                (
                    args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                    || args.activePart instanceof phasereditor2d.inspector.ui.views.InspectorView
                ));
    }

    export class SceneEditorCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.addCategory({
                id: CAT_SCENE_EDITOR,
                name: "Scene Editor"
            });

            // copy

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_COPY,

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                args => {
                    (args.activeEditor as SceneEditor).getClipboardManager().copy();
                });

            // paste

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_PASTE,

                args => isSceneScope(args),

                args => {
                    (args.activeEditor as SceneEditor).getClipboardManager().paste();
                });

            // cut

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_CUT,

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                args => {
                    (args.activeEditor as SceneEditor).getClipboardManager().cut();
                });

            // update current editor

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).refreshScene());

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

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                args => args.activeEditor.getUndoManager()
                    .add(new undo.DeleteOperation(args.activeEditor as SceneEditor))
            );

            // join in container

            manager.add({
                command: {
                    id: CMD_JOIN_IN_CONTAINER,
                    name: "Create Container With Selection",
                    tooltip: "Create a container with the selected objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => isSceneScope(args),

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new undo.CreateContainerWithObjectsOperation(args.activeEditor as SceneEditor)
                    )
                },
                keys: {
                    key: "J"
                }
            });

            // move to parent

            manager.add({
                command: {
                    id: CMD_MOVE_TO_PARENT,
                    name: "Move To Parent",
                    tooltip: "Re-parent the selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => isSceneScope(args)
                        && (args.activeEditor as SceneEditor).getSelectedGameObjects().length > 0,

                    executeFunc: args => {

                        const dlg = new ui.sceneobjects.ParentDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                }
            });

            // open compiled file

            manager.add({
                command: {
                    id: CMD_OPEN_COMPILED_FILE,
                    icon: webContentTypes.WebContentTypesPlugin.getInstance().getIcon(webContentTypes.ICON_FILE_SCRIPT),
                    name: "Open Output File",
                    tooltip: "Open the output source file of the scene.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => args.activeEditor instanceof SceneEditor,
                    executeFunc: args => (args.activeEditor as SceneEditor).openSourceFileInEditor()
                }
            });

            // compile scene editor

            manager.add({
                command: {
                    id: CMD_COMPILE_SCENE_EDITOR,
                    icon: ScenePlugin.getInstance().getIcon(ICON_BUILD),
                    name: "Compile Scene",
                    tooltip: "Compile the editor's Scene.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => args.activeEditor instanceof SceneEditor,
                    executeFunc: args => (args.activeEditor as SceneEditor).compile(),
                }
            });

            // compile all scene files

            manager.add({
                command: {
                    id: CMD_COMPILE_ALL_SCENE_FILES,
                    icon: ScenePlugin.getInstance().getIcon(ICON_BUILD),
                    name: "Compile All Scene Files",
                    tooltip: "Compile all the Scene files of the project.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => args.activeWindow instanceof ide.ui.DesignWindow,
                    executeFunc: args => ScenePlugin.getInstance().compileAll(),
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "B"
                }
            });

            // scene tools

            manager.add({
                command: {
                    id: CMD_TRANSLATE_SCENE_OBJECT,
                    name: "Translate Tool",
                    icon: ScenePlugin.getInstance().getIcon(ICON_TRANSLATE),
                    tooltip: "Translate the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.TranslateTool.ID)
                },
                keys: {
                    key: "T"
                }
            });

            manager.add({
                command: {
                    id: CMD_ROTATE_SCENE_OBJECT,
                    name: "Rotate Tool",
                    icon: ScenePlugin.getInstance().getIcon(ICON_ANGLE),
                    tooltip: "Rotate the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.RotateTool.ID)
                },
                keys: {
                    key: "R"
                }
            });

            manager.add({
                command: {
                    id: CMD_SCALE_SCENE_OBJECT,
                    name: "Scale Tool",
                    icon: ScenePlugin.getInstance().getIcon(ICON_SCALE),
                    tooltip: "Scale the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.ScaleTool.ID)
                },
                keys: {
                    key: "S"
                }
            });

            manager.add({
                command: {
                    id: CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT,
                    name: "Resize TileSprite Tool",
                    tooltip: "Resize selected TileSprite objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.TileSpriteSizeTool.ID)
                },
                keys: {
                    key: "Z"
                }
            });

            SceneEditorCommands.registerOriginCommands(manager);

            SceneEditorCommands.registerDepthCommands(manager);

            // add object dialog

            manager.add({
                command: {
                    id: CMD_ADD_SCENE_OBJECT,
                    icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_PLUS),
                    name: "Add Object",
                    tooltip: "Add a new object to the scene",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {
                        const dlg = new editor.AddObjectDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                },
                keys: {
                    key: "A"
                }
            });

            // change type dialog

            manager.add({
                command: {
                    id: CMD_CONVERT_OBJECTS,
                    name: "Replace Type",
                    tooltip: "Replace the type of the selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => isSceneScope(args)
                        && ConvertTypeDialog.canConvert(args.activeEditor as SceneEditor),
                    executeFunc: args => {
                        const dlg = new editor.ConvertTypeDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                }
            });

            // change type to tile sprite

            manager.add({
                command: {
                    id: CMD_CONVERT_TO_TILE_SPRITE_OBJECTS,
                    name: "Convert To TileSprite",
                    tooltip: "Convert the selected objects into TileSprite instances. Or resize it if it is a TileSprite.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args)
                        && ConvertTypeDialog.canConvert(args.activeEditor as SceneEditor),

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        editor.getUndoManager().add(
                            new undo.ConvertTypeOperation(editor, sceneobjects.TileSpriteExtension.getInstance()));
                    }
                },
                keys: {
                    key: "L"
                }
            });

            // texture

            manager.add({
                command: {
                    id: CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE,
                    name: "Select All With Same Texture",
                    tooltip: "Select all the objects with the same texture.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args)
                        && args.activeEditor.getSelection()
                            .filter(
                                obj => obj instanceof Phaser.GameObjects.GameObject
                                    && sceneobjects.EditorSupport.hasObjectComponent(
                                        obj, sceneobjects.TextureComponent))
                            .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const textures = new Set<string>();

                        for (const obj of args.activeEditor.getSelection()) {

                            const textureComponent = sceneobjects.EditorSupport
                                .getObjectComponent(
                                    obj, sceneobjects.TextureComponent) as sceneobjects.TextureComponent;

                            const keys = textureComponent.getTextureKeys();
                            textures.add(JSON.stringify(keys));
                        }

                        const sel = [];

                        editor.getScene().visit(obj => {

                            const textureComponent = sceneobjects.EditorSupport
                                .getObjectComponent(
                                    obj, sceneobjects.TextureComponent) as sceneobjects.TextureComponent;

                            if (textureComponent) {

                                const keys = textureComponent.getTextureKeys();

                                if (textures.has(JSON.stringify(keys))) {

                                    sel.push(obj);
                                }
                            }
                        });

                        editor.setSelection(sel);
                    }
                }
            });

            // change texture

            manager.add({
                command: {
                    id: CMD_REPLACE_TEXTURE,
                    name: "Replace Texture",
                    tooltip: "Change the texture of the selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                    executeFunc: args => {
                        sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor as SceneEditor);
                    }
                },
                keys: {
                    key: "X"
                }
            });

            // snapping

            manager.add({
                command: {
                    id: CMD_TOGGLE_SNAPPING,
                    name: "Toggle Snapping",
                    tooltip: "Enable/disable the snapping.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        editor.toggleSnapping();
                    }
                },
                keys: {
                    key: "E"
                }
            });

            manager.add({
                command: {
                    id: CMD_SET_SNAPPING_TO_OBJECT_SIZE,
                    name: "Snap To Object Size",
                    tooltip: "Enable snapping and set size to the selected object.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => isSceneScope(args)
                        && (args.activeEditor as SceneEditor).getSelectedGameObjects().length > 0,
                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        editor.setSnappingToObjectSize();
                    }
                },
                keys: {
                    key: "W"
                }
            });
        }

        private static registerDepthCommands(manager: colibri.ui.ide.commands.CommandManager) {

            for (const tuple of [["Up", "PageUp"], ["Down", "PageDown"], ["Top", "Home"], ["Bottom", "End"]]) {

                const move = tuple[0];
                const key = tuple[1];

                manager.add({

                    command: {
                        id: "phasereditor2d.scene.ui.editor.commands.Depth" + move,
                        name: "Move Object " + move,
                        category: CAT_SCENE_EDITOR,
                        tooltip: "Move the object in its container to " + move + "."
                    },

                    handler: {
                        testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                        executeFunc: args => args.activeEditor.getUndoManager().add(
                            new undo.DepthOperation(args.activeEditor as editor.SceneEditor, move as any))
                    },

                    keys: {
                        key
                    }
                });
            }
        }

        private static registerOriginCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const names = [
                "Top/Left",
                "Top/Center",
                "Top/Right",
                "Middle/Left",
                "Middle/Center",
                "Middle/Right",
                "Bottom/Left",
                "Bottom/Center",
                "Bottom/Right"
            ];

            const values = [
                [0, 1],
                [0.5, 1],
                [1, 1],
                [0, 0.5],
                [0.5, 0.5],
                [1, 0.5],
                [0, 0],
                [0.5, 0],
                [1, 0],
            ];

            const originProperty: sceneobjects.IProperty<sceneobjects.IOriginLikeObject> = {
                name: "origin",
                defValue: undefined,
                getValue: obj => ({ x: obj.originX, y: obj.originY }),
                setValue: (obj, value) => obj.setOrigin(value.x, value.y)
            };

            for (let i = 0; i < 9; i++) {

                manager.add({
                    command: {
                        id: "phasereditor2d.scene.ui.editor.commands.SetOrigin_" + (i + 1) + "_ToObject",
                        name: "Set Origin To " + names[i],
                        tooltip: `Set the origin of the object to (${values[i][0]},${values[i][1]}`,
                        category: CAT_SCENE_EDITOR
                    },
                    keys: {
                        key: (i + 1).toString(),
                        shift: true,
                    },
                    handler: {
                        testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,
                        executeFunc: args => {

                            const objects = args.activeEditor.getSelection()
                                .filter(obj => sceneobjects.EditorSupport
                                    .hasObjectComponent(obj, sceneobjects.TransformComponent));

                            args.activeEditor.getUndoManager().add(
                                new sceneobjects.SimpleOperation(
                                    args.activeEditor as SceneEditor,
                                    objects,
                                    originProperty,
                                    {
                                        x: values[i][0],
                                        y: values[i][1]
                                    }));
                        }
                    },
                });
            }
        }
    }
}