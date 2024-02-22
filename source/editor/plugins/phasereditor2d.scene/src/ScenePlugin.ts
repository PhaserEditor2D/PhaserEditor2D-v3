namespace phasereditor2d.scene {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export const SCENE_OBJECT_IMAGE_CATEGORY = "Texture";
    export const SCENE_OBJECT_TEXT_CATEGORY = "String";
    export const SCENE_OBJECT_GROUPING_CATEGORY = "Grouping";
    export const SCENE_OBJECT_SHAPE_CATEGORY = "Shape";
    export const SCENE_OBJECT_TILEMAP_CATEGORY = "Tile Map";
    export const SCENE_OBJECT_ARCADE_CATEGORY = "Arcade";
    export const SCENE_OBJECT_INPUT_CATEGORY = "Input";
    export const SCENE_OBJECT_SCRIPT_CATEGORY = "Script";
    export const SCENE_OBJECT_FX_CATEGORY = "FX";
    export const SCENE_OBJECT_SPINE_CATEGORY = "Spine";

    export const SCENE_OBJECT_CATEGORIES = [
        SCENE_OBJECT_IMAGE_CATEGORY,
        SCENE_OBJECT_GROUPING_CATEGORY,
        SCENE_OBJECT_TEXT_CATEGORY,
        SCENE_OBJECT_ARCADE_CATEGORY,
        SCENE_OBJECT_SHAPE_CATEGORY,
        SCENE_OBJECT_TILEMAP_CATEGORY,
        SCENE_OBJECT_INPUT_CATEGORY,
        SCENE_OBJECT_SPINE_CATEGORY,
        SCENE_OBJECT_SCRIPT_CATEGORY
    ];

    export const SCENE_OBJECT_CATEGORY_SET = new Set(SCENE_OBJECT_CATEGORIES);

    export class ScenePlugin extends colibri.Plugin {

        private static _instance = new ScenePlugin();

        static DEFAULT_CANVAS_CONTEXT = Phaser.WEBGL;

        static DEFAULT_EDITOR_CANVAS_CONTEXT = Phaser.WEBGL;

        static DEFAULT_PIXEL_ART = true;

        static DEFAULT_EDITOR_PIXEL_ART = true;

        private _sceneFinder: core.json.SceneFinder;
        private _docs: phasereditor2d.ide.core.PhaserDocs;
        private _eventsDocs: phasereditor2d.ide.core.PhaserDocs;
        private _spineThumbnailCache: ui.SpineThumbnailCache;
        private _canvasManager: ui.CanvasManager;

        static getInstance() {

            return this._instance;
        }

        private constructor() {

            super("phasereditor2d.scene");
        }

        getCanvasManager() {

            return this._canvasManager;
        }

        async starting() {

            const type = window.localStorage.getItem("phasereditor2d.scene.RENDER_TYPE");

            console.log("ScenePlugin: default render type: " + (type === "canvas" ? "Phaser.CANVAS" : "Phaser.WEBGL"));

            this.setDefaultRenderType(type as any);

            const pixelArt = window.localStorage.getItem("phasereditor2d.scene.PIXEL_ART") !== "0";

            this.setDefaultRenderPixelArt(pixelArt);

            console.log("ScenePlugin: default pixelArt: " + pixelArt);

            this._canvasManager = new ui.CanvasManager();
        }

        setDefaultRenderType(type?: "canvas" | "webgl") {

            window.localStorage.setItem("phasereditor2d.scene.RENDER_TYPE", type);

            ScenePlugin.DEFAULT_CANVAS_CONTEXT = type === "canvas" ? Phaser.CANVAS : Phaser.WEBGL;
            ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT = ScenePlugin.DEFAULT_CANVAS_CONTEXT;
        }

        setDefaultRenderPixelArt(pixelArt: boolean) {

            window.localStorage.setItem("phasereditor2d.scene.PIXEL_ART", pixelArt ? "1" : "0");

            ScenePlugin.DEFAULT_PIXEL_ART = pixelArt;
            ScenePlugin.DEFAULT_EDITOR_PIXEL_ART = pixelArt;
        }

        getPhaserEventsDocs() {

            if (!this._eventsDocs) {

                this._eventsDocs = new phasereditor2d.ide.core.PhaserDocs(
                    resources.ResourcesPlugin.getInstance(),
                    "phasereditor2d.scene/docs/events.json");
            }

            return this._eventsDocs;
        }

        getPhaserDocs() {

            if (!this._docs) {

                this._docs = new phasereditor2d.ide.core.PhaserDocs(
                    resources.ResourcesPlugin.getInstance(),
                    "phasereditor2d.scene/docs/phaser.json");
            }

            return this._docs;
        }

        async started(): Promise<void> {

            this._sceneFinder.registerStorageListener();
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            this._sceneFinder = new core.json.SceneFinder();

            this.registerAnimationsPreviewDialogInAssetPack();

            // migrations

            reg.addExtension(new core.migrations.OriginMigration_v2_to_v3());
            reg.addExtension(new core.migrations.UnlockPositionMigration_v1_to_v2());
            reg.addExtension(new core.migrations.TextAlignMigration());

            ui.sceneobjects.ScriptNodeCodeResources.getInstance().registerCommands(
                "phasereditor.scene.ScriptNodeCategory", "ScriptNode", reg);

            // preload project

            reg.addExtension(this._sceneFinder.getProjectPreloader());

            // content type resolvers

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new core.SceneContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new colibri.core.ContentTypeResolverByExtension(
                        core.CONTENT_TYPE_USER_COMPONENTS + "Resolver",
                        [
                            ["components", core.CONTENT_TYPE_USER_COMPONENTS]
                        ])
                    ])
            )

            // content type renderer

            reg.addExtension(
                new files.ui.viewers.SimpleContentTypeCellRendererExtension(
                    core.CONTENT_TYPE_SCENE,
                    new ui.viewers.SceneFileCellRenderer()
                )
            );

            reg.addExtension(
                colibri.ui.ide.ContentTypeIconExtension.withPluginIcons(resources.ResourcesPlugin.getInstance(), [
                    {
                        iconName: resources.ICON_USER_COMPONENT,
                        contentType: core.CONTENT_TYPE_USER_COMPONENTS
                    }
                ]));

            // loader updates

            reg.addExtension(
                new ui.sceneobjects.ImageLoaderExtension(),
                new ui.sceneobjects.BitmapFontLoaderUpdater(),
                new ui.sceneobjects.TilemapLoaderUpdater(),
                new ui.sceneobjects.SpineLoaderUpdater()
            );

            // outline extensions

            reg.addExtension(
                new ui.sceneobjects.TilemapOutlineExtension()
            );

            // commands

            reg.addExtension(
                new ide.commands.CommandExtension(m => ui.editor.commands.SceneEditorCommands.registerCommands(m)));

            reg.addExtension(
                new ide.commands.CommandExtension(m => ui.editor.usercomponent.UserComponentsEditor.registerCommands(m)));


            // compile project

            reg.addExtension(
                new ui.editor.usercomponent.UserComponentCompileAllExtension(),
                new core.code.SceneCompileAllExtension());

            // editors

            reg.addExtension(
                new ide.EditorExtension([
                    ui.editor.SceneEditor.getFactory(),
                    ui.editor.usercomponent.UserComponentsEditor.getFactory()
                ]));

            // new file wizards

            reg.addExtension(
                new ui.dialogs.NewSceneFileDialogExtension(),
                new ui.dialogs.NewPrefabFileDialogExtension(),
                new ui.dialogs.NewUserComponentsFileDialogExtension()
            );

            // file properties

            reg.addExtension(new files.ui.views.FilePropertySectionExtension(
                page => new ui.SceneFileSection(page),
                page => new ui.ManySceneFileSection(page)
            ));

            // scene game object extensions

            reg.addExtension(
                ui.sceneobjects.ImageExtension.getInstance(),
                ui.sceneobjects.SpriteExtension.getInstance(),
                ui.sceneobjects.TileSpriteExtension.getInstance(),
                ui.sceneobjects.NineSliceExtension.getInstance(),
                ui.sceneobjects.ThreeSliceExtension.getInstance(),
                ui.sceneobjects.TextExtension.getInstance(),
                ui.sceneobjects.BitmapTextExtension.getInstance(),
                ui.sceneobjects.ContainerExtension.getInstance(),
                ui.sceneobjects.LayerExtension.getInstance(),
                ui.sceneobjects.TilemapLayerExtension.getInstance(),
                ui.sceneobjects.RectangleExtension.getInstance(),
                ui.sceneobjects.EllipseExtension.getInstance(),
                ui.sceneobjects.TriangleExtension.getInstance(),
                ui.sceneobjects.PolygonExtension.getInstance(),
                ui.sceneobjects.ArcadeImageExtension.getInstance(),
                ui.sceneobjects.ArcadeSpriteExtension.getInstance(),
                ui.sceneobjects.ColliderExtension.getInstance(),
                ui.sceneobjects.KeyboardKeyExtension.getInstance(),
                ui.sceneobjects.ScriptNodeExtension.getInstance(),
                ui.sceneobjects.SpineExtension.getInstance(),
                ui.sceneobjects.FXGlowExtension.getInstance(),
                ui.sceneobjects.FXShadowExtension.getInstance(),
            );

            // scene plain object extensions

            reg.addExtension(
                ui.sceneobjects.TilemapExtension.getInstance()
            );

            reg.addExtension(
                new ui.codesnippets.CreateFromAsepriteCodeSnippetExtension()
            );

            // align extensions

            reg.addExtension(...ui.editor.layout.DefaultLayoutExtensions.ALL);

            // property sections

            reg.addExtension(new ui.editor.properties.SceneEditorPropertySectionExtension(
                page => new ui.sceneobjects.GameObjectVariableSection(page),
                page => new ui.sceneobjects.PrefabObjectVariableSection(page),
                page => new ui.sceneobjects.NestedPrefabObjectVariableSection(page)
            ));

            // dynamic component sections

            reg.addExtension(new ui.editor.properties.DynamicUserSectionExtension());

            // more property sections

            reg.addExtension(new ui.editor.properties.SceneEditorPropertySectionExtension(
                page => new ui.sceneobjects.ListVariableSection(page),
                page => new ui.sceneobjects.GameObjectListSection(page),
                page => new ui.sceneobjects.ChildrenSection(page),
                page => new ui.sceneobjects.TransformSection(page),
                page => new ui.sceneobjects.OriginSection(page),
                page => new ui.sceneobjects.FlipSection(page),
                page => new ui.sceneobjects.VisibleSection(page),
                page => new ui.sceneobjects.AlphaSection(page),
                page => new ui.sceneobjects.AlphaSingleSection(page),
                page => new ui.sceneobjects.TintSection(page),
                page => new ui.sceneobjects.TintSingleSection(page),
                page => new ui.sceneobjects.SizeSection(page),
                page => new ui.sceneobjects.ShadersSection(page),
                page => new ui.sceneobjects.TileSpriteSection(page),
                page => new ui.sceneobjects.NineSliceSection(page),
                page => new ui.sceneobjects.ThreeSliceSection(page),
                page => new ui.sceneobjects.HitAreaSection(page),
                page => new ui.sceneobjects.RectangleHitAreaSection(page),
                page => new ui.sceneobjects.CircleHitAreaSection(page),
                page => new ui.sceneobjects.EllipseHitAreaSection(page),
                page => new ui.sceneobjects.PolygonHitAreaSection(page),
                page => new ui.sceneobjects.PixelPerfectHitAreaSection(page),
                page => new ui.sceneobjects.ArcadeBodySection(page),
                page => new ui.sceneobjects.ArcadeGeometrySection(page),
                page => new ui.sceneobjects.ArcadeBodyMovementSection(page),
                page => new ui.sceneobjects.ArcadeBodyCollisionSection(page),
                page => new ui.sceneobjects.SpriteAnimationSection(page),
                page => new ui.sceneobjects.SpriteAnimationConfigSection(page),
                page => new ui.sceneobjects.TextContentSection(page),
                page => new ui.sceneobjects.TextSection(page),
                page => new ui.sceneobjects.BitmapTextSection(page),
                page => new ui.sceneobjects.ObjectListItemSection(page),
                page => new ui.sceneobjects.ScenePlainObjectVariableSection(page),
                page => new ui.sceneobjects.TilemapSection(page),
                page => new ui.sceneobjects.TilesetSection(page),
                page => new ui.sceneobjects.TilesetPreviewSection(page),
                page => new ui.sceneobjects.TilemapLayerSection(page),
                page => new ui.sceneobjects.ShapeSection(page),
                page => new ui.sceneobjects.EllipseSection(page),
                page => new ui.sceneobjects.TriangleSection(page),
                page => new ui.sceneobjects.PolygonSection(page),
                page => new ui.sceneobjects.ColliderSection(page),
                page => new ui.sceneobjects.KeyboardKeySection(page),
                page => new ui.sceneobjects.TextureSection(page),
                page => new ui.sceneobjects.FXObjectSection(page),
                page => new ui.sceneobjects.FXGlowSection(page),
                page => new ui.sceneobjects.FXShadowSection(page),
                page => new ui.sceneobjects.SpineSection(page),
                page => new ui.sceneobjects.SpineBoundsProviderSection(page),
                page => new ui.sceneobjects.SpineAnimationSection(page),
                page => new ui.codesnippets.CreateFromAsepriteCodeSnippetSection(page),
            ));

            // scene tools

            reg.addExtension(new ui.editor.tools.SceneToolExtension(
                new ui.sceneobjects.TranslateTool(),
                new ui.sceneobjects.RotateTool(),
                new ui.sceneobjects.ScaleTool(),
                new ui.sceneobjects.OriginTool(),
                new ui.sceneobjects.SizeTool(),
                new ui.sceneobjects.EditHitAreaTool(),
                new ui.sceneobjects.ArcadeBodyTool(),
                new ui.sceneobjects.SliceTool(),
                new ui.sceneobjects.PolygonTool(),
                new ui.sceneobjects.SelectionRegionTool(),
                new ui.sceneobjects.PanTool()
            ));

            // files view sections

            reg.addExtension(new phasereditor2d.files.ui.views.ContentTypeSectionExtension(
                {
                    section: phasereditor2d.files.ui.views.TAB_SECTION_DESIGN,
                    contentType: core.CONTENT_TYPE_SCENE
                },
                {
                    section: phasereditor2d.files.ui.views.TAB_SECTION_DESIGN,
                    contentType: core.CONTENT_TYPE_USER_COMPONENTS
                }
            ));

            // asset pack renderer extension

            reg.addExtension(new ui.sceneobjects.SpineAssetPackCellRendererExtension());

            // asset pack preview extension

            reg.addExtension(new pack.ui.AssetPackPreviewPropertyProviderExtension(
                page => new ui.sceneobjects.SpineSkeletonDataSection(page),
                page => new ui.sceneobjects.SpineSkinItemPreviewSection(page),
                page => new ui.sceneobjects.SpineAssetPreviewSection(page)
            ));
        }

        private registerAnimationsPreviewDialogInAssetPack() {

            pack.ui.properties.AnimationsPreviewSection.openPreviewDialog = elem => {

                const dlg = new ui.sceneobjects.AnimationPreviewDialog(elem.getParent(), {
                    key: elem.getKey()
                });

                dlg.create();
            };
        }

        async openAnimationInEditor(anim: pack.core.AnimationConfigInPackItem) {
            // nothing, it is injected in the AnimationsPlugin.
        }

        getTools() {
            return colibri.Platform.getExtensions<ui.editor.tools.SceneToolExtension>
                (ui.editor.tools.SceneToolExtension.POINT_ID)
                .flatMap(ext => ext.getTools());
        }

        getTool(toolId: string) {
            return this.getTools().find(tool => tool.getId() === toolId);
        }

        getDefaultSceneSettings() {

            const settings = new core.json.SceneSettings();

            try {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const files = [...finder.getSceneFiles()];

                files.sort((a, b) => b.getModTime() - a.getModTime());

                if (files.length > 0) {

                    const file = files[0];

                    settings.readJSON(finder.getSceneData(file).settings);
                }

            } catch (e) {

                console.error(e);
            }

            return settings;
        }

        getUserPropertyTypes() {

            // TODO: we should do this via extension
            return [
                new ui.sceneobjects.NumberPropertyType(),
                new ui.sceneobjects.StringPropertyType(),
                new ui.sceneobjects.BooleanPropertyType(),
                new ui.sceneobjects.ColorPropertyType(),
                new ui.sceneobjects.KeyCodePropertyType(),
                new ui.sceneobjects.ExpressionPropertyType(),
                new ui.sceneobjects.OptionPropertyType(),
                new ui.sceneobjects.ObjectVarPropertyType(),
                new ui.sceneobjects.ObjectConstructorPropertyType(),
                new ui.sceneobjects.EventPropertyType(),
                new ui.sceneobjects.TextureConfigPropertyType(),
                new ui.sceneobjects.AnimationKeyPropertyType(),
                new ui.sceneobjects.AudioKeyPropertyType(),
                new ui.sceneobjects.AssetKeyPropertyType(),
                new ui.sceneobjects.SceneKeyPropertyType(),
                new ui.sceneobjects.SpineSkinNamePropertyType(),
                new ui.sceneobjects.SpineAnimationNamePropertyType()
            ];
        }

        getUserPropertyType(typeId: string) {

            return this.getUserPropertyTypes().find(t => t.getId() === typeId);
        }

        getScriptsLibraryColor() {

            return colibri.ui.controls.Controls.getTheme().dark ? "lightBlue" : "blue";
        }

        getPrefabColor() {

            return colibri.ui.controls.Controls.getTheme().dark ? "lightGreen" : "darkGreen";
        }

        getNestedPrefabColor() {

            return "olive";
        }

        getSceneFinder() {

            return this._sceneFinder;
        }

        isSceneContentType(file: colibri.core.io.FilePath) {

            return !file.isFolder() && colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file) === core.CONTENT_TYPE_SCENE;
        }

        getCodeSnippetExtensions() {

            return colibri.Platform
                .getExtensions<ui.codesnippets.CodeSnippetExtension>(ui.codesnippets.CodeSnippetExtension.POINT_ID);
        }

        getCodeSnippetExtensionByType(type: string) {

            return this.getCodeSnippetExtensions().find(e => e.getType() === type);
        }

        getPlainObjectExtensions() {

            return colibri.Platform
                .getExtensions<ui.sceneobjects.ScenePlainObjectExtension>(ui.sceneobjects.ScenePlainObjectExtension.POINT_ID);
        }

        getPlainObjectCategories() {

            return this.getPlainObjectExtensions().map(e => e.getCategory());
        }

        getPlainObjectExtensionByObjectType(type: string) {

            return this.getPlainObjectExtensions().find(ext => ext.getTypeName() === type);
        }

        getGameObjectExtensions(): ui.sceneobjects.SceneGameObjectExtension[] {

            return colibri.Platform
                .getExtensions<ui.sceneobjects.SceneGameObjectExtension>(ui.sceneobjects.SceneGameObjectExtension.POINT_ID);
        }

        getGameObjectExtensionByObjectType(type: string) {

            return this.getGameObjectExtensions().find(ext => {

                if (ext.getTypeName() === type) {

                    return ext;
                }

                if (ext.getTypeNameAlias().indexOf(type) >= 0) {

                    return ext;
                }
            });
        }

        getSceneEditorOutlineExtensions() {

            return colibri.Platform
                .getExtensions<ui.editor.outline.SceneEditorOutlineExtension>(
                    ui.editor.outline.SceneEditorOutlineExtension.POINT_ID);
        }

        private _fxExtensions: ui.sceneobjects.FXObjectExtension[];

        private _fxTypes: Set<string>;

        isFXType(type: string) {

            this.getFXExtensions();

            return this._fxTypes.has(type);
        }

        getFXExtensions() {

            if (this._fxExtensions) {

                return this._fxExtensions;
            }

            this._fxExtensions = colibri.Platform
                .getExtensions<ui.sceneobjects.FXObjectExtension>(ui.sceneobjects.SceneGameObjectExtension.POINT_ID)
                .filter(e => e instanceof ui.sceneobjects.FXObjectExtension) as ui.sceneobjects.FXObjectExtension[];

            this._fxTypes = new Set(this._fxExtensions.map(e => e.getTypeName()));

            return this._fxExtensions;
        }

        getLayoutExtensions() {

            return colibri.Platform
                .getExtensions<ui.editor.layout.LayoutExtension<any>>(
                    ui.editor.layout.LayoutExtension.POINT_ID);
        }

        getLayoutExtensionsByGroup() {

            const allExtensions = ScenePlugin.getInstance().getLayoutExtensions()
            const groups: string[] = [];

            for (const ext of allExtensions) {

                if (groups.indexOf(ext.getConfig().group) < 0) {

                    groups.push(ext.getConfig().group);
                }
            }

            const result: Array<{ group: string, extensions: ui.editor.layout.LayoutExtension<ui.editor.layout.ILayoutExtensionConfig>[] }> = [];

            for (const group of groups) {

                const extensions = allExtensions.filter(e => e.getConfig().group === group);
                result.push({ group, extensions });
            }

            return result;
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

        getLoaderUpdaters() {

            const exts = colibri.Platform
                .getExtensions<ui.sceneobjects.LoaderUpdaterExtension>(ui.sceneobjects.LoaderUpdaterExtension.POINT_ID);

            return exts;
        }

        async compileAll() {

            const files = this._sceneFinder.getSceneFiles();

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

        private _showIncompatibilityMessage = true;

        runSceneDataMigrations(sceneData: core.json.ISceneData) {

            // check scene data min supported version

            if (this._showIncompatibilityMessage) {

                const version = sceneData.meta.version;

                if (version) {

                    if (version > ui.Scene.CURRENT_VERSION) {

                        alert(`
                        The project contains scene files created by newer versions of the editor.
                        You should update the editor.
                        `);
                    }
                }

                this._showIncompatibilityMessage = false;
            }

            // check migrations

            const migrations = colibri.Platform.getExtensionRegistry()
                .getExtensions<ui.SceneDataMigrationExtension>(ui.SceneDataMigrationExtension.POINT_ID);

            for (const migration of migrations) {

                try {

                    migration.migrate(sceneData);

                } catch (e) {

                    console.error(e);
                }
            }
        }

        getSpineThumbnailCache() {

            if (!this._spineThumbnailCache) {

                this._spineThumbnailCache = new ui.SpineThumbnailCache();
            }

            return this._spineThumbnailCache;
        }

        buildSpineSkinThumbnailImage(skinItem: pack.core.SpineSkinItem) {

            const { spineAsset, spineAtlasAsset, skinName } = skinItem;

            const data: core.json.ISceneData = {
                "id": "ad829e9b-d82c-466a-a31c-a2789656ef84",
                "sceneType": core.json.SceneType.SCENE,
                "settings": {},
                "displayList": [
                    {
                        "type": "SpineGameObject",
                        "id": "spine-thumbnail-id",
                        "label": "spine",
                        "dataKey": spineAsset.getKey(),
                        "atlasKey": spineAtlasAsset.getKey(),
                        "skinName": skinName,
                        "bpType": ui.sceneobjects.BoundsProviderType.SKINS_AND_ANIMATION_TYPE,
                        "bpSkin": ui.sceneobjects.BoundsProviderSkin.CURRENT_SKIN,
                        "x": 0,
                        "y": 0
                    } as any
                ],
                "plainObjects": [],
                "meta": {
                    "version": 4
                } as any
            };

            return new ui.SceneThumbnailImage(data);
        }
    }

    colibri.Platform.addPlugin(ScenePlugin.getInstance());
}