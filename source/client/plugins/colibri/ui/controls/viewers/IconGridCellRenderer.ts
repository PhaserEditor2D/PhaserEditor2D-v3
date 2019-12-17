/// <reference path="./IconImageCellRenderer.ts" />

namespace colibri.ui.controls.viewers {

    export class IconGridCellRenderer implements ICellRenderer {

        private _icon: IImage;

        constructor(icon: IImage) {
            this._icon = icon;
        }

        renderCell(args: RenderCellArgs): void {

            if (!this._icon) {

                DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);

            } else {

                const x2 = (args.w - controls.ICON_SIZE) / 2;

                const y2 = (args.h - controls.ICON_SIZE) / 2;

                this._icon.paint(args.canvasContext, args.x + x2, args.y + y2, controls.ICON_SIZE, controls.ICON_SIZE, false);

            }

            const ctx = args.canvasContext;

            ctx.save();

            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = Controls.getTheme().viewerForeground;

            ctx.strokeRect(args.x, args.y, args.w, args.h);

            ctx.restore();
        }

        cellHeight(args: RenderCellArgs): number {
            return args.viewer.getCellSize();
        }

        preload(args: PreloadCellArgs): Promise<any> {
            return this._icon.preload();
        }

    }

}