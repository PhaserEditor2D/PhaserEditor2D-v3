namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export abstract class AssetPackContentProvider implements controls.viewers.ITreeContentProvider {

        abstract getRoots(input: any): any[];

        getChildren(parent: any): any[] {

            if (parent instanceof core.AssetPack) {

                return parent.getItems();
            }

            if (parent instanceof core.ImageAssetPackItem) {

                return [];
            }

            if (parent instanceof core.ImageFrameContainerAssetPackItem) {

                return parent.getFrames();
            }

            if (parent instanceof core.ScriptsAssetPackItem) {

                return parent.getUrls();
            }

            return [];
        }
    }
}