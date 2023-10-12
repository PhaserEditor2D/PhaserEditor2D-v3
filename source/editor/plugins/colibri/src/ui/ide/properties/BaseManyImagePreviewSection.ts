namespace colibri.ui.ide.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export abstract class BaseManyImagePreviewSection<T> extends controls.properties.PropertySection<T> {

        createForm(parent: HTMLDivElement) {
            parent.classList.add("ManyImagePreviewFormArea");

            const viewer = new controls.viewers.TreeViewer("colibri.ui.ide.properties.ManyImagePreviewFormArea");

            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setTreeRenderer(this.createTreeRenderer(viewer));

            this.prepareViewer(viewer);

            const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, true);
            parent.appendChild(filteredViewer.getElement());

            this.addUpdater(async () => {

                // console.log("update " + this.getId());

                const input = await this.getViewerInput();

                // // clean the viewer first
                // viewer.setInput([]);

                // await viewer.repaint();

                viewer.setInput(input || []);

                filteredViewer.resizeTo();
            });
        }

        protected createTreeRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer {
            
            return new controls.viewers.GridTreeViewerRenderer(viewer, false, true).setPaintItemShadow(true);
        }

        protected abstract getViewerInput(): Promise<unknown>;

        protected abstract prepareViewer(viewer: controls.viewers.TreeViewer);

        canEditNumber(n: number): boolean {
            return n > 1;
        }
    }
}