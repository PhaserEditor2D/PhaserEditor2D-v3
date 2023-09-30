namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;
    import viewers = colibri.ui.controls.viewers;

    export class FileCellRendererProvider implements viewers.ICellRendererProvider {

        private _layout: "tree" | "grid";

        constructor(layout: "tree" | "grid" = "tree") {
            this._layout = layout;
        }

        getCellRenderer(file: io.FilePath): viewers.ICellRenderer {

            const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            const extensions = colibri.Platform
                .getExtensions<ContentTypeCellRendererExtension>(ContentTypeCellRendererExtension.POINT_ID);

            for (const extension of extensions) {

                const provider = extension.getRendererProvider(contentType);

                if (provider !== null) {
                    
                    return provider.getCellRenderer(file);
                }
            }

            return new FileCellRenderer();
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            return ide.Workbench.getWorkbench().getContentTypeRegistry().preload(args.obj);
        }
    }
}