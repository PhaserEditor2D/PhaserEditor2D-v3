namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AssetPackTreeViewerRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer, flat: boolean) {
            super(viewer, flat, false);

            this.setSectionCriteria(obj => this.isObjectSection(obj));
            this.setPaintItemShadow(true);
            this.setShadowChildCriteria(obj => this.isShadowAsChild(obj));
        }

        protected isObjectSection(obj: any) {

            return AssetPackPlugin.getInstance().isAssetPackItemType(obj)
                || obj instanceof pack.core.AssetPack
                || (obj instanceof colibri.core.io.FilePath && obj.isFolder());
        }

        isShadowAsChild(obj: any) {

            return obj instanceof controls.ImageFrame;
        }
    }
}