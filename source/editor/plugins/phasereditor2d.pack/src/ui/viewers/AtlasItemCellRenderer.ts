namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class AtlasItemCellRenderer extends controls.viewers.ImageCellRenderer {

        getImage(obj: pack.core.ImageFrameContainerAssetPackItem) {

            return obj.getThumbnail();
        }

        async preload(args: controls.viewers.PreloadCellArgs) {

            const container = args.obj as pack.core.ImageFrameContainerAssetPackItem;

            await container.preload();

            const r1 = container.getThumbnail() ? controls.PreloadResult.NOTHING_LOADED : controls.PreloadResult.RESOURCES_LOADED;

            const r2 = await container.preloadImages();

            const result = Math.max(r1, r2);

            return result;
        }
    }
}