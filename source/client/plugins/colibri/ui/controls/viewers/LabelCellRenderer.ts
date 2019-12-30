namespace colibri.ui.controls.viewers {

    export abstract class LabelCellRenderer implements ICellRenderer {

        renderCell(args: RenderCellArgs): void {

            const img = this.getImage(args.obj);

            const x = args.x;

            const ctx = args.canvasContext;

            if (img) {
                img.paint(ctx, x, args.y, ICON_SIZE, ICON_SIZE, false);
            }
        }

        abstract getImage(obj: any): controls.IImage;

        cellHeight(args: RenderCellArgs): number {
            return controls.ROW_HEIGHT;
        }

        preload(args: PreloadCellArgs): Promise<PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }

}