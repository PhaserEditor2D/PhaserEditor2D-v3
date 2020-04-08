/// <reference path="./core/contentTypes/AnimationsContentTypeResolver.ts" />

namespace phasereditor2d.pack {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export const ICON_ASSET_PACK = "asset-pack";
    export const ICON_ANIMATIONS = "animations";

    export const CAT_ASSET_PACK_EDITOR = "phasereditor2d.pack.ui.editor.category";
    export const CMD_ASSET_PACK_EDITOR_ADD_FILE = "phasereditor2d.pack.ui.editor.AddFile";

    export class AssetPackPlugin extends colibri.Plugin {

        private static _instance = new AssetPackPlugin();

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.pack");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // icons loader

            reg.addExtension(
                ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_ASSET_PACK,
                    ICON_ANIMATIONS
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
                        plugin: webContentTypes.WebContentTypesPlugin.getInstance(),
                        iconName: webContentTypes.ICON_FILE_FONT,
                        contentType: core.contentTypes.CONTENT_TYPE_BITMAP_FONT
                    }
                ]));

            // project resources preloader

            reg.addExtension(
                new core.AssetPackPreloadProjectExtension(),

                // tslint:disable-next-line:new-parens
                new (class extends ide.PreloadProjectResourcesExtension {

                    async computeTotal() {
                        return 0;
                    }

                    async preload() {
                        return AssetPackPlugin.getInstance().getPhaserDocs().preload();
                    }
                })
            );

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
                        id: CAT_ASSET_PACK_EDITOR,
                        name: "Asset Pack File"
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
                            category: CAT_ASSET_PACK_EDITOR
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