namespace phasereditor2d.scene.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class TypeAndPrefabCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof io.FilePath) {
                return new viewers.SceneFileCellRenderer();
            }

            return new viewers.ObjectExtensionCellRendererProvider().getCellRenderer(element);
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            if (args.obj instanceof io.FilePath) {
                return new viewers.SceneFileCellRenderer().preload(args);
            }

            return controls.Controls.resolveNothingLoaded();
        }

    }
}