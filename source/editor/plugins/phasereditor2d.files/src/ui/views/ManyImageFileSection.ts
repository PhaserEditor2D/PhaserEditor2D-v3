
namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class GridImageFileViewer extends controls.viewers.TreeViewer {

        constructor(...classList: string[]) {
            super("phasereditor2d.files.ui.views.GridImageFileViewer", ...classList);

            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            this.setLabelProvider(new viewers.FileLabelProvider());
            this.setCellRendererProvider(new viewers.FileCellRendererProvider());
            this.setTreeRenderer(
                new controls.viewers.GridTreeViewerRenderer(this, false, true)
                    .setPaintItemShadow(true));
        }
    }

    export class ManyImageFileSection extends controls.properties.PropertySection<core.io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "files.ManyImageFileSection", "Images", true);
        }

        createForm(parent: HTMLDivElement) {
            parent.classList.add("ManyImagePreviewFormArea");

            const viewer = new GridImageFileViewer();

            const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, true);
            parent.appendChild(filteredViewer.getElement());

            this.addUpdater(() => {

                // clean the viewer first
                viewer.setInput([]);
                viewer.repaint();

                viewer.setInput(this.getSelection());

                filteredViewer.resizeTo();
            });
        }

        canEdit(obj: any): boolean {

            if (obj instanceof core.io.FilePath) {

                const ct = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(obj);

                return ct === webContentTypes.core.CONTENT_TYPE_IMAGE || ct === webContentTypes.core.CONTENT_TYPE_SVG;
            }

            return false;
        }

        canEditNumber(n: number): boolean {
            return n > 1;
        }
    }
}