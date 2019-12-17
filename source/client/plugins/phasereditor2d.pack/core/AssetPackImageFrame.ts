namespace phasereditor2d.pack.core {
    
    import controls = colibri.ui.controls;

    export class AssetPackImageFrame extends controls.ImageFrame {

        private _packItem: ImageFrameContainerAssetPackItem;

        constructor(packItem: ImageFrameContainerAssetPackItem, name: string, frameImage: controls.IImage, frameData: controls.FrameData) {
            super(name, frameImage, frameData);

            this._packItem = packItem;
        }

        getPackItem() {
            return this._packItem;
        }
    }

}