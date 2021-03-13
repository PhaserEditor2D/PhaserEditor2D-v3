namespace colibri.ui.controls.viewers {

    export interface ICellRenderer {

        renderCell(args: RenderCellArgs): void;

        cellHeight(args: RenderCellArgs): number;

        preload(args: PreloadCellArgs): Promise<PreloadResult>;

        layout?:"square"|"full-width";
    }
}