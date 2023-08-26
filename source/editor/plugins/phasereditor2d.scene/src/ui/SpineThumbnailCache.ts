namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;

    const localForage = window["localforage"] as LocalForage;

    export class SpineThumbnailCache {

        private _imgCache: Map<string, controls.IImage>;
        private _hashCache: Map<string, string>;

        constructor() {

            this._imgCache = new Map();
            this._hashCache = new Map();
        }


        getImage(skinItem: pack.core.SpineSkinItem) {

            const { spineAsset, skinName } = skinItem;

            const cacheImageKey = spineAsset.getPack().getFile().getFullName() + "." + spineAsset.getKey() + "." + skinName;

            spineAsset.buildGuessSkeleton();

            const newHash = spineAsset.getGuessHash() + "." + skinName;

            const savedImage = this._imgCache.get(cacheImageKey);
            const savedHash = this._hashCache.get(cacheImageKey);

            if (savedImage) {

                if (newHash === savedHash) {

                    return savedImage;
                }
            }

            const newImage = ScenePlugin.getInstance().buildSpineSkinThumbnailImage(skinItem);

            this._imgCache.set(cacheImageKey, newImage);
            this._hashCache.set(cacheImageKey, newHash);

            return newImage;
        }
    }
}