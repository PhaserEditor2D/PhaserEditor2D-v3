namespace colibri.ui.controls.viewers {

    export class EmptyCellRenderer implements ICellRenderer {

        static readonly instance = new EmptyCellRenderer(false);
        private _variableSize: boolean;

        constructor(variableSize: boolean = true) {
            
            this._variableSize = variableSize;
        }

        isVariableSize() {

            return this._variableSize;
        }

        renderCell(args: RenderCellArgs): void {
            // nothing
        }

        cellHeight(args: RenderCellArgs): number {
            return this._variableSize ? args.viewer.getCellSize() : ROW_HEIGHT;
        }

        preload(args: PreloadCellArgs): Promise<PreloadResult> {
            return Controls.resolveNothingLoaded();
        }
    }
}