namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;

    export class AssetPackCache {

        private _imageMap: Map<string, controls.IImage>;
        private _assets: Set<AssetPackItem>;

        constructor() {

            this._imageMap = new Map();
            this._assets = new Set();
        }

        clear() {

            this._imageMap.clear();
        }

        addAsset(asset: AssetPackItem) {

            this._assets.add(asset);
        }

        getAssets() {
            return this._assets;
        }

        addImage(image: controls.IImage, key: string, frame?: string | number) {

            const mapKey = this.getImageMapKey(key, frame);

            this._imageMap.set(mapKey, image);
        }

        getImage(key: string, frame?: string | number) {

            const mapKey = this.getImageMapKey(key, frame);

            return this._imageMap.get(mapKey);
        }

        private getImageMapKey(key: string, frame: string | number) {

            return key + "$" + (frame === null || frame === undefined ? "." : frame);
        }
    }
}