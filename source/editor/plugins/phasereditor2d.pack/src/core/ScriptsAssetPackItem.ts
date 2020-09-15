/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export class ScriptsAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        getUrls() {

            return this.getData().url as string[];
        }
    }
}