namespace phasereditor2d.files.ui.viewers {

    import io = colibri.core.io;
    import viewers = colibri.ui.controls.viewers;
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class FileCellRenderer extends viewers.IconImageCellRenderer {

        constructor() {
            super(null);
        }

        getIcon(obj: any): controls.IImage {

            const file = obj as io.FilePath;

            if (file.isFile()) {

                const ct = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

                const icon = ide.Workbench.getWorkbench().getContentTypeIcon(ct);

                if (icon) {
                    return icon;
                }

            } else {

                if (file.getParent()) {

                    return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
                }

                return resources.getIcon(resources.ICON_PROJECT);
            }

            return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FILE);
        }

        preload(args: controls.viewers.PreloadCellArgs) {

            const obj = args.obj;

            const file = obj as io.FilePath;

            if (file.isFile()) {
                const result = ide.Workbench.getWorkbench().getContentTypeRegistry().preload(file);
                return result;
            }

            return super.preload(args);
        }
    }
}