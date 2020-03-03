namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class ManyBitmapFontPreviewSection

        extends colibri.ui.ide.properties.BaseManyImagePreviewSection<pack.core.BitmapFontAssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.ManyBitmapFontPreviewSection", "Bitmap Font Preview", true);
        }

        protected async getViewerInput(): Promise<unknown> {

            return this.getSelection();
        }

        protected prepareViewer(viewer: controls.viewers.TreeViewer) {

            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("grid"));
            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.BitmapFontAssetPackItem;
        }
    }
}