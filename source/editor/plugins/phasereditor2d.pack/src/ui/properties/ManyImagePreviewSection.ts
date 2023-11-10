namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class ManyImagePreviewSection extends colibri.ui.ide.properties.BaseManyImagePreviewSection<any> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.ManyImagePreviewSection", "Image Preview", true);
        }

        protected async getViewerInput() {

            const frames = this.getSelection().flatMap(obj => {

                if (obj instanceof core.ImageFrameContainerAssetPackItem) {

                    return obj.getFrames();
                }

                return [(obj as controls.ImageFrame)];
            });

            return frames;
        }

        protected prepareViewer(viewer: controls.viewers.TreeViewer) {

            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("grid"));
        }

        canEdit(obj: any, n: number): boolean {

            if (n === 1) {

                return obj instanceof core.AssetPackItem
                    && !(obj instanceof core.ImageAssetPackItem) && obj instanceof core.ImageFrameContainerAssetPackItem;
            }

            return obj instanceof controls.ImageFrame
                || obj instanceof core.AssetPackItem && obj instanceof core.ImageFrameContainerAssetPackItem;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}