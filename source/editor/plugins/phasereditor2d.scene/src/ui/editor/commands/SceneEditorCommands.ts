
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
    export const CMD_SELECT_CHILDREN = "phasereditor2d.scene.ui.editor.commands.SelectChildren";
    export const CMD_TOGGLE_VISIBLE = "phasereditor2d.scene.ui.editor.commands.ToggleVisibility";
    export const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
    export const CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
    export const CMD_TRANSLATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.MoveSceneObject";
    export const CMD_SET_ORIGIN_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.SetOriginSceneObject";
    export const CMD_ROTATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.RotateSceneObject";
    export const CMD_SCALE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ScaleSceneObject";
    export const CMD_EDIT_POLYGON_OBJECT = "phasereditor2d.scene.ui.editor.commands.EditPolygonObject";
    export const CMD_RESIZE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ResizeSceneObject";
    export const CMD_EDIT_SLICE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.EditSliceSceneObject";
    export const CMD_EDIT_ARCADE_BODY = "phasereditor2d.scene.ui.editor.commands.EditArcadeBody";
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
    export const CMD_MIGRATE_AND_BUILD_ALL_SCENE_FILES = "phasereditor2d.scene.ui.editor.commands.MigrateAndBuildAllSceneFiles";
    export const CMD_OPEN_SCENE_FILE = "phasereditor2d.scene.ui.editor.commands.OpenSceneFile";
    export const CMD_DISABLE_AWAKE_EVENT_PREFABS = "phasereditor2d.scene.ui.editor.commands.DisableAwakeEventPrefabs";
    export const CMD_SET_DEFAULT_RENDER_TYPE_TO_CANVAS = "phasereditor2d.scene.ui.editor.commands.SetDefaultRenderTypeToCanvas";
    export const CMD_SET_DEFAULT_RENDER_TYPE_TO_WEBGL = "phasereditor2d.scene.ui.editor.commands.SetDefaultRenderTypeToWebGL";
    export const CMD_ENABLE_PIXEL_ART_RENDERING = "phasereditor2d.scene.ui.editor.commands.EnablePixelArtRendering";
    export const CMD_DISABLE_PIXEL_ART_RENDERING = "phasereditor2d.scene.ui.editor.commands.DisablePixelArtRendering";
    export const CMD_PASTE_IN_PLACE = "phasereditor2d.scene.ui.editor.commands.PasteInPlace";
    export const CMD_ARCADE_ENABLE_BODY = "phasereditor2d.scene.ui.editor.commands.ArcadeEnableBody";
    export const CMD_ARCADE_DISABLE_BODY = "phasereditor2d.scene.ui.editor.commands.ArcadeDisableBody";
    export const CMD_ARCADE_CENTER_BODY = "phasereditor2d.scene.ui.editor.commands.ArcadeCenterBody";
    export const CMD_ARCADE_RESIZE_TO_OBJECT_BODY = "phasereditor2d.scene.ui.editor.commands.ArcadeResizeBodyToObject";
    export const CMD_OPEN_SCRIPT_DIALOG = "phasereditor2d.scene.ui.editor.commands.OpenScriptDialog";
    export const CMD_OPEN_ADD_SCRIPT_DIALOG = "phasereditor2d.scene.ui.editor.commands.OpenAddScriptDialog";
    export const CMD_PREVIEW_SCENE = "phasereditor2d.scene.ui.editor.commands.PreviewScene";
    export const CMD_EDIT_HIT_AREA = "phasereditor2d.scene.ui.editor.commands.ResizeHitArea";
    export const CMD_ADD_PREFAB_PROPERTY = "phasereditor2d.scene.ui.editor.commands.AddPrefabProperty";
    export const CMD_SORT_OBJ_UP = "phasereditor2d.scene.ui.editor.commands.SortObjectUp";
    export const CMD_SORT_OBJ_DOWN = "phasereditor2d.scene.ui.editor.commands.SortObjectDown";
    export const CMD_SORT_OBJ_TOP = "phasereditor2d.scene.ui.editor.commands.SortObjectTop";
    export const CMD_SORT_OBJ_BOTTOM = "phasereditor2d.scene.ui.editor.commands.SortObjectBottom";
    export const CMD_ADD_USER_COMPONENT = "phasereditor2d.scene.ui.editor.commands.AddUserComponent";
    export const CMD_BROWSE_USER_COMPONENTS = "phasereditor2d.scene.ui.editor.commands.BrowseUserComponents";
    export const CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKIN = "phasereditor2d.scene.ui.editor.commands.SelectAllObjectsWithSameSpineSkin";
    export const CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKELETON = "phasereditor2d.scene.ui.editor.commands.SelectAllObjectsWithSameSpineSkeleton";

    function isCommandDialogActive() {

        return colibri.Platform.getWorkbench()
            .getActiveDialog() instanceof controls.dialogs.CommandDialog
    }

    function isSceneScope(args: colibri.ui.ide.commands.HandlerArgs) {

        if (args.activeDialog) {

            return false;
        }

        return args.activePart instanceof SceneEditor

            || (args.activeEditor instanceof SceneEditor &&
                (
                    args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                    || args.activePart instanceof colibri.inspector.ui.views.InspectorView
                ));
    }

    function noNestedPrefabSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        return args.activeEditor.getSelection()
            .filter(obj => ui.sceneobjects.isGameObject(obj))
            .filter((obj: ui.sceneobjects.ISceneGameObject) => obj.getEditorSupport().isNestedPrefabInstance())
            .length === 0;
    }


    function noUserComponentsNodeInPrefabSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        return args.activeEditor.getSelection()
            .filter(obj => obj instanceof sceneobjects.UserComponentNode && obj.isPrefabDefined())
            .length === 0;
    }

    function isOnlyContainerSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        return isSceneScope(args) && editorHasSelection(args)

            && (args.activeEditor as SceneEditor).getSelectedGameObjects()

                .filter(obj => obj instanceof sceneobjects.Container)

                .length === args.activeEditor.getSelection().length;
    }

    function editorHasSelection(args: colibri.ui.ide.commands.HandlerArgs) {

        return args.activeEditor && args.activeEditor.getSelection().length > 0;
    }

    function onlyGameObjectsSelected(args: colibri.ui.ide.commands.HandlerArgs) {

        if (args.activeEditor instanceof SceneEditor) {

            for (const obj of args.activeEditor.getSelection()) {

                if (!sceneobjects.isGameObject(obj)) {

                    return false;
                }
            }

            return args.activeEditor.getSelection().length > 0;
        }

        return false;
    }

    export class SceneEditorCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.addCategory({
                id: CAT_SCENE_EDITOR,
                name: "Scene Editor"
            });

            this.registerGlobalCommands(manager);

            this.registerEditCommands(manager);

            this.registerAddObjectCommands(manager);

            this.registerSceneCommands(manager);

            this.registerVisibilityCommands(manager);

            this.registerSelectionCommands(manager);

            this.registerParentCommands(manager);

            this.registerCompilerCommands(manager);

            this.registerToolsCommands(manager);

            this.registerOriginCommands(manager);

            this.registerGameObjectDepthCommands(manager);

            this.registerPlainObjectOrderCommands(manager);

            this.registerListCommands(manager);

            this.registerTypeCommands(manager);

            this.registerTranslateObjectCommands(manager);

            this.registerTextureCommands(manager);

            this.registerSnappingCommands(manager);

            this.registerArcadeCommands(manager);

            this.registerScriptNodeCommands(manager);

            this.registerUserComponentCommands(manager);

            this.registerPrefabCommands(manager);

            this.registerPropertiesCommands(manager);

            this.registerSpineCommands(manager);

            this.registerCodeSnippetOrderCommands(manager);
        }

        static registerCodeSnippetOrderCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const moves: [undo.DepthMove, string][] = [
                ["Up", CMD_SORT_OBJ_UP],
                ["Down", CMD_SORT_OBJ_DOWN],
                ["Top", CMD_SORT_OBJ_TOP],
                ["Bottom", CMD_SORT_OBJ_BOTTOM]
            ];

            for (const tuple of moves) {

                const move = tuple[0];
                const cmd = tuple[1];

                manager.addHandlerHelper(cmd,
                    // testFunc 
                    args => isSceneScope(args) && args.activeEditor.getSelection().length > 0
                        && codesnippets.CodeSnippetOrderOperation.allow(args.activeEditor as any, move),
                    // execFunc
                    args => args.activeEditor.getUndoManager().add(
                        new codesnippets.CodeSnippetOrderOperation(args.activeEditor as editor.SceneEditor, move)
                    ));
            }
        }

        static registerPlainObjectOrderCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const moves: [undo.DepthMove, string][] = [
                ["Up", CMD_SORT_OBJ_UP],
                ["Down", CMD_SORT_OBJ_DOWN],
                ["Top", CMD_SORT_OBJ_TOP],
                ["Bottom", CMD_SORT_OBJ_BOTTOM]
            ];

            for (const tuple of moves) {

                const move = tuple[0];
                const cmd = tuple[1];

                manager.addHandlerHelper(cmd,
                    // testFunc 
                    args => isSceneScope(args) && args.activeEditor.getSelection().length > 0
                        && undo.PlainObjectOrderOperation.allow(args.activeEditor as any, move),
                    // execFunc
                    args => args.activeEditor.getUndoManager().add(
                        new undo.PlainObjectOrderOperation(args.activeEditor as editor.SceneEditor, move)
                    ));
            }
        }

        private static registerPrefabCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_ADD_PREFAB_PROPERTY,
                    name: "Add Prefab Property",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Add a new property to the current prefab"
                },
                handler: {
                    testFunc: args => {

                        if (isSceneScope(args)) {

                            const editor = args.activeEditor as SceneEditor;

                            return editor.getScene().isPrefabSceneType();
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const dialog = new ui.dialogs.AddPrefabPropertyDialog();
                        dialog.create();

                        //    ui.editor.properties.PrefabPropertySection.runPropertiesOperation(editor, () => {

                        //         // TODO: show the Add Property dialog

                        //    }, true);
                    }
                }
            })
        }

        private static registerUserComponentCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // add user component

            manager.add({

                command: {
                    id: CMD_ADD_USER_COMPONENT,
                    category: CAT_SCENE_EDITOR,
                    name: "Add User Component",
                    tooltip: "Pick a User Component and add it to the selected objects"
                },
                keys: {
                    key: "KeyM",
                    keyLabel: "M"
                },
                handler: {
                    testFunc: onlyGameObjectsSelected,
                    executeFunc: args => {

                        const finder = ScenePlugin.getInstance().getSceneFinder();
                        const editor = args.activeEditor as SceneEditor;

                        const editorCompList = args.activeEditor.getSelection()
                            .map(obj => sceneobjects.GameObjectEditorSupport.getObjectComponent(obj, sceneobjects.UserComponentsEditorComponent) as sceneobjects.UserComponentsEditorComponent);

                        const used = new Set(
                            [...editorCompList
                                .flatMap(editorComp => editorComp.getLocalUserComponents())
                                .map(info => info.component.getName()),

                            ...editorCompList.flatMap(editorComp => editorComp.getPrefabUserComponents())
                                .flatMap(info => info.components)
                                .map(c => c.getName())
                            ]
                        );

                        class ContentProvider implements controls.viewers.ITreeContentProvider {

                            getRoots(input: any): any[] {

                                return finder.getUserComponentsModels()
                                    .filter(info => info.model.getComponents().filter(c => !used.has(c.getName())).length > 0);
                            }

                            getChildren(parentObj: core.json.IUserComponentsModelInfo | usercomponent.UserComponent): any[] {

                                if (parentObj instanceof usercomponent.UserComponent) {

                                    return [];
                                }

                                return parentObj.model.getComponents().filter(c => !used.has(c.getName()));
                            }
                        }

                        const viewer = new controls.viewers.TreeViewer("UserComponentInstancePropertySection.addComponentDialogViewer");

                        viewer.setStyledLabelProvider({
                            getStyledTexts: (obj: usercomponent.UserComponent | core.json.IUserComponentsModelInfo, dark) => {

                                const theme = controls.Controls.getTheme();

                                if (obj instanceof usercomponent.UserComponent) {

                                    return [{
                                        text: obj.getDisplayNameOrName(),
                                        color: theme.viewerForeground
                                    }];
                                }

                                const folder = obj.file.getParent();

                                let folderName = folder.getName();

                                const isNodeLibraryFolder = ide.core.code.isNodeLibraryFile(folder);

                                if (isNodeLibraryFolder) {

                                    folderName = ide.core.code.findNodeModuleName(folder);
                                }

                                return [{
                                    text: obj.file.getNameWithoutExtension(),
                                    color: theme.viewerForeground
                                }, {
                                    text: " - " + folderName,
                                    color: isNodeLibraryFolder ?
                                        ScenePlugin.getInstance().getScriptsLibraryColor()
                                        : theme.viewerForeground + "90"
                                }];
                            }
                        });

                        viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                            (obj: core.json.IUserComponentsModelInfo | usercomponent.UserComponent) =>
                                new controls.viewers.IconImageCellRenderer(
                                    obj instanceof usercomponent.UserComponent ?
                                        resources.getIcon(resources.ICON_USER_COMPONENT)
                                        : colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER))));

                        viewer.setContentProvider(new ContentProvider());

                        viewer.setInput([]);

                        viewer.expandRoots(false);

                        const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                        dlg.setSize(undefined, 400, true);

                        dlg.create();

                        dlg.setTitle("Add User Component");

                        dlg.enableButtonOnlyWhenOneElementIsSelected(dlg.addOpenButton("Add Component", () => {

                            const selComp = viewer.getSelectionFirstElement() as usercomponent.UserComponent;

                            if (selComp) {


                                editor.getUndoManager().add(new ui.editor.undo.SimpleSceneSnapshotOperation(editor, () => {

                                    for (const editorComp of editorCompList) {

                                        editorComp.addUserComponent(selComp.getName());
                                    }
                                }));

                                // section.updateWithSelection();
                                editor.dispatchSelectionChanged();
                            }
                        }), obj => obj instanceof usercomponent.UserComponent);

                        dlg.addCancelButton();
                    }
                }
            });

            // browse user component
            manager.add({
                command: {
                    id: CMD_BROWSE_USER_COMPONENTS,
                    category: CAT_SCENE_EDITOR,
                    name: "Browse User Components",
                    tooltip: "Browse all user components in the scene's objects."
                },
                keys: {
                    key: "KeyM",
                    shift: true,
                    keyLabel: "M"
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const dlg = new sceneobjects.BrowseUserComponentsDialog(
                            args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                }
            })
        }

        private static registerScriptNodeCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.add({
                command: {
                    id: CMD_OPEN_SCRIPT_DIALOG,
                    category: CAT_SCENE_EDITOR,
                    name: "Browse Scripts",
                    tooltip: "Opens the Browse Scripts dialog",
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const dlg = new sceneobjects.BrowseScriptsDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                },
                keys: {
                    key: "KeyU",
                    shift: true
                }
            });

            manager.add({
                command: {
                    id: CMD_OPEN_ADD_SCRIPT_DIALOG,
                    category: CAT_SCENE_EDITOR,
                    name: "Add Script",
                    tooltip: "Opens the Add Script Dialog",
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        const dlg = new sceneobjects.AddScriptDialog(args.activeEditor as SceneEditor);
                        dlg.create();
                    }
                },
                keys: {
                    key: "KeyU",
                }
            });
        }

        private static registerArcadeCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // enable body

            manager.add({
                command: {
                    id: CMD_ARCADE_ENABLE_BODY,
                    category: CAT_SCENE_EDITOR,
                    name: "Add Arcade Physics Body",
                    tooltip: "Add an Arcade physics body to the selected objects.",
                },
                handler: {
                    testFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        if (isSceneScope(args)) {

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.isDisplayObject()) {

                                    return false;
                                }

                                if (objES.hasComponent(ui.sceneobjects.ArcadeComponent)) {

                                    return false;
                                }

                                if (objES.isPrefabInstance()) {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        editor.getUndoManager().add(
                            new ui.sceneobjects.EnableArcadeBodyOperation(editor, true));
                    },
                }
            });

            // disable body

            manager.add({
                command: {
                    id: CMD_ARCADE_DISABLE_BODY,
                    category: CAT_SCENE_EDITOR,
                    name: "Remove Arcade Physics Body",
                    tooltip: "Remove the Arcade physics body from the selected objects.",
                },
                handler: {
                    testFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        if (isSceneScope(args)) {

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.hasComponent(ui.sceneobjects.ArcadeComponent)
                                    || obj instanceof ui.sceneobjects.ArcadeImage
                                    || obj instanceof ui.sceneobjects.ArcadeSprite) {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        editor.getUndoManager().add(
                            new ui.sceneobjects.EnableArcadeBodyOperation(editor, false));
                    },
                }
            });

            // center body

            manager.add({
                command: {
                    id: CMD_ARCADE_CENTER_BODY,
                    category: CAT_SCENE_EDITOR,
                    name: "Center Arcade Physics Body",
                    tooltip: "Center the Arcade Physics Body of the selected objects.",
                },
                handler: {
                    testFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        if (isSceneScope(args)) {

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.hasComponent(ui.sceneobjects.ArcadeComponent)) {

                                    return false;
                                }

                                if (!objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.offset.x)
                                    || !objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.offset.y)) {

                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        editor.getUndoManager().add(new ui.sceneobjects.ArcadeCenterBodyOperation(
                            editor, editor.getSelectedGameObjects()));
                    },
                }
            });

            // resize body

            manager.add({
                command: {
                    id: CMD_ARCADE_RESIZE_TO_OBJECT_BODY,
                    category: CAT_SCENE_EDITOR,
                    name: "Resize Arcade Physics Body To Object Size",
                    tooltip: "Resize & center the Arcade Physics Body to fill the whole object's size.",
                },
                handler: {
                    testFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        if (isSceneScope(args)) {

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.hasComponent(ui.sceneobjects.ArcadeComponent)) {

                                    return false;
                                }

                                if (!objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.offset.x)
                                    || !objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.offset.x)) {

                                    return false;
                                }

                                if (ui.sceneobjects.ArcadeComponent.isCircleBody(obj as any)) {

                                    if (!objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.radius)) {

                                        return false;
                                    }

                                } else {

                                    if (!objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.size.x)
                                        || !objES.isUnlockedProperty(ui.sceneobjects.ArcadeComponent.size.y)) {

                                        return false;
                                    }
                                }
                            }

                            return true;
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as ui.editor.SceneEditor;

                        editor.getUndoManager().add(new ui.sceneobjects.ArcadeResizeBodyToObjectOperation(
                            editor, editor.getSelectedGameObjects()));
                    },
                }
            });
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
                    key: "KeyA"
                }
            })
        }

        static registerGlobalCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // preview scene

            manager.add({
                command: {
                    id: CMD_PREVIEW_SCENE,
                    name: "Preview Scene",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Run the game and jump to the scene of the active scene editor"
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => {

                        let name = localStorage.getItem("phasereditor2d.lastPreviewScene");

                        const file = (args.activeEditor as SceneEditor).getInput();

                        const isPrefab = ScenePlugin.getInstance().getSceneFinder().isPrefabFile(file);

                        if (!isPrefab) {

                            name = file.getNameWithoutExtension()
                        }

                        ide.IDEPlugin.getInstance().playProject(name);
                    }
                },
                keys: {
                    control: true,
                    key: "Digit0",
                    keyLabel: "0"
                }
            });

            // set default renderer type

            manager.add({
                command: {
                    id: CMD_SET_DEFAULT_RENDER_TYPE_TO_CANVAS,
                    name: "Set Default Render Type To CANVAS",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Set the default render type of the scenes to Phaser.CANVAS"
                },
                handler: {
                    testFunc: phasereditor2d.ide.ui.actions.isNotWelcomeWindowScope,
                    executeFunc: args => {

                        ScenePlugin.getInstance().setDefaultRenderType("canvas");
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_SET_DEFAULT_RENDER_TYPE_TO_WEBGL,
                    name: "Set Default Render Type To WEBGL",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Set the default render type of the scenes to Phaser.WEBGL"
                },
                handler: {
                    testFunc: phasereditor2d.ide.ui.actions.isNotWelcomeWindowScope,
                    executeFunc: args => {

                        ScenePlugin.getInstance().setDefaultRenderType("webgl");
                    }
                }
            });

            // enable pixel art rendering

            manager.add({
                command: {
                    id: CMD_ENABLE_PIXEL_ART_RENDERING,
                    name: "Enable Pixel Art Rendering",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Enable pixel-art rendering in the scenes"
                },
                handler: {
                    testFunc: phasereditor2d.ide.ui.actions.isNotWelcomeWindowScope,
                    executeFunc: args => {

                        ScenePlugin.getInstance().setDefaultRenderPixelArt(true);
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_DISABLE_PIXEL_ART_RENDERING,
                    name: "Disable Pixel Art Rendering",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Disable pixel-art rendering in the scenes"
                },
                handler: {
                    testFunc: phasereditor2d.ide.ui.actions.isNotWelcomeWindowScope,
                    executeFunc: args => {

                        ScenePlugin.getInstance().setDefaultRenderPixelArt(false);
                    }
                }
            });

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

            // migrate scene files

            manager.add({
                command: {
                    id: CMD_MIGRATE_AND_BUILD_ALL_SCENE_FILES,
                    name: "Migrate All Scene Files",
                    tooltip: "Run the migration process in all scene files and compile the project.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    executeFunc: async args => {

                        const dlg = new controls.dialogs.ProgressDialog();

                        dlg.create();
                        dlg.setTitle("Migrating & Compiling Scene Files");

                        const finder = ScenePlugin.getInstance().getSceneFinder();

                        const files = finder.getSceneFiles(false);

                        const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

                        monitor.addTotal(files.length);

                        for (const file of files) {

                            try {

                                const finder = ScenePlugin.getInstance().getSceneFinder();

                                const data1 = finder.getSceneData(file);

                                const scene = await ui.OfflineScene.createScene(data1);

                                // compile code

                                const compiler = new core.code.SceneCompiler(scene, file);
                                await compiler.compile();

                                // write scene data
                                const writer = new core.json.SceneWriter(scene);

                                const data2 = writer.toJSON();

                                const content = JSON.stringify(data2, null, 4);

                                await colibri.ui.ide.FileUtils.setFileString_async(file, content);

                            } catch (e) {

                                alert((e as Error).message);
                            }
                            monitor.step();
                        }

                        dlg.close();
                    }
                }
            })

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

                        ui.SceneThumbnailCache.getInstance().clearCache();
                        ScenePlugin.getInstance().getSpineThumbnailCache().clearCache();
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
                    key: "KeyO"
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
                    key: "KeyE"
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
                    key: "KeyW"
                }
            });
        }

        static registerSpineCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // select all same skeleton

            manager.add({
                command: {
                    id: CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKELETON,
                    name: "Select All With Same Spine Skeleton",
                    tooltip: "Select all the objects with the same Spine skeleton.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args)
                        && args.activeEditor.getSelection()
                            .filter(
                                obj => obj instanceof sceneobjects.SpineObject)
                            .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const skeletons = new Set<string>();

                        for (const obj of args.activeEditor.getSelection()) {

                            if (obj instanceof sceneobjects.SpineObject) {

                                skeletons.add(obj.dataKey);
                            }
                        }

                        const sel = [];

                        editor.getScene().visitAll(obj => {

                            if (obj instanceof sceneobjects.SpineObject) {

                                if (skeletons.has(obj.dataKey)) {

                                    sel.push(obj);
                                }
                            }
                        });

                        editor.setSelection(sel);
                    }
                }
            });

            // select all same skin

            manager.add({
                command: {
                    id: CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKIN,
                    name: "Select All With Same Spine Skin",
                    tooltip: "Select all the objects with the same Spine skin.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {

                    testFunc: args => isSceneScope(args)
                        && args.activeEditor.getSelection()
                            .filter(
                                obj => obj instanceof sceneobjects.SpineObject)
                            .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const skins = new Set<string>();

                        for (const obj of args.activeEditor.getSelection()) {

                            if (obj instanceof sceneobjects.SpineObject) {

                                skins.add(`${obj.dataKey}+${obj.skeleton.skin?.name}`);
                            }
                        }

                        const sel = [];

                        editor.getScene().visitAll(obj => {

                            if (obj instanceof sceneobjects.SpineObject) {

                                const skin = `${obj.dataKey}+${obj.skeleton.skin?.name}`;

                                if (skins.has(skin)) {

                                    sel.push(obj);
                                }
                            }
                        });

                        editor.setSelection(sel);
                    }
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

                        editor.getScene().visitAll(obj => {

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
                            .filter(obj => sceneobjects.GameObjectEditorSupport.hasObjectComponent(
                                obj, sceneobjects.TextureComponent))
                            .length > 0,

                    executeFunc: args => {
                        sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor as SceneEditor);
                    }
                },
                keys: {
                    key: "KeyX"
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
                            .filter(obj => sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.TextureComponent))
                            .length === 1,

                    executeFunc: args => {

                        const obj = args.activeEditor.getSelection()[0] as sceneobjects.ISceneGameObject;
                        const comp = obj.getEditorSupport().getComponent(sceneobjects.TextureComponent) as sceneobjects.TextureComponent;
                        const keys = comp.getTextureKeys();

                        sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor as SceneEditor, keys.key);
                    }
                },
                keys: {
                    shift: true,
                    key: "KeyF"
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
                    (args.activeEditor as SceneEditor).getClipboardManager().paste(false);
                });

            manager.add({
                command: {
                    id: CMD_PASTE_IN_PLACE,
                    category: colibri.ui.ide.actions.CAT_EDIT,
                    name: "Paste In Place",
                    tooltip: "Paste the objects in destiny at the same original locations.",
                },
                handler: {
                    testFunc: args => isSceneScope(args),
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getClipboardManager().paste(true),
                },
                keys: {
                    control: true,
                    shift: true,
                    key: "KeyV"
                }
            });

            // cut

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_CUT,

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,

                args => {
                    (args.activeEditor as SceneEditor).getClipboardManager().cut();
                });

            // delete

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                args => isSceneScope(args) && args.activeEditor.getSelection().length > 0 && noNestedPrefabSelected(args) && noUserComponentsNodeInPrefabSelected(args),

                args => args.activeEditor.getUndoManager()
                    .add(new undo.DeleteOperation(args.activeEditor as SceneEditor))
            );

            // sort

            manager.add({
                command: {
                    id: CMD_SORT_OBJ_UP,
                    name: "Move Up",
                    tooltip: "Move up object in the list.",
                    category: CAT_SCENE_EDITOR
                },
                keys: [{ key: "PageUp" }, { key: "Numpad9" }]
            });

            manager.add({
                command: {
                    id: CMD_SORT_OBJ_DOWN,
                    name: "Move Down",
                    tooltip: "Move down object in the list.",
                    category: CAT_SCENE_EDITOR
                },
                keys: [{ key: "PageDown" }, { key: "Numpad3" }]
            });

            manager.add({
                command: {
                    id: CMD_SORT_OBJ_TOP,
                    name: "Move Top",
                    tooltip: "Move top object in the list.",
                    category: CAT_SCENE_EDITOR
                },
                keys: [{ key: "Home" }, { key: "Numpad7" }]
            });

            manager.add({
                command: {
                    id: CMD_SORT_OBJ_BOTTOM,
                    name: "Move Bottom",
                    tooltip: "Move bottom object in the list.",
                    category: CAT_SCENE_EDITOR
                },
                keys: [{ key: "End" }, { key: "Numpad1" }]
            });
        }

        private static registerTranslateObjectCommands(manager: colibri.ui.ide.commands.CommandManager) {

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

                                if (isCommandDialogActive()) {

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

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.isDisplayObject()) {

                                    return false;
                                }

                                if (objES.isNestedPrefabInstance()) {

                                    return false;
                                }

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

                            if (editor.getSelectedGameObjects().length !== editor.getSelection().length) {

                                return false;
                            }

                            for (const obj of editor.getSelectedGameObjects()) {

                                const objES = obj.getEditorSupport();

                                if (!objES.isDisplayObject()) {

                                    return false;
                                }

                                if (objES.isNestedPrefabInstance()) {

                                    return false;
                                }

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
                    key: "KeyJ"
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
                    key: "KeyT",
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
                    testFunc: args => {

                        return isSceneScope(args) && editorHasSelection(args)

                            && (args.activeEditor as SceneEditor).getSelectedGameObjects()

                                .filter(obj => obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer)

                                .filter(obj => !obj.getEditorSupport().isPrefabInstance())

                                .length === args.activeEditor.getSelection().length;
                    },

                    executeFunc: args => args.activeEditor.getUndoManager().add(
                        new ui.sceneobjects.BreakParentOperation(args.activeEditor as SceneEditor)
                    )
                },
                keys: {
                    key: "KeyB",
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

                        .map(obj => obj.getEditorSupport().getObjectParent())

                        .filter(parent => parent !== undefined && parent !== null)

                        .length > 0,

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const sel = editor.getSelectedGameObjects()

                            .map(obj => obj.getEditorSupport().getObjectParent())

                            .filter(parent => parent !== undefined && parent !== null);

                        editor.setSelection(sel);
                    }
                },
                keys: {
                    key: "KeyP"
                }
            });

            // select children

            manager.add({
                command: {
                    id: CMD_SELECT_CHILDREN,
                    name: "Select Children",
                    tooltip: "Select the children",
                    category: CAT_SCENE_EDITOR,
                },
                handler: {

                    testFunc: args => {

                        if (!isSceneScope(args)) {

                            return false;
                        }

                        const sel = args.activeEditor.getSelection();

                        return (sel.filter(obj =>
                            obj instanceof sceneobjects.Container
                            || obj instanceof sceneobjects.Layer))
                            .length === sel.length;
                    },

                    executeFunc: args => {

                        const editor = args.activeEditor as SceneEditor;

                        const sel = editor.getSelection()

                            .filter(obj => sceneobjects.isGameObject(obj))

                            .flatMap((obj: sceneobjects.ISceneGameObject) => obj.getEditorSupport().getObjectChildren())

                            .filter(obj => {

                                const editorSupport = obj.getEditorSupport();

                                if (editorSupport.isMutableNestedPrefabInstance()) {

                                    return true;
                                }

                                if (editorSupport.isPrefabInstanceElement()) {

                                    return false;
                                }

                                return true;
                            })

                        editor.setSelection(sel);
                    }
                },
                keys: {
                    key: "KeyN"
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

                                    if ((obj as sceneobjects.ISceneGameObject)
                                        .getEditorSupport().isNestedPrefabInstance()) {

                                        return false;
                                    }

                                    if (obj instanceof sceneobjects.Layer) {

                                        return false;
                                    }

                                    if (obj instanceof sceneobjects.FXObject) {

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
                    key: "KeyP"
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
                    key: "KeyL"
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

                        const selection = args.activeEditor.getSelection();

                        const prefabsLen = selection.filter(
                            obj => sceneobjects.isGameObject(obj)
                                && (obj as sceneobjects.ISceneGameObject)
                                    .getEditorSupport().isPrefabInstance()).length;

                        return selection.length === prefabsLen;
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
                    key: "KeyF"
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

                        const objData: core.json.IObjectData = {
                            unlock: ["x", "y"]
                        } as any;

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

                            console.log(`Compiling scene ${newFile.getName()}`);

                            core.code.SceneCompileAllExtension.compileSceneFile(newFile);
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
                    key: "KeyQ"
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
                        key: "KeyE"
                    }
                });
            }
        }

        private static registerCompilerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // open compiled file

            manager.add({
                command: {
                    id: CMD_OPEN_COMPILED_FILE,
                    icon: resources.getIcon(resources.ICON_FILE_SCRIPT),
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
                    icon: resources.getIcon(resources.ICON_BUILD),
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
                    icon: resources.getIcon(resources.ICON_TRANSLATE),
                    tooltip: "Translate the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.TranslateTool.ID)
                },
                keys: {
                    key: "KeyT"
                }
            });

            manager.add({
                command: {
                    id: CMD_ROTATE_SCENE_OBJECT,
                    name: "Rotate Tool",
                    icon: resources.getIcon(resources.ICON_ANGLE),
                    tooltip: "Rotate the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.RotateTool.ID)
                },
                keys: {
                    key: "KeyR"
                }
            });

            manager.add({
                command: {
                    id: CMD_EDIT_POLYGON_OBJECT,
                    name: "Polygon Tool",
                    tooltip: "Edit the points of the polygon.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.PolygonTool.ID)
                },
                keys: {
                    key: "KeyY"
                }
            })

            manager.add({
                command: {
                    id: CMD_SCALE_SCENE_OBJECT,
                    name: "Scale Tool",
                    icon: resources.getIcon(resources.ICON_SCALE),
                    tooltip: "Scale the selected scene objects",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.ScaleTool.ID)
                },
                keys: {
                    key: "KeyS"
                }
            });

            manager.add({
                command: {
                    id: CMD_SET_ORIGIN_SCENE_OBJECT,
                    name: "Origin Tool",
                    icon: resources.getIcon(resources.ICON_ORIGIN),
                    tooltip: "Change the origin of the selected scene object",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.OriginTool.ID)
                },
                keys: {
                    key: "KeyO"
                }
            });

            manager.add({
                command: {
                    id: CMD_SELECT_REGION,
                    name: "Select Region Tool",
                    category: CAT_SCENE_EDITOR,
                    tooltip: "Select all objects inside a region",
                    icon: resources.getIcon(resources.ICON_SELECT_REGION)
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.SelectionRegionTool.ID)
                },
                keys: {
                    shift: true,
                    key: "KeyS"
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
                    key: "KeyZ"
                }
            });

            manager.add({
                command: {
                    id: CMD_EDIT_ARCADE_BODY,
                    name: "Arcade Physics Body Tool",
                    tooltip: "Edit body of selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.ArcadeBodyTool.ID)
                },
                keys: {
                    key: "KeyB"
                }
            });

            manager.add({
                command: {
                    id: CMD_EDIT_SLICE_SCENE_OBJECT,
                    name: "Slice Tool",
                    tooltip: "Edit selected slice objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.SliceTool.ID)
                }
            });

            manager.add({
                command: {
                    id: CMD_EDIT_HIT_AREA,
                    name: "Hit Area Tool",
                    tooltip: "Resize the hit area of the selected objects.",
                    category: CAT_SCENE_EDITOR
                },
                handler: {
                    testFunc: isSceneScope,
                    executeFunc: args => (args.activeEditor as SceneEditor)
                        .getToolsManager().swapTool(ui.sceneobjects.EditHitAreaTool.ID)
                },
                keys: {
                    key: "KeyI"
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
                    executeFunc: async (e) => {

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

                        const unlocked = await editor.confirmUnlockProperty([sceneobjects.VisibleComponent.visible],
                            "Visible", sceneobjects.VisibleSection.SECTION_ID);

                        if (unlocked) {

                            editor.getUndoManager().add(
                                new sceneobjects.SimpleOperation(
                                    editor, sel, sceneobjects.VisibleComponent.visible, !visible));
                        }
                    }
                },
                keys: {
                    key: "KeyV"
                }
            });
        }

        private static registerGameObjectDepthCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const moves: [undo.DepthMove, string][] = [
                ["Up", CMD_SORT_OBJ_UP],
                ["Down", CMD_SORT_OBJ_DOWN],
                ["Top", CMD_SORT_OBJ_TOP],
                ["Bottom", CMD_SORT_OBJ_BOTTOM]
            ];

            for (const tuple of moves) {

                const move = tuple[0];
                const cmd = tuple[1];

                manager.addHandlerHelper(cmd,
                    // testFunc 
                    args => isSceneScope(args) && args.activeEditor.getSelection().length > 0
                        && undo.GameObjectDepthOperation.allow(args.activeEditor as any, move),
                    // execFunc
                    args => args.activeEditor.getUndoManager().add(
                        new undo.GameObjectDepthOperation(args.activeEditor as editor.SceneEditor, move)
                    ));
            }
        }

        private static registerPropertiesCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // order commands

            const moves: [undo.DepthMove, string][] = [
                ["Up", CMD_SORT_OBJ_UP],
                ["Down", CMD_SORT_OBJ_DOWN],
                ["Top", CMD_SORT_OBJ_TOP],
                ["Bottom", CMD_SORT_OBJ_BOTTOM]
            ];

            for (const tuple of moves) {

                const move = tuple[0];
                const cmd = tuple[1];

                manager.addHandlerHelper(cmd,
                    // testFunc
                    args => isSceneScope(args) && args.activeEditor.getSelection().length > 0
                        && properties.PrefabPropertyOrderAction.allow(args.activeEditor as any, move),
                    // execFunc
                    args => properties.ChangePrefabPropertiesOperation.runPropertiesOperation(args.activeEditor as SceneEditor, props => {

                        properties.PrefabPropertyOrderAction.execute(args.activeEditor as SceneEditor, move);
                    })
                );
            }
        }

        private static registerListCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // order commands

            const moves: [undo.DepthMove, string][] = [
                ["Up", CMD_SORT_OBJ_UP],
                ["Down", CMD_SORT_OBJ_DOWN],
                ["Top", CMD_SORT_OBJ_TOP],
                ["Bottom", CMD_SORT_OBJ_BOTTOM]
            ];

            for (const tuple of moves) {

                const move = tuple[0];
                const cmd = tuple[1];

                manager.addHandlerHelper(cmd,
                    // testFunc
                    args => isSceneScope(args) && args.activeEditor.getSelection().length > 0
                        && sceneobjects.ListOrderOperation.allow(args.activeEditor as any, move),
                    // execFunc
                    args => args.activeEditor.getUndoManager().add(
                        new sceneobjects.ListOrderOperation(args.activeEditor as editor.SceneEditor, move))
                );
            }
        }

        static computeOriginCommandData(): Array<{
            command: string,
            name: string,
            icon: string,
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
                    icon: "origin-" + value.n.replace("/", "").toLowerCase(),
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
                        icon: resources.getIcon(data.icon),
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
                                        obj, sceneobjects.OriginComponent))
                                .length;

                            return len > 0 && len === sel.length;
                        },
                        executeFunc: async (args) => {

                            const editor = args.activeEditor as SceneEditor;

                            const objects = editor.getSelectedGameObjects()
                                .filter(obj => sceneobjects.GameObjectEditorSupport
                                    .hasObjectComponent(obj, sceneobjects.OriginComponent));

                            const unlocked = await editor.confirmUnlockProperty([
                                sceneobjects.OriginComponent.originX,
                                sceneobjects.OriginComponent.originY
                            ], "Origin", sceneobjects.OriginSection.SECTION_ID);

                            if (unlocked) {

                                editor.getUndoManager().add(
                                    new sceneobjects.SimpleOperation(
                                        args.activeEditor as SceneEditor,
                                        objects,
                                        originProperty,
                                        {
                                            x: data.x,
                                            y: data.y
                                        }));
                            }
                        }
                    },
                });
            }
        }
    }
}