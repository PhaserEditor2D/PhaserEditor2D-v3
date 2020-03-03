namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class BitmapFontAssetCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const img = this.getImage(args.obj);

            if (img) {

                img.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
            }
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const img = this.getImage(args.obj);

            if (img) {

                return img.preload();
            }

            return controls.Controls.resolveNothingLoaded();
        }

        private getImage(item: core.BitmapFontAssetPackItem) {

            const url = item.getData().textureURL;

            const img = core.AssetPackUtils.getImageFromPackUrl(url);

            return img;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }
    }
}