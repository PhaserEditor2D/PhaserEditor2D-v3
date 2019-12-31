namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class ImageFrameContainerIconCellRenderer implements controls.viewers.ICellRenderer {

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const img = this.getFrameImage(args.obj);

            if (img) {
                img.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
            }
        }

        private getFrameImage(obj: any) {

            const packItem = obj as core.AssetPackItem;

            if (packItem instanceof core.ImageFrameContainerAssetPackItem) {

                const frames = packItem.getFrames();

                if (frames.length > 0) {

                    const img = frames[0].getImage();

                    return img;
                }
            }

            return null;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {
            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const img = this.getFrameImage(args.obj);

            if (img) {
                return img.preload();
            }

            return controls.Controls.resolveNothingLoaded();
        }
    }
}