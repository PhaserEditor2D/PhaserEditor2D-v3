namespace phasereditor2d.pack.core {

    export abstract class SpineAssetPackItem extends AssetPackItem {

        private _guessHash: string;
        private _guessSkeleton: spine.SkeletonData;
        private _guessSkinItems: SpineSkinItem[] = [];

        getDataFile() {

            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            return file;
        }

        abstract buildSkeleton(atlasAsset: SpineAtlasAssetPackItem): spine.SkeletonData;

        /**
         * Find the spine atlas for this spine data. It looks for an spine atlas in the
         * same asset pack with the same key of this spine data but with the `-atlas` sufix.
         * If the data has a `MySpineAnimation` key, the it looks for the `MySpineAnimation-atlas` key.
         * 
         * @returns The spine atlas asset associated with this spine data asset.
         */
        guessAtlasAsset() {

            const result = this.findAtlasAssetInPack(this.getPack());

            return result;
        }

        private findAtlasAssetInPack(pack: AssetPack) {

            const item = pack.getItems()
                .find(i => i instanceof SpineAtlasAssetPackItem
                    && i.getKey() === this.getKey() + "-atlas");

            return item as SpineAtlasAssetPackItem;
        }

        getGuessSkinItems() {

            this.buildGuessSkeleton();

            return this._guessSkinItems;
        }

        getGuessHash() {

            return this._guessHash;
        }

        buildGuessSkeleton() {

            const atlas = this.guessAtlasAsset();

            if (!atlas) {

                this._guessHash = undefined;
                this._guessSkeleton = undefined;

                return;
            }

            const thisHash = this.computeHash();
            const atlasHash = atlas.computeHash();

            const newHash = thisHash + "-" + atlasHash;

            if (newHash !== this._guessHash) {

                this._guessHash = newHash;

                this._guessSkeleton = this.buildSkeleton(atlas);

                if (this._guessSkeleton) {

                    let skins = this._guessSkeleton.skins;

                    if (skins.length === 0 && this._guessSkeleton.defaultSkin) {

                        skins = [this._guessSkeleton.defaultSkin];
                    }

                    this._guessSkinItems = skins.map(s => new SpineSkinItem(this, atlas, s.name));

                } else {

                    this._guessSkinItems = [];
                }
            }
        }

        getGuessSkeleton() {

            this.buildGuessSkeleton();

            return this._guessSkeleton;
        }
    }
}