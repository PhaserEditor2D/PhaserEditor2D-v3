namespace phasereditor2d.scene {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export const ICON_GROUP = "group";
    export const ICON_TRANSLATE = "translate";
    export const ICON_ANGLE = "angle";
    export const ICON_SCALE = "scale";
    export const ICON_ORIGIN = "origin";
    export const ICON_BUILD = "build";
    export const ICON_LOCKED = "locked";
    export const ICON_UNLOCKED = "unlocked";
    export const ICON_LIST = "list";

    export class ScenePlugin extends colibri.Plugin {

        private static _instance = new ScenePlugin();

        private _sceneFinder: core.json.SceneFinder;

        static DEFAULT_CANVAS_CONTEXT = Phaser.CANVAS;

        static DEFAULT_EDITOR_CANVAS_CONTEXT = Phaser.WEBGL;

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.scene");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            this._sceneFinder = new core.json.SceneFinder();

            // preload project

            reg.addExtension(this._sceneFinder.getProjectPreloader());

            // content type resolvers

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new core.SceneContentTypeResolver()],
                    5
                ));

            // content type renderer

            reg.addExtension(
                new files.ui.viewers.SimpleContentTypeCellRendererExtension(
                    core.CONTENT_TYPE_SCENE,
                    new ui.viewers.SceneFileCellRenderer()
                )
            );

            // icons loader

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_GROUP,
                    ICON_ANGLE,
                    ICON_ORIGIN,
                    ICON_SCALE,
                    ICON_TRANSLATE,
                    ICON_BUILD,
                    ICON_LOCKED,
                    ICON_UNLOCKED,
                    ICON_LIST
                ])
            );

            // loader updates

            reg.addExtension(
                new ui.sceneobjects.ImageLoaderUpdater()
            );

            // commands

            reg.addExtension(
                new ide.commands.CommandExtension(ui.editor.commands.SceneEditorCommands.registerCommands));

            // main menu

            reg.addExtension(new controls.MenuExtension(phasereditor2d.ide.ui.DesignWindow.MENU_MAIN,
                {
                    command: ui.editor.commands.CMD_COMPILE_ALL_SCENE_FILES
                }
            ));

            // editors

            reg.addExtension(
                new ide.EditorExtension([
                    ui.editor.SceneEditor.getFactory()
                ]));

            // new file wizards

            reg.addExtension(
                new ui.dialogs.NewSceneFileDialogExtension(),
                new ui.dialogs.NewPrefabFileDialogExtension()
            );

            // file properties

            reg.addExtension(new files.ui.views.FilePropertySectionExtension(
                page => new ui.SceneFileSection(page),
                page => new ui.ManySceneFileSection(page)
            ));

            // scene object extensions

            reg.addExtension(
                ui.sceneobjects.ImageExtension.getInstance(),
                ui.sceneobjects.SpriteExtension.getInstance(),
                ui.sceneobjects.TileSpriteExtension.getInstance(),
                ui.sceneobjects.ContainerExtension.getInstance()
            );

            // property sections

            reg.addExtension(new ui.editor.properties.SceneEditorPropertySectionExtension(
                page => new ui.sceneobjects.GameObjectVariableSection(page),
                page => new ui.sceneobjects.ListVariableSection(page),
                page => new ui.sceneobjects.GameObjectListSection(page),
                page => new ui.sceneobjects.ParentSection(page),
                page => new ui.sceneobjects.TransformSection(page),
                page => new ui.sceneobjects.OriginSection(page),
                page => new ui.sceneobjects.TileSpriteSection(page),
                page => new ui.sceneobjects.TextureSection(page),
                page => new ui.sceneobjects.ListSection(page),
            ));

            // scene tools

            reg.addExtension(new ui.editor.tools.SceneToolExtension(
                new ui.sceneobjects.TranslateTool(),
                new ui.sceneobjects.RotateTool(),
                new ui.sceneobjects.ScaleTool(),
                new ui.sceneobjects.TileSpriteSizeTool()
            ));
        }

        getSceneFinder() {
            return this._sceneFinder;
        }

        getObjectExtensions(): ui.sceneobjects.SceneObjectExtension[] {
            return colibri.Platform
                .getExtensions<ui.sceneobjects.SceneObjectExtension>(ui.sceneobjects.SceneObjectExtension.POINT_ID);
        }

        getObjectExtensionByObjectType(type: string) {
            return this.getObjectExtensions().find(ext => ext.getTypeName() === type);
        }

        getLoaderUpdaterForAsset(asset: any) {

            const exts = colibri.Platform
                .getExtensions<ui.sceneobjects.LoaderUpdaterExtension>(ui.sceneobjects.LoaderUpdaterExtension.POINT_ID);

            for (const ext of exts) {

                if (ext.acceptAsset(asset)) {

                    return ext;
                }
            }

            return null;
        }

        async compileAll() {

            const files = this._sceneFinder.getFiles();

            const dlg = new controls.dialogs.ProgressDialog();

            dlg.create();
            dlg.setTitle("Compiling Scene Files");

            const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

            monitor.addTotal(files.length);

            for (const file of files) {

                const data = this.getSceneFinder().getSceneData(file);

                const scene = await ui.OfflineScene.createScene(data);

                const compiler = new core.code.SceneCompiler(scene, file);

                await compiler.compile();

                scene.destroyGame();

                monitor.step();
            }

            dlg.close();
        }
    }

    colibri.Platform.addPlugin(ScenePlugin.getInstance());
}