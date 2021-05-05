namespace colibri.problems.ui {

    import controls = colibri.ui.controls;

    export class ProblemsCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: core.Problem): controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(ProblemsPlugin.getInstance().getIcon(ICON_ERROR));
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.NOTHING_LOADED;
        }
    }
}