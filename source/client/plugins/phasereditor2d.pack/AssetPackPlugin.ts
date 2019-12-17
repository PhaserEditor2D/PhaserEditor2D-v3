/// <reference path="./core/contentTypes/AnimationsContentTypeResolver.ts" />

namespace phasereditor2d.pack {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export const ICON_ASSET_PACK = "asset-pack";
    export const ICON_ANIMATIONS = "animations";

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
                new ide.PreloadProjectResourcesExtension(
                    (monitor) => {
                        
                        const finder = new  pack.core.PackFinder();

                        return finder.preload(monitor);
                    }
                )
            );

            // editors

            reg.addExtension(
                new ide.EditorExtension([
                    ui.editor.AssetPackEditor.getFactory()
                ]));

            reg.addExtension(
                new ide.commands.CommandExtension(ui.editor.AssetPackEditor.registerCommands));

            // new file dialog

            reg.addExtension(
                new ui.dialogs.NewAssetPackFileWizardExtension());
        }
    }

    colibri.Platform.addPlugin(AssetPackPlugin.getInstance());
}