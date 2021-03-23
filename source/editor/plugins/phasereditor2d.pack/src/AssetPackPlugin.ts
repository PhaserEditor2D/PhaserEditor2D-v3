/// <reference path="./core/contentTypes/AnimationsContentTypeResolver.ts" />

namespace phasereditor2d.pack {

    import ide = colibri.ui.ide;

    export const ICON_ASSET_PACK = "asset-pack";
    export const ICON_ANIMATIONS = "animations";
    export const ICON_TILEMAP = "tilemap";
    export const ICON_TILEMAP_LAYER = "tilemap-layer";

    export const CAT_ASSET_PACK = "phasereditor2d.pack.ui.editor.category";
    export const CMD_ASSET_PACK_EDITOR_ADD_FILE = "phasereditor2d.pack.ui.editor.AddFile";
    export const CMD_TOGGLE_SIMPLE_RENDERING_OF_TEXTURE_ATLAS = "phasereditor2d.pack.ui.editor.ToggleSimpleRenderingOfTextureAtlas";

    export class AssetPackPlugin extends colibri.Plugin {

        private static _instance = new AssetPackPlugin();

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.pack");
        }

        async started() {

            colibri.Platform.getWorkbench().eventBeforeOpenProject.addListener(() => {

                core.ImageFrameContainerAssetPackItem.resetCache();
            });
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // icons loader

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_ASSET_PACK,
                    ICON_ANIMATIONS,
                    ICON_TILEMAP,
                    ICON_TILEMAP_LAYER
                ])
            );

            // content type resolvers

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AssetPackContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AtlasContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.MultiatlasContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AtlasXMLContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.UnityAtlasContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AnimationsContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.BitmapFontContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.TilemapImpactContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.TilemapTiledJSONContentTypeResolver()],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AudioSpriteContentTypeResolver()],
                    5
                ));

            // content type icons

            reg.addExtension(
                ide.ContentTypeIconExtension.withPluginIcons(this, [
                    {
                        iconName: ICON_ASSET_PACK,
                        contentType: core.contentTypes.CONTENT_TYPE_ASSET_PACK
                    },
                    {
                        iconName: ICON_ANIMATIONS,
                        contentType: core.contentTypes.CONTENT_TYPE_ANIMATIONS
                    },
                    {
                        iconName: ICON_TILEMAP,
                        contentType: core.contentTypes.CONTENT_TYPE_TILEMAP_TILED_JSON
                    },
                    {
                        plugin: webContentTypes.WebContentTypesPlugin.getInstance(),
                        iconName: webContentTypes.ICON_FILE_FONT,
                        contentType: core.contentTypes.CONTENT_TYPE_BITMAP_FONT
                    }
                ]));

            // plugin resources loader

            reg.addExtension(new ide.PluginResourceLoaderExtension(async () => {

                await AssetPackPlugin.getInstance().getPhaserDocs().preload();
            }));

            // project resources preloader

            reg.addExtension(new core.AssetPackPreloadProjectExtension())

            // editors

            reg.addExtension(
                new ide.EditorExtension([
                    ui.editor.AssetPackEditor.getFactory()
                ]));

            // commands
            reg.addExtension(
                new ide.commands.CommandExtension(manager => {

                    // category

                    manager.addCategory({
                        id: CAT_ASSET_PACK,
                        name: "Asset Pack"
                    });

                    // delete

                    manager.addHandlerHelper(ide.actions.CMD_DELETE,

                        args => ui.editor.AssetPackEditor.isEditorScope(args)
                            && args.activeEditor.getSelection().length > 0,

                        args => {
                            const editor = args.activeEditor as ui.editor.AssetPackEditor;
                            editor.deleteSelection();
                        });

                    // add file
                    manager.add({
                        command: {
                            id: CMD_ASSET_PACK_EDITOR_ADD_FILE,
                            icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_PLUS),
                            name: "Add File",
                            tooltip: "Add new file configuration",
                            category: CAT_ASSET_PACK
                        },
                        handler: {
                            testFunc: args => ui.editor.AssetPackEditor.isEditorScope(args),
                            executeFunc: args => (args.activeEditor as ui.editor.AssetPackEditor).openAddFileDialog()
                        },
                        keys: {
                            key: "A"
                        }
                    });
                }));

            // new file dialog

            reg.addExtension(
                new ui.dialogs.NewAssetPackFileWizardExtension());

            reg.addExtension(new files.ui.views.FilePropertySectionExtension(
                page => new ui.properties.AddFileToPackFileSection(page)
            ));

            // files view sections

            reg.addExtension(phasereditor2d.files.ui.views.ContentTypeSectionExtension.withSection(
                phasereditor2d.files.ui.views.TAB_SECTION_DESIGN,
                core.contentTypes.CONTENT_TYPE_ASSET_PACK,
                core.contentTypes.CONTENT_TYPE_ANIMATIONS,
                colibri.core.CONTENT_TYPE_PUBLIC_ROOT
            ));

            reg.addExtension(phasereditor2d.files.ui.views.ContentTypeSectionExtension.withSection(
                phasereditor2d.files.ui.views.TAB_SECTION_ASSETS,
                core.contentTypes.CONTENT_TYPE_ASSET_PACK,
                core.contentTypes.CONTENT_TYPE_ANIMATIONS,
                core.contentTypes.CONTENT_TYPE_ATLAS,
                core.contentTypes.CONTENT_TYPE_ATLAS_XML,
                core.contentTypes.CONTENT_TYPE_MULTI_ATLAS,
                core.contentTypes.CONTENT_TYPE_UNITY_ATLAS,
                colibri.core.CONTENT_TYPE_PUBLIC_ROOT
            ));
        }

        private _phaserDocs: phasereditor2d.ide.core.PhaserDocs;

        getPhaserDocs() {
            return this._phaserDocs ?
                this._phaserDocs :
                (this._phaserDocs = new phasereditor2d.ide.core.PhaserDocs(this, "data/phaser-docs.json"));
        }
    }

    colibri.Platform.addPlugin(AssetPackPlugin.getInstance());
}