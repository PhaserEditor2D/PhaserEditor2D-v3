namespace colibri.ui.controls.viewers {

    export class OneCharCellRenderer implements ICellRenderer {

        private _iconSize: boolean;

        constructor(iconSize: boolean) {

            this._iconSize = iconSize;
        }

        renderCell(args: RenderCellArgs): void {

            const label = args.viewer.getLabelProvider().getLabel(args.obj);

            const ctx = args.canvasContext;

            let char = label.trim();

            if (label.length > 0) {

                char = label[0];

                ctx.fillText(char, args.x + args.w / 2, args.y + args.h / 2, args.w);
            }
        }

        cellHeight(args: RenderCellArgs): number {

            return this._iconSize ? controls.ROW_HEIGHT : args.viewer.getCellSize();
        }

        preload(args: PreloadCellArgs): Promise<PreloadResult> {

            return controls.Controls.resolveNothingLoaded();
        }
    }

}