namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AtlasItemCellRenderer extends controls.viewers.ImageCellRenderer {

        getImage(obj: pack.core.ImageFrameContainerAssetPackItem) {

            return obj.getThumbnail();
        }

        async preload(args: controls.viewers.PreloadCellArgs) {

            const container = args.obj as pack.core.ImageFrameContainerAssetPackItem;

            const r1 = await container.preload();

            const r2 = await container.preloadImages();

            return Math.max(r1, r2);
        }
    }
}