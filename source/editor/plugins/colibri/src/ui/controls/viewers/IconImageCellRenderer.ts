namespace colibri.ui.controls.viewers {

    export class IconImageCellRenderer implements ICellRenderer {
        private _icon: IImage;

        constructor(icon: IImage) {

            this._icon = icon;
        }

        getIcon(obj: any): IImage {

            return this._icon;
        }

        renderCell(args: RenderCellArgs): void {

            let icon = this.getIcon(args.obj);

            if (icon) {

                const x = args.x + (args.w - RENDER_ICON_SIZE) / 2;
                const y = args.y + (args.h - RENDER_ICON_SIZE) / 2;

                const selected = args.viewer.isSelected(args.obj);

                if (selected) {

                    if (icon instanceof IconImage) {

                        icon = icon.getNegativeThemeImage();
                    }
                }

                icon.paint(args.canvasContext, x, y, RENDER_ICON_SIZE, RENDER_ICON_SIZE, false);

            } else {

                DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
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