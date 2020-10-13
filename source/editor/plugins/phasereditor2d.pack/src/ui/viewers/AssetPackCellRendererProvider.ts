namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class AssetPackCellRendererProvider implements controls.viewers.ICellRendererProvider {

        private _layout: "grid" | "tree";
        private _fileRendererProvider: files.ui.viewers.FileCellRendererProvider;

        constructor(layout: "grid" | "tree") {
            this._layout = layout;

            this._fileRendererProvider = new files.ui.viewers.FileCellRendererProvider(layout);
        }

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof core.AssetPack) {

                return this.getIconRenderer(AssetPackPlugin.getInstance().getIcon(ICON_ASSET_PACK));

            } else if (typeof (element) === "string") {

                if (core.TYPES.indexOf(element) >= 0) {

                    return new controls.viewers.IconImageCellRenderer(
                        colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                }

                return this.getScriptUrlCellRenderer(element);

            } if (element instanceof io.FilePath) {

                return this._fileRendererProvider.getCellRenderer(element);

            } else if (element instanceof core.AssetPackItem) {

                const type = element.getType();

                const webPlugin = webContentTypes.WebContentTypesPlugin.getInstance();

                switch (type) {

                    case core.IMAGE_TYPE:
                        return new ImageAssetPackItemCellRenderer();

                    case core.MULTI_ATLAS_TYPE:
                    case core.ATLAS_TYPE:
                    case core.UNITY_ATLAS_TYPE:
                    case core.ATLAS_XML_TYPE: {

                        const simple = AssetPackPlugin.getInstance().isSimpleRenderingOfTextureAtlas();

                        if (this._layout === "grid" && !simple) {

                            return new controls.viewers.FolderCellRenderer(4);
                        }

                        return new viewers.ImageFrameContainerIconCellRenderer();
                    }

                    case core.SPRITESHEET_TYPE:
                        return new viewers.ImageFrameContainerIconCellRenderer();

                    case core.AUDIO_TYPE:
                        return this.getIconRenderer(webPlugin.getIcon(webContentTypes.ICON_FILE_SOUND));

                    case core.SCRIPT_TYPE:
                    case core.SCENE_FILE_TYPE:

                        const url = element.getData().url;

                        return this.getScriptUrlCellRenderer(url);

                    case core.SCRIPTS_TYPE:

                        return new controls.viewers.FolderCellRenderer();

                    case core.SCENE_PLUGIN_TYPE:
                    case core.PLUGIN_TYPE:
                    case core.CSS_TYPE:
                    case core.GLSL_TYPE:
                    case core.XML_TYPE:
                    case core.HTML_TYPE:
                    case core.JSON_TYPE:
                        return this.getIconRenderer(webPlugin.getIcon(webContentTypes.ICON_FILE_SCRIPT));

                    case core.TEXT_TYPE:
                        return this.getIconRenderer(webPlugin.getIcon(webContentTypes.ICON_FILE_TEXT));

                    case core.HTML_TEXTURE_TYPE:
                        return this.getIconRenderer(webPlugin.getIcon(webContentTypes.ICON_FILE_IMAGE));

                    case core.BITMAP_FONT_TYPE:
                        return new BitmapFontAssetCellRenderer();

                    case core.VIDEO_TYPE:
                        return this.getIconRenderer(webPlugin.getIcon(webContentTypes.ICON_FILE_VIDEO));

                    case core.ANIMATION_TYPE:
                        return this.getIconRenderer(AssetPackPlugin.getInstance().getIcon(ICON_ANIMATIONS));

                    default:
                        break;
                }

            } else if (element instanceof controls.ImageFrame) {

                return new controls.viewers.ImageCellRenderer();

            } else if (element instanceof core.AnimationConfigInPackItem) {

                return this.getIconRenderer(AssetPackPlugin.getInstance().getIcon(ICON_ANIMATIONS));
            }

            return this.getIconRenderer(ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE));
        }

        private getScriptUrlCellRenderer(url: any) {

            const file = core.AssetPackUtils.getFileFromPackUrl(url);

            if (file) {

                const sceneFile = file.getParent().getFile(file.getNameWithoutExtension() + ".scene");

                if (sceneFile) {

                    return new SceneScriptCellRenderer(this._layout);
                }
            }

            return this.getIconRenderer(webContentTypes.WebContentTypesPlugin
                .getInstance().getIcon(webContentTypes.ICON_FILE_SCRIPT));
        }

        private getIconRenderer(icon: controls.IImage) {

            if (this._layout === "grid") {

                return new controls.viewers.IconGridCellRenderer(icon);
            }

            return new controls.viewers.IconImageCellRenderer(icon);
        }

        preload(element: any): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }

}