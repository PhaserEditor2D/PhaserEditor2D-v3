namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class ImageAssetPackItemCellRenderer extends controls.viewers.ImageCellRenderer {

        getImage(obj: any): controls.IImage {

            const item = obj as core.AssetPackItem;

            const data = item.getData();

            return core.AssetPackUtils.getImageFromPackUrl(item.getPack(), data.url);
        }

    }
}