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

            const exts = AssetPackPlugin.getInstance().getViewerExtensions();
            
            for(const ext of exts) {

                if (ext.acceptObject(element)) {

                    return ext.getCellRenderer(element);
                }
            }

            if (element instanceof core.AssetPack) {

                return this.getIconRenderer(resources.getIcon(resources.ICON_ASSET_PACK));

            } else if (AssetPackPlugin.getInstance().isAssetPackItemType(element)) {

                return new controls.viewers.IconImageCellRenderer(
                    colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } if (element instanceof io.FilePath) {

                return this._fileRendererProvider.getCellRenderer(element);

            } else if (element instanceof pack.core.AnimationsAssetPackItem) {

                return new viewers.AnimationsItemCellRenderer();

            } else if (element instanceof pack.core.AsepriteAssetPackItem) {

                return new viewers.AsepriteItemCellRenderer();

            } else {

                const extensions = AssetPackPlugin.getInstance().getExtensions();

                for (const ext of extensions) {

                    const renderer = ext.getCellRenderer(element, this._layout);

                    if (renderer) {

                        return renderer;
                    }
                }
            }

            return this.getIconRenderer(ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE));
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