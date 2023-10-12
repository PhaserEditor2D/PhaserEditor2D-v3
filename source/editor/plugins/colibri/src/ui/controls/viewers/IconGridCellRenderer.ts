/// <reference path="./IconImageCellRenderer.ts" />

namespace colibri.ui.controls.viewers {

    export class IconGridCellRenderer implements ICellRenderer {

        private _icon: IImage;

        constructor(icon: IImage) {
            this._icon = icon;
        }

        renderCell(args: RenderCellArgs): void {

            let icon = this._icon;

            if (icon) {

                const x2 = (args.w - controls.RENDER_ICON_SIZE) / 2;

                const y2 = (args.h - controls.RENDER_ICON_SIZE) / 2;

                const selected = args.viewer.isSelected(args.obj);

                if (selected) {

                    if (icon instanceof IconImage) {

                        icon = icon.getNegativeThemeImage();
                    }
                }

                icon.paint(
                    args.canvasContext, args.x + x2, args.y + y2,
                    controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE, false);

            } else {

                DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
            }
        }

        cellHeight(args: RenderCellArgs): number {
            
            return args.viewer.getCellSize();
        }

        preload(args: PreloadCellArgs): Promise<any> {

            return this._icon.preload();
        }
    }
}