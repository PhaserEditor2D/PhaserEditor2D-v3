namespace phasereditor2d.ide.ui.viewers {

    import controls = colibri.ui.controls;

    export class ProjectCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(
                resources.getIcon(resources.ICON_PROJECT));
        }

        preload(element: any): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}