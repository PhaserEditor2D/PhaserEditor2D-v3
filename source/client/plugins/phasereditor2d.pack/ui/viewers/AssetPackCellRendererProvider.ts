namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class AssetPackCellRendererProvider implements controls.viewers.ICellRendererProvider {

        private _layout: "grid" | "tree";

        constructor(layout: "grid" | "tree") {
            this._layout = layout;
        }

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (typeof (element) === "string") {

                return new controls.viewers.IconImageCellRenderer(ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_FOLDER));

            } else if (element instanceof core.AssetPackItem) {

                const type = element.getType();

                const filesPlugin = files.FilesPlugin.getInstance();

                switch (type) {

                    case core.IMAGE_TYPE:
                        return new ImageAssetPackItemCellRenderer();

                    case core.MULTI_ATLAS_TYPE:
                    case core.ATLAS_TYPE:
                    case core.UNITY_ATLAS_TYPE:
                    case core.ATLAS_XML_TYPE: {
                        
                        if (this._layout === "grid") {
                            return new controls.viewers.FolderCellRenderer();
                        }

                        return new viewers.ImageFrameContainerIconCellRenderer();
                    }

                    case core.SPRITESHEET_TYPE:
                        return new viewers.ImageFrameContainerIconCellRenderer();

                    case core.AUDIO_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_SOUND));

                    case core.SCRIPT_TYPE:
                    case core.SCENE_FILE_TYPE:
                    case core.SCENE_PLUGIN_TYPE:
                    case core.PLUGIN_TYPE:
                    case core.CSS_TYPE:
                    case core.GLSL_TYPE:
                    case core.XML_TYPE:
                    case core.HTML_TYPE:
                    case core.JSON_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_SCRIPT));

                    case core.TEXT_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_TEXT));

                    case core.HTML_TEXTURE_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_IMAGE));

                    case core.BITMAP_FONT_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_FONT));

                    case core.VIDEO_TYPE:
                        return this.getIconRenderer(filesPlugin.getIcon(webContentTypes.ICON_FILE_VIDEO));

                    default:
                        break;
                }

            } else if (element instanceof controls.ImageFrame) {

                return new controls.viewers.ImageCellRenderer();

            }

            return this.getIconRenderer(ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_FILE));
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