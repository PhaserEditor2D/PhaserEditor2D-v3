namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AssetPackTreeViewerRenderer extends controls.viewers.GridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer, flat: boolean) {
            super(viewer, flat, false);

            this.setSectionCriteria(obj => this.isObjectSection(obj));
            this.setPaintItemShadow(true);
            this.setShadowChildCriteria(obj => this.isShadowAsChild(obj));
        }

        protected isObjectSection(obj: boolean) {

            return typeof obj === "string";
        }

        isShadowAsChild(obj: any) {

            return obj instanceof controls.ImageFrame;
        }
    }
}