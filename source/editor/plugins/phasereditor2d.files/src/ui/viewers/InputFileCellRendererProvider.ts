namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;

    export class InputFileCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {
            return new controls.viewers.IconImageCellRenderer(
                colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE));
        }

        preload(element: any): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}