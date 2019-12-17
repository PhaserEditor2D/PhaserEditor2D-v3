namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class ImageAssetPackItemCellRenderer extends controls.viewers.ImageCellRenderer {

        getImage(obj: any): controls.IImage {

            const item = <core.AssetPackItem>obj;
            const data = item.getData();

            return core.AssetPackUtils.getImageFromPackUrl(data.url);
        }

    }
}