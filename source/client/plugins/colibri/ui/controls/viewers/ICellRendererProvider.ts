/// <reference path="../Controls.ts" />

namespace colibri.ui.controls.viewers {

    export interface ICellRendererProvider {

        getCellRenderer(element: any): ICellRenderer;

        preload(args: PreloadCellArgs): Promise<PreloadResult>;
    }
}