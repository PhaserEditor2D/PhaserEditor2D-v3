namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AssetPackTreeViewerRenderer extends controls.viewers.ShadowGridTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer, flat: boolean) {
            super(viewer, flat, false);

            const types = core.TYPES.filter(
                type => type === core.ATLAS_TYPE || type.toLowerCase().indexOf("atlas") < 0);

            this.setSections(types);
        }

        isShadowAsChild(obj: any) {
            return obj instanceof controls.ImageFrame;
        }
    }
}