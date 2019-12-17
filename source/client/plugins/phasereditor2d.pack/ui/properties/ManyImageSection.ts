namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class ManyImageSection extends controls.properties.PropertySection<any> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.ui.ide.editors.pack.properties.ManyImageSection", "Image Preview", true);
        }

        protected createForm(parent: HTMLDivElement) {
            parent.classList.add("ManyImagePreviewFormArea");

            const viewer = new controls.viewers.TreeViewer("PreviewBackground");
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setTreeRenderer(new controls.viewers.GridTreeViewerRenderer(viewer, false, true));
            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("grid"));

            const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer);
            parent.appendChild(filteredViewer.getElement());

            this.addUpdater(async () => {
                const frames = await this.getImageFrames();

                // clean the viewer first
                viewer.setInput([]);
                viewer.repaint();

                viewer.setInput(frames);
                filteredViewer.resizeTo();
            });
        }

        private async getImageFrames() {
            
            const frames = this.getSelection().flatMap(obj => {

                if (obj instanceof core.ImageFrameContainerAssetPackItem) {
                    return obj.getFrames();
                }

                return [(<controls.ImageFrame>obj)]
            });

            return frames;
        }

        canEdit(obj: any, n: number): boolean {

            if (n === 1) {
                return obj instanceof core.AssetPackItem && obj.getType() !== core.IMAGE_TYPE && obj instanceof core.ImageFrameContainerAssetPackItem;
            }

            return obj instanceof controls.ImageFrame || obj instanceof core.AssetPackItem && obj instanceof core.ImageFrameContainerAssetPackItem;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }

    }

}