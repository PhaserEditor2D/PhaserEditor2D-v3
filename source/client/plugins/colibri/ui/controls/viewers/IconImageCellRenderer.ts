namespace colibri.ui.controls.viewers {

    export class IconImageCellRenderer implements ICellRenderer {
        private _icon: IImage;

        constructor(icon: IImage) {

            this._icon = icon;
        }

        getIcon(obj : any) : IImage {
            return this._icon;
        }

        renderCell(args: RenderCellArgs): void {

            const icon = this.getIcon(args.obj);

            if (!icon) {

                DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);

            } else {

                const x = args.x + (args.w - ICON_SIZE) / 2;
                const y = args.y + (args.h - ICON_SIZE) / 2;

                icon.paint(args.canvasContext, x, y, ICON_SIZE, ICON_SIZE, false);

            }
        }

        cellHeight(args: RenderCellArgs) {
            return ROW_HEIGHT;
        }

        preload(args: PreloadCellArgs): Promise<PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}