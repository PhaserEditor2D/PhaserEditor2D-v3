namespace colibri.ui.controls.viewers {
    export class EmptyCellRenderer implements ICellRenderer {

        private _variableSize: boolean;

        constructor(variableSize: boolean = true) {
            this._variableSize = variableSize;
        }

        renderCell(args: RenderCellArgs): void {

        }

        cellHeight(args: RenderCellArgs): number {
            return this._variableSize ? args.viewer.getCellSize() : ROW_HEIGHT;
        }

        preload(args : PreloadCellArgs): Promise<PreloadResult> {
            return Controls.resolveNothingLoaded();
        }
    }
}