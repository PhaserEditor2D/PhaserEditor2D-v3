namespace phasereditor2d.scene.ui.editor.commands {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const CAT_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.SceneEditor";
    export const CMD_ADD_OBJECT = "phasereditor2d.scene.ui.editor.commands.AddObject";
    export const CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
    export const CMD_JOIN_IN_LAYER = "phasereditor2d.scene.ui.editor.commands.JoinInLayer";
    export const CMD_BREAK_PARENT = "phasereditor2d.scene.ui.editor.commands.BreakContainer";
    export const CMD_TRIM_CONTAINER = "phasereditor2d.scene.ui.editor.commands.TrimContainer";
    export const CMD_MOVE_TO_PARENT = "phasereditor2d.scene.ui.editor.commands.MoveToParent";
    export const CMD_SELECT_PARENT = "phasereditor2d.scene.ui.editor.commands.SelectParent";
    export const CMD_TOGGLE_VISIBLE = "phasereditor2d.scene.ui.editor.commands.ToggleVisibility";
    export const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
    export const CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
    export const CMD_TRANSLATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.MoveSceneObject";
    export const CMD_SET_ORIGIN_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.SetOriginSceneObject";
    export const CMD_ROTATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.RotateSceneObject";
    export const CMD_SCALE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ScaleSceneObject";
    export const CMD_RESIZE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ResizeSceneObject";
    export const CMD_SELECT_REGION = "phasereditor2d.scene.ui.editor.commands.SelectRegion";
    export const CMD_PAN_SCENE = "phasereditor2d.scene.ui.editor.commands.PanScene";
    export const CMD_TOGGLE_SNAPPING = "phasereditor2d.scene.ui.editor.commands.ToggleSnapping";
    export const CMD_SET_SNAPPING_TO_OBJECT_SIZE = "phasereditor2d.scene.ui.editor.commands.SetSnappingToObjectSize";
    export const CMD_CONVERT_OBJECTS = "phasereditor2d.scene.ui.editor.commands.MorphObjects";
    export const CMD_CONVERT_TO_TILE_SPRITE_OBJECTS = "phasereditor2d.scene.ui.editor.commands.ConvertToTileSprite";
    export const CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE = "phasereditor2d.scene.ui.editor.commands.SelectAllObjectsWithSameTexture";
    export const CMD_REPLACE_TEXTURE = "phasereditor2d.scene.ui.editor.commands.ReplaceTexture";
    export const CMD_REPLACE_TEXTURE_FRAME = "phasereditor2d.scene.ui.editor.commands.ReplaceTextureFrame";
    export const CMD_OPEN_PREFAB = "phasereditor2d.scene.ui.editor.commands.OpenPrefab";
    export const CMD_CREATE_PREFAB_WITH_OBJECT = "phasereditor2d.scene.ui.editor.commands.CreatePrefabWithObject";
    export const CMD_QUICK_EDIT_OUTPUT_FILE = "phasereditor2d.scene.ui.editor.commands.QuickEditOutputFile";
    export const CMD_OPEN_OUTPUT_FILE_IN_VSCODE = "phasereditor2d.scene.ui.editor.commands.OpenOutputFileInVSCode";
    export const CMD_MOVE_OBJECT_LEFT = "phasereditor2d.scene.ui.editor.commands.MoveObjectLeft";
    export const CMD_MOVE_OBJECT_RIGHT = "phasereditor2d.scene.ui.editor.commands.MoveObjectRight";
    export const CMD_MOVE_OBJECT_UP = "phasereditor2d.scene.ui.editor.commands.MoveObjectUp";
    export const CMD_MOVE_OBJECT_DOWN = "phasereditor2d.scene.ui.editor.commands.MoveObjectDown";
    export const CMD_FIX_SCENE_FILES_ID = "phasereditor2d.scene.ui.editor.commands.FixSceneFilesID";
    export const CMD_DUPLICATE_SCENE_FILE = "phasereditor2d.scene.ui.editor.commands.DuplicateSceneFile";
    export const CMD_CLEAR_SCENE_THUMBNAIL_CACHE = "phasereditor2d.scene.ui.editor.commands.ClearSceneThumbnailCache";
    export const CMD_OPEN_SCENE_FILE = "phasereditor2d.scene.ui.editor.commands.OpenSceneFile";

    function isSceneScope(args: colibri.ui.ide.commands.HandlerArgs) {

        return args.activePart instanceof SceneEditor

            || (args.activeEditor instanceof SceneEditor &&
                (
                    args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                    || args.activePart instanceof colibri.inspector.ui.views.InspectorView
                ));
    }

    function isOnlyContainerSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        return isSceneScope(args) && editorHasSelection(args)

            && (args.activeEditor as SceneEditor).getSelectedGameObjects()

                .filter(obj => obj instanceof sceneobjects.Container)

                .length === args.activeEditor.getSelection().length;
    }

    function isOnlyContainerOrLayerSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        return isSceneScope(args) && editorHasSelection(args)

            && (args.activeEditor as SceneEditor).getSelectedGameObjects()

                .filter(obj => obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer)

                .length === args.activeEditor.getSelection().length;
    }

    function editorHasSelection(args: colibri.ui.ide.commands.HandlerArgs) {

        return args.activeEditor && args.activeEditor.getSelection().length > 0;
    }

    export class SceneEditorCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.addCategory({
                id: CAT_SCENE_EDITOR,
                name: "Scene Editor"
            });

            SceneEditorCommands.registerGlobalCommands(manager);

            SceneEditorCommands.registerEditCommands(manager);

            SceneEditorCommands.registerAddObjectCommands(manager);

            SceneEditorCommands.registerSceneCommands(manager);

            SceneEditorCommands.registerVisibilityCommands(manager);

            SceneEditorCommands.registerSelectionCommands(manager);

            SceneEditorCommands.registerParentCommands(manager);

            SceneEditorCommands.registerCompilerCommands(manager);

            SceneEditorCommands.registerToolsCommands(manager);

            SceneEditorCommands.registerOriginCommands(manager);

            SceneEditorCommands.registerDepthCommands(manager);

            SceneEditorCommands.registerTypeCommands(manager);

            SceneEditorCommands.registerMoveObjectCommands(manager);

            SceneEditorCommands.registerTextureCommands(manager);

            SceneEditorCommands.registerSnappingCommands(manager);
        }

        static registerAddObjectCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_ADD_OBJECT,
                    category: CAT_SCENE_EDITOR,
                    name: "Add Object",
                    tooltip: "Add a built-in object to the scene."
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const dlg = new dialogs.AddObjectDialog(args.activeEditor as editor.SceneEditor);
                        dlg.create();
                    }
                },
                keys: {
                    key: "A"
                }
            })
        }

        static registerGlobalCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // fix scene id

            manager.add({
                command: {
                    id: CMD_FIX_SCENE_FILES_ID,
                    category: CAT_SCENE_EDITOR,
                    name: "Fix Duplicated Scenes ID",
                    tooltip: "Fix the duplicated ID of the scene files."
                },
                handler: {
                    testFunc: phasereditor2d.ide.ui.actions.isNotWelcomeWindowScope,
                    executeFunc: async args => {

                        const files = await colibri.ui.ide.FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

                        files.sort((a, b) => a.getModTime() - b.getModTime());

                        const usedIds = new Set();

                        const dlg = new controls.dialogs.ProgressDialog();
                        const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

                        dlg.create();

                        dlg.setTitle("Fix Duplicated Scenes ID");

                        monitor.addTotal(files.length);

                        const finder = ScenePlugin.getInstance().getSceneFinder();

                        finder.setEnabled(false);

                        let someoneFixed = false;

                        for (const file of files) {

                            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                            const data = JSON.parse(content) as core.json.ISceneData;

                            const id = data.id;

                            if (usedIds.has(id)) {

                                data.id = Phaser.Utils.String.UUID();

                                console.log(`Fix Scene ID of "${file.getFullName()}". New id: ` + data.id);

                                const newContent = JSON.stringify(data, null, 4);

                                await colibri.ui.ide.FileUtils.setFileString_async(file, newContent);

                                someoneFixed = true;

                            } else {

                                usedIds.add(id);
                            }

                            monitor.step();
                        }

                        finder.setEnabled(true);

                        dlg.close();

                        if (someoneFixed) {

                            await finder.preload(monitor);

                        } else {

                            alert("No scene files found with a duplicated ID.");
                        }
                    }
                }
            });

            // clear scene thumbnail database
            manager.add({
                command: {
                    id: CMD_CLEAR_SCENE_THUMBNAIL_CACHE,
                    name: "Clear Scene Thumbnail Cache",
                    tooltip: "Clear the thumbnail images cache.",
                    category: CAT_SCENE_EDITOR,
                },
                handler: {
                    executeFunc: args => {

                        ui.SceneThumbnailCache.clearCache();
                    }
                }
            });

            // open scene file

            manager.add({
                command: {
                    id: CMD_OPEN_SCENE_FILE,
                    category: CAT_SCENE_EDITOR,
                    name: "Go To Scene",
                    tooltip: "Quick dialog to open a scene file."
                },
                handler: {
                    testFunc: args => colibri.Platform.getWorkbench().getActiveWindow() instanceof ide.ui.DesignWindow,
                    executeFunc: args => {

                        const dlg = new dialogs.OpenSceneFileDialog();
                        dlg.create();
                    }
                },
                keys: {
                    control: true,
                    alt: true,
                    key: "O"
                }
            });
        }

        static registerSnappingCommands(manager: colibri.ui.ide.commands.CommandManager) {

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

        static registerTextureCommands(manager: colibri.ui.ide.commands.CommandManager) {

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
                                obj => sceneobjects.isGameObject(obj)
                                    && sceneobjects.GameObjectEditorSupport.hasObjectComponent(
                                        obj, sceneobjects.TextureComponent))
                            .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const textures = new Set<string>();

                        for (const obj of args.activeEditor.getSelection()) {

                            const textureComponent = sceneobjects.GameObjectEditorSupport
                                .getObjectComponent(
                                    obj, sceneobjects.TextureComponent) as sceneobjects.TextureComponent;

                            const keys = textureComponent.getTextureKeys();
                            textures.add(JSON.stringify(keys));
                        }

                        const sel = [];

                        editor.getScene().visit(obj => {

                            const textureComponent = sceneobjects.GameObjectEditorSupport
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

                    testFunc: args => isSceneScope(args)
                        && args.activeEditor.getSelection().length > 0
                        && args.activeEditor.getSelection()
                            .filter(obj => sceneobjects.ChangeTextureOperation.canChangeTextureOf(obj))
                            .length > 0,

                    executeFunc: args => {
                        sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor as SceneEditor);
                    }
                },
                keys: {
                    key: "X"
                }
            });

            // change texture frame

            manager.add({
                command: {
                    id: CMD_REPLACE_TEXTURE_FRAME,
                    name: "Replace Texture Frame",
                    tooltip: "Change the texture's frame of the selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args)
                        && args.activeEditor.getSelection().length > 0
                        && args.activeEditor.getSelection()
                            .filter(obj => sceneobjects.ChangeTextureOperation.canChangeTextureOf(obj))
                            .length === 1,

                    executeFunc: args => {

                        const obj = args.activeEditor.getSelection()[0] as sceneobjects.ISceneGameObject;
                        const comp = obj.getEditorSupport().getComponent(sceneobjects.TextureComponent) as sceneobjects.TextureComponent;
                        const keys = comp.getTextureKeys();

                        sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor as SceneEditor, keys.key);
                    }
                },
                keys: {
                    key: "M"
                }
            });
        }

        static registerSceneCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // update current editor

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).refreshScene());

            manager.add({
                command: {
                    id: CMD_DUPLICATE_SCENE_FILE,
                    name: "Duplicate Scene File",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Duplicate the scene file, with a new ID.",
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: async args => {

                        const editor = args.activeEditor as SceneEditor;

                        const file = editor.getInput();

                        const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                        const data = JSON.parse(content);

                        data.id = Phaser.Utils.String.UUID();

                        const newContent = JSON.stringify(data, null, 4);

                        const newName = colibri.ui.ide.FileUtils.getFileCopyName(file);

                        const newFile = await colibri.ui.ide.FileUtils.createFile_async(file.getParent(), newName, newContent);

                        colibri.Platform.getWorkbench().openEditor(newFile);
                    }
                }
            })
        }

        static registerSelectionCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // select all

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL,

                args => args.activePart instanceof SceneEditor,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().selectAll();
                });

            // clear selection

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,

                args => {

                    if (controls.dialogs.Dialog.getActiveDialog()

                        || controls.ColorPickerManager.isActivePicker()) {

                        return false;
                    }

                    return isSceneScope(args);
                },

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().clearSelection();
                });
        }

        static registerEditCommands(manager: colibri.ui.ide.commands.CommandManager) {

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

            // delete

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                args => args.activeEditor.getUndoManager()
                    .add(new undo.DeleteOperation(args.activeEditor as SceneEditor))
            );
        }

        private static registerMoveObjectCommands(manager: colibri.ui.ide.commands.CommandManager) {

            class Operation extends undo.SceneSnapshotOperation {

                private _dx: number;
                private _dy: number;

                constructor(editor: SceneEditor, dx: number, dy: number) {
                    super(editor);

                    this._dx = dx;
                    this._dy = dy;
                }

                protected async performModification() {

                    for (const obj of this._editor.getSelection()) {

                        const sprite = obj as Phaser.GameObjects.Sprite;

                        sprite.x += this._dx;
                        sprite.y += this._dy;
                    }

                    this.getEditor().dispatchSelectionChanged();
                }
            }

            const dxMap: any = {}
            const dyMap: any = {}
            const nameMap: any = {};

            dxMap[CMD_MOVE_OBJECT_LEFT] = -1;
            dxMap[CMD_MOVE_OBJECT_RIGHT] = 1;
            dxMap[CMD_MOVE_OBJECT_UP] = 0;
            dxMap[CMD_MOVE_OBJECT_DOWN] = 0;

            dyMap[CMD_MOVE_OBJECT_LEFT] = 0;
            dyMap[CMD_MOVE_OBJECT_RIGHT] = 0;
            dyMap[CMD_MOVE_OBJECT_UP] = -1;
            dyMap[CMD_MOVE_OBJECT_DOWN] = 1;

            nameMap[CMD_MOVE_OBJECT_LEFT] = "Left";
            nameMap[CMD_MOVE_OBJECT_RIGHT] = "Right";
            nameMap[CMD_MOVE_OBJECT_UP] = "Up";
            nameMap[CMD_MOVE_OBJECT_DOWN] = "Down";

            for (const cmd of [CMD_MOVE_OBJECT_LEFT, CMD_MOVE_OBJECT_RIGHT, CMD_MOVE_OBJECT_UP, CMD_MOVE_OBJECT_DOWN]) {

                for (const large of [true, false]) {

                    manager.add({
                        command: {
                            id: cmd + (large ? "Large" : ""),
                            category: CAT_SCENE_EDITOR,
                            name: "Move Object Position " + (large ? "10x " : "") + nameMap[cmd],
                            tooltip: (large ? "10x " : "") + "Move selected objects position in the '" + nameMap[cmd] + "' direction"
                        },
                        handler: {
                            testFunc: args => {

                                if (!isSceneScope(args)) {

                                    return false;
                                }

                                if (args.activeEditor.getSelection().length === 0) {

                                    return false;
                                }

                                for (const obj of args.activeEditor.getSelection()) {

                                    if (!sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.TransformComponent)) {

                                        return false;
                                    }
                                }

                                return true;
                            },
                            executeFunc: args => {

                                const editor = args.activeEditor as SceneEditor;
                                const settings = editor.getScene().getSettings();


                                const dx = dxMap[cmd] * (large ? 10 : 1) * (settings.snapEnabled ? settings.snapWidth : 1);
                                const dy = dyMap[cmd] * (large ? 10 : 1) * (settings.snapEnabled ? settings.snapHeight : 1);

                                editor.getUndoManager().add(new Operation(editor, dx, dy));
                            }
                        },
                        keys: {
                            key: "Arrow" + nameMap[cmd],
                            shift: large ? true : undefined
                        }
                    });
                }
            }
        }

        private static registerParentCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // join in layer

            manager.add({
                command: {
                    id: CMD_JOIN_IN_LAYER,
                    name: "Create Layer With Selection",
                    tooltip: "Create a layer with the selected objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => {

                        if (isSceneScope(args)) {

                            const editor = args.activeEditor as editor.SceneEditor;

                            for (const obj of editor.getSelectedGameObjects()) {

                                if (obj instanceof sceneobjects.Layer) {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    },

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new ui.sceneobjects.CreateLayerWithObjectsOperation(args.activeEditor as SceneEditor)
                    )
                }
            });

            // join in container

            manager.add({
                command: {
                    id: CMD_JOIN_IN_CONTAINER,
                    name: "Create Container With Selection",
                    tooltip: "Create a container with the selected objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: args => {

                        if (isSceneScope(args)) {

                            const editor = args.activeEditor as editor.SceneEditor;

                            for (const obj of editor.getSelectedGameObjects()) {

                                if (obj instanceof sceneobjects.Layer) {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    },

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new ui.sceneobjects.CreateContainerWithObjectsOperation(args.activeEditor as SceneEditor)
                    )
                },
                keys: {
                    key: "J"
                }
            });

            // trim container

            manager.add({
                command: {
                    id: CMD_TRIM_CONTAINER,
                    name: "Trim Container",
                    tooltip: "Remove left/top margin of children.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isOnlyContainerSelected,

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new ui.sceneobjects.TrimContainerOperation(args.activeEditor as SceneEditor)
                    )
                },
                keys: {
                    key: "T",
                    shift: true
                }
            });

            // break container

            manager.add({
                command: {
                    id: CMD_BREAK_PARENT,
                    name: "Break Parent",
                    tooltip: "Destroy container and re-parent children.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isOnlyContainerOrLayerSelected,

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new ui.sceneobjects.BreakParentOperation(args.activeEditor as SceneEditor)
                    )
                },
                keys: {
                    key: "B",
                    shift: true
                }
            });

            // select parent

            manager.add({
                command: {
                    id: CMD_SELECT_PARENT,
                    name: "Select Parent",
                    tooltip: "Select the parent container",
                    category: CAT_SCENE_EDITOR,
                },
                handler: {

                    testFunc: args => isSceneScope(args) && (args.activeEditor as SceneEditor)

                        .getSelectedGameObjects()

                        .map(obj => sceneobjects.getObjectParent(obj))

                        .filter(parent => parent !== undefined && parent !== null)

                        .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const sel = editor.getSelectedGameObjects()

                            .map(obj => sceneobjects.getObjectParent(obj))

                            .filter(parent => parent !== undefined && parent !== null);

                        editor.setSelection(sel);
                    }
                },
                keys: {
                    key: "P"
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
                    testFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        if (isSceneScope(args) && editorHasSelection(args)) {

                            for (const obj of editor.getSelection()) {

                                if (sceneobjects.isGameObject(obj)) {

                                    if (obj instanceof sceneobjects.Layer) {

                                        return false;
                                    }

                                } else {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;

                    },

                    executeFunc: args => {

                        const dlg = new ui.sceneobjects.ParentDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                },
                keys: {
                    shift: true,
                    key: "P"
                }
            });

        }

        private static registerTypeCommands(manager: colibri.ui.ide.commands.CommandManager) {

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
                            new undo.ConvertTypeOperation(
                                editor, sceneobjects.TileSpriteExtension.getInstance()));
                    }
                },
                keys: {
                    key: "L"
                }
            });

            // open prefab

            manager.add({
                command: {
                    id: CMD_OPEN_PREFAB,
                    name: "Open Prefab",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Open the Prefab file of the selected prefab instance."
                },
                handler: {
                    testFunc: args => {

                        if (!isSceneScope(args)) {

                            return false;
                        }

                        const editor = args.activeEditor as SceneEditor;

                        const sel = editor.getSelectedGameObjects();

                        for (const obj of sel) {

                            if (!obj.getEditorSupport().isPrefabInstance()) {

                                return false;
                            }
                        }

                        return true;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const sel = editor.getSelectedGameObjects();

                        for (const obj of sel) {

                            const file = obj.getEditorSupport().getPrefabFile();

                            if (file) {

                                colibri.Platform.getWorkbench().openEditor(file);
                            }
                        }
                    }
                },
                keys: {
                    key: "F"
                }
            });

            // create prefab

            manager.add({
                command: {
                    id: CMD_CREATE_PREFAB_WITH_OBJECT,
                    name: "Create Prefab With Object",
                    tooltip: "Create a new prefab file with the selected object.",
                    category: CAT_SCENE_EDITOR,
                },
                handler: {
                    testFunc: args => {

                        if (!isSceneScope(args)) {

                            return false;
                        }

                        const sel = args.activeEditor.getSelection();

                        if (sel.length !== 1) {

                            return false;
                        }

                        const obj = sel[0];

                        return sceneobjects.isGameObject(obj);
                    },
                    executeFunc: args => {

                        const obj = args.activeEditor.getSelection()[0] as sceneobjects.ISceneGameObject;

                        const objData: core.json.IObjectData = {} as any;

                        obj.getEditorSupport().writeJSON(objData);

                        objData.id = Phaser.Utils.String.UUID();
                        objData["x"] = 0;
                        objData["y"] = 0;

                        const ext = new dialogs.NewPrefabFileFromObjectDialogExtension(objData);

                        ext.setOpenInEditor(false);
                        ext.setCreatedCallback(newFile => {

                            const editor = args.activeEditor as SceneEditor;

                            editor.getUndoManager().add(
                                new undo.ConvertTypeOperation(
                                    editor, newFile));

                            editor.refreshBlocks();

                        });

                        const dlg = ext.createDialog({
                            initialFileLocation: (args.activeEditor.getInput() as io.FilePath).getParent()
                        });

                        dlg.setTitle("New Prefab File");
                    }
                }
            });

            // quick source edit

            manager.add({
                command: {
                    id: CMD_QUICK_EDIT_OUTPUT_FILE,
                    name: "Quick Edit Output File",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Shortcut to edit the compiled code in a popup editor."
                },
                handler: {
                    testFunc: args => args.activeEditor instanceof SceneEditor,
                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        editor.openOutputFileQuickEditorDialog();
                    }
                },
                keys: {
                    key: "Q"
                }
            });

            if (ide.IDEPlugin.getInstance().isDesktopMode()) {

                const editorName = ide.IDEPlugin.getInstance().getExternalEditorName();

                manager.add({
                    command: {
                        id: CMD_OPEN_OUTPUT_FILE_IN_VSCODE,
                        name: "Open Output File in " + editorName,
                        category: CAT_SCENE_EDITOR,
                        tooltip: "Open the compiler output file in the configured external editor (" + editorName + ")"
                    },
                    handler: {
                        testFunc: args => args.activeEditor instanceof SceneEditor,
                        executeFunc: args => {

                            const editor = args.activeEditor as SceneEditor;

                            const file = editor.getOutputFile();

                            if (file) {

                                ide.IDEPlugin.getInstance().openFileExternalEditor(file);

                            } else {

                                alert(`Output from "${editor.getInput().getProjectRelativeName()}" not found.`);
                            }
                        }
                    }, keys: {
                        control: true,
                        alt: true,
                        key: "E"
                    }
                });
            }
        }

        private static registerCompilerCommands(manager: colibri.ui.ide.commands.CommandManager) {

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
        }

        private static registerToolsCommands(manager: colibri.ui.ide.commands.CommandManager) {

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
                    id: CMD_SET_ORIGIN_SCENE_OBJECT,
                    name: "Origin Tool",
                    icon: ScenePlugin.getInstance().getIcon(ICON_ORIGIN),
                    tooltip: "Change the origin of the selected scene object",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.OriginTool.ID)
                },
                keys: {
                    key: "O"
                }
            });

            manager.add({
                command: {
                    id: CMD_SELECT_REGION,
                    name: "Select Region Tool",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Select all objects inside a region",
                    icon: ScenePlugin.getInstance().getIcon(ICON_SELECT_REGION)
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.SelectionRegionTool.ID)
                },
                keys: {
                    shift: true,
                    key: "S"
                }
            });

            manager.add({
                command: {
                    id: CMD_PAN_SCENE,
                    name: "Pan Tool",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Pan the scene viewport"
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const editor = (args.activeEditor as SceneEditor);

                        editor.getToolsManager().swapTool(ui.sceneobjects.PanTool.ID);
                    }
                },
                keys: {
                    key: "Space"
                }
            });

            manager.add({
                command: {
                    id: CMD_RESIZE_SCENE_OBJECT,
                    name: "Resize Tool",
                    tooltip: "Resize selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.SizeTool.ID)
                },
                keys: {
                    key: "Z"
                }
            });
        }

        private static registerVisibilityCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_TOGGLE_VISIBLE,
                    category: CAT_SCENE_EDITOR,
                    name: "Toggle Visibility",
                    tooltip: "Toggle the visible property of the object"
                },
                handler: {
                    testFunc: e => {

                        if (!isSceneScope(e)) {

                            return false;
                        }

                        const sel = e.activeEditor.getSelection();

                        for (const obj of sel) {

                            if (!sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.VisibleComponent)) {

                                return false;
                            }
                        }

                        return sel.length > 0;
                    },
                    executeFunc: e => {

                        let visible = false;

                        const sel = e.activeEditor.getSelection();

                        for (const obj of sel) {

                            const objVisible = sceneobjects.VisibleComponent.visible.getValue(obj);

                            if (objVisible) {

                                visible = true;
                                break;
                            }
                        }

                        const editor = e.activeEditor as ui.editor.SceneEditor;

                        editor.getUndoManager().add(
                            new sceneobjects.SimpleOperation(
                                editor, sel, sceneobjects.VisibleComponent.visible, !visible));
                    }
                },
                keys: {
                    key: "V"
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
                        name: "Move Object Depth " + move,
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

        static computeOriginCommandData(): Array<{
            command: string,
            name: string,
            key: string,
            keyLabel: string,
            x: number,
            y: number
        }> {

            const values = [
                { x: 0, y: 0, k: 7, n: "Top/Left" },
                { x: 0.5, y: 0, k: 8, n: "Top/Center" },
                { x: 1, y: 0, k: 9, n: "Top/Right" },
                { x: 0, y: 0.5, k: 4, n: "Middle/Left" },
                { x: 0.5, y: 0.5, k: 5, n: "Middle/Center" },
                { x: 1, y: 0.5, k: 6, n: "Middle/Right" },
                { x: 0, y: 1, k: 1, n: "Bottom/Left" },
                { x: 0.5, y: 1, k: 2, n: "Bottom/Center" },
                { x: 1, y: 1, k: 3, n: "Bottom/Right" },
            ];

            return values.map(value => {
                return {
                    command: "phasereditor2d.scene.ui.editor.commands.SetOrigin_" + value.n + "_ToObject",
                    name: "Set Origin To " + value.n,
                    x: value.x,
                    y: value.y,
                    key: "Numpad" + value.k,
                    keyLabel: "Numpad " + value.k
                };
            });
        }

        private static registerOriginCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const originProperty: sceneobjects.IProperty<sceneobjects.IOriginLikeObject> = {
                name: "origin",
                defValue: undefined,
                getValue: obj => ({ x: obj.originX, y: obj.originY }),
                setValue: (obj, value) => {
                    // obj.setOrigin(value.x, value.y);
                    sceneobjects.OriginToolItem
                        .simpleChangeOriginKeepPosition(obj as any, value.x, value.y);
                }
            };

            for (const data of this.computeOriginCommandData()) {

                manager.add({
                    command: {
                        id: data.command,
                        name: data.name,
                        tooltip: `Set the origin of the object to (${data.x},${data.y})`,
                        category: CAT_SCENE_EDITOR
                    },
                    keys: {
                        key: data.key,
                        keyLabel: data.keyLabel,
                        control: true,
                    },
                    handler: {
                        testFunc: args => {

                            if (!isSceneScope(args)) {
                                return false;
                            }

                            const sel = args.activeEditor.getSelection();

                            const len = sel

                                .filter(obj =>
                                    sceneobjects.GameObjectEditorSupport.hasObjectComponent(
                                        obj, sceneobjects.OriginComponent)
                                    && (obj as sceneobjects.ISceneGameObject)
                                        .getEditorSupport().isUnlockedProperty(sceneobjects.OriginComponent.originX))
                                .length;

                            return len > 0 && len === sel.length;
                        },
                        executeFunc: args => {

                            const objects = args.activeEditor.getSelection()
                                .filter(obj => sceneobjects.GameObjectEditorSupport
                                    .hasObjectComponent(obj, sceneobjects.TransformComponent));


                            args.activeEditor.getUndoManager().add(
                                new sceneobjects.SimpleOperation(
                                    args.activeEditor as SceneEditor,
                                    objects,
                                    originProperty,
                                    {
                                        x: data.x,
                                        y: data.y
                                    }));
                        }
                    },
                });
            }
        }
    }
}