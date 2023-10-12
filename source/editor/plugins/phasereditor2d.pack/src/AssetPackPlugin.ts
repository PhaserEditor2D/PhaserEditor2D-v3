/// <reference path="./core/contentTypes/AnimationsContentTypeResolver.ts" />

namespace phasereditor2d.pack {

    import ide = colibri.ui.ide;

    export const CAT_ASSET_PACK = "phasereditor2d.pack.ui.editor.category";
    export const CMD_ASSET_PACK_EDITOR_ADD_FILE = "phasereditor2d.pack.ui.editor.AddFile";
    export const CMD_TOGGLE_SIMPLE_RENDERING_OF_TEXTURE_ATLAS = "phasereditor2d.pack.ui.editor.ToggleSimpleRenderingOfTextureAtlas";

    export class AssetPackPlugin extends colibri.Plugin {

        private static _instance = new AssetPackPlugin();
        private _extensions: ui.AssetPackExtension[];
        private _assetPackItemTypes: string[];
        private _assetPackItemTypeSet: Set<string>;
        private _assetPackItemTypeDisplayNameMap: Map<string, string>;
        private _assetPackExtensionByTypeMap: Map<string, ui.AssetPackExtension>;
        private _viewerExtensions: ui.AssetPackViewerExtension[];
        private _previewPropertyProviderExtension: ui.AssetPackPreviewPropertyProviderExtension[];

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.pack");
        }

        getExtensions() {

            return this._extensions ??
                (this._extensions = colibri.Platform.getExtensions(ui.AssetPackExtension.POINT_ID));
        }

        getAssetPackItemTypeDisplayName(type: string) {

            return this._assetPackItemTypeDisplayNameMap.get(type);
        }

        getAssetPackItemTypes() {

            return this._assetPackItemTypes;
        }

        isAssetPackItemType(type: string) {

            return this._assetPackItemTypeSet.has(type);
        }

        getExtensionByType(assetPackItemType: string) {

            return this._assetPackExtensionByTypeMap.get(assetPackItemType);
        }

        getViewerExtensions() {

            if (!this._viewerExtensions) {

                this._viewerExtensions = colibri.Platform
                    .getExtensions(ui.AssetPackViewerExtension.POINT_ID);
            }

            return this._viewerExtensions;
        }

        getPreviewPropertyProviderExtensions() {

            if (!this._previewPropertyProviderExtension) {

                this._previewPropertyProviderExtension = colibri.Platform
                    .getExtensions(ui.AssetPackPreviewPropertyProviderExtension.POINT_ID);
            }

            return this._previewPropertyProviderExtension;
        }

        async starting(): Promise<void> {

            await super.starting();

            this._assetPackItemTypes = [];
            this._assetPackItemTypeSet = new Set();
            this._assetPackItemTypeDisplayNameMap = new Map();
            this._assetPackExtensionByTypeMap = new Map();

            for (const ext of this.getExtensions()) {

                for (const { type, displayName } of ext.getAssetPackItemTypes()) {

                    this._assetPackItemTypes.push(type);
                    this._assetPackItemTypeDisplayNameMap.set(type, displayName);
                    this._assetPackItemTypeSet.add(type);
                    this._assetPackExtensionByTypeMap.set(type, ext);
                }
            }
        }

        async started() {

            colibri.Platform.getWorkbench().eventBeforeOpenProject.addListener(() => {

                core.ImageFrameContainerAssetPackItem.resetCache();
            });
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // asset pack extensions

            reg.addExtension(new ui.DefaultAssetPackExtension());

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
                    [new pack.core.contentTypes.AsepriteContentTypeResolver()],
                    4
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
                    [
                        new pack.core.contentTypes.SpineJsonContentTypeResolver(),
                        new pack.core.contentTypes.SpineBinaryContentTypeResolver(),
                        new pack.core.contentTypes.SpineAtlasContentTypeResolver()
                    ],
                    5
                ));

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new pack.core.contentTypes.AudioSpriteContentTypeResolver()],
                    5
                ));

            // content type icons

            reg.addExtension(
                ide.ContentTypeIconExtension.withPluginIcons(resources.ResourcesPlugin.getInstance(), [
                    {
                        iconName: resources.ICON_ASSET_PACK,
                        contentType: core.contentTypes.CONTENT_TYPE_ASSET_PACK
                    },
                    {
                        iconName: resources.ICON_ANIMATIONS,
                        contentType: core.contentTypes.CONTENT_TYPE_ANIMATIONS
                    },
                    {
                        iconName: resources.ICON_ASEPRITE,
                        contentType: core.contentTypes.CONTENT_TYPE_ASEPRITE
                    },
                    {
                        iconName: resources.ICON_TILEMAP,
                        contentType: core.contentTypes.CONTENT_TYPE_TILEMAP_TILED_JSON
                    },
                    {
                        iconName: resources.ICON_FILE_FONT,
                        contentType: core.contentTypes.CONTENT_TYPE_BITMAP_FONT
                    },
                    {
                        iconName: resources.ICON_SPINE,
                        contentType: core.contentTypes.CONTENT_TYPE_SPINE_JSON
                    },
                    {
                        iconName: resources.ICON_SPINE,
                        contentType: core.contentTypes.CONTENT_TYPE_SPINE_BINARY
                    },
                    {
                        iconName: resources.ICON_SPINE,
                        contentType: core.contentTypes.CONTENT_TYPE_SPINE_ATLAS
                    }
                ]));

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
                            name: "Import File",
                            tooltip: "Import a new file into the project by adding an entry for it to this Asset Pack.",
                            category: CAT_ASSET_PACK
                        },
                        handler: {
                            testFunc: args => ui.editor.AssetPackEditor.isEditorScope(args),
                            executeFunc: args => (args.activeEditor as ui.editor.AssetPackEditor).openAddFileDialog()
                        },
                        keys: {
                            key: "KeyA"
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

            if (!this._phaserDocs) {

                this._phaserDocs = this._phaserDocs = new phasereditor2d.ide.core.PhaserDocs(
                    resources.ResourcesPlugin.getInstance()
                    , "phasereditor2d.pack/docs/phaser-docs.json");
            }

            return this._phaserDocs;
        }
    }

    colibri.Platform.addPlugin(AssetPackPlugin.getInstance());
}