namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;

    export class AssetPackImageFrame extends controls.ImageFrame {

        private _packItem: ImageFrameContainerAssetPackItem;

        constructor(
            packItem: ImageFrameContainerAssetPackItem, name: string | number,
            frameImage: controls.DefaultImage, frameData: controls.FrameData) {

            super(name, frameImage, frameData);

            this._packItem = packItem;
        }

        equalsKeys(other: AssetPackImageFrame) {

            if (other) {

                return other.getPackItem().getKey() === this.getPackItem().getKey()
                    && other.getName() === this.getName();
            }

            return false;
        }

        getPackItem() {
            
            return this._packItem;
        }
    }

}