namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ManySceneFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.ManySceneFileSection", "Scene", true, false);
        }

        createForm(parent: HTMLDivElement) {

            const viewer = new files.ui.views.GridImageFileViewer();

            const filteredViewer = new colibri.ui.ide.properties.FilteredViewerInPropertySection(
                this.getPage(), viewer, true);

            parent.appendChild(filteredViewer.getElement());

            this.addUpdater(() => {

                viewer.setInput([]);
                viewer.repaint();

                viewer.setInput(this.getSelection());

                filteredViewer.resizeTo();
            });
        }

        canEdit(obj: io.FilePath, n: number): boolean {

            return obj instanceof io.FilePath
                && colibri.Platform.getWorkbench().getContentTypeRegistry()
                    .getCachedContentType(obj) === core.CONTENT_TYPE_SCENE;
        }

        canEditNumber(n: number): boolean {

            return n > 1;
        }
    }
}