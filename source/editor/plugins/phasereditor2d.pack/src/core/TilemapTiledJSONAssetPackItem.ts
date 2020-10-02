/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export class TilemapTiledJSONAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload() {

            const url = this.getData()["url"];

            const file = pack.core.AssetPackUtils.getFileFromPackUrl(url);

            if (file) {

                return await colibri.ui.ide.FileUtils.preloadFileString(file)
            }

            return colibri.ui.controls.PreloadResult.NOTHING_LOADED;
        }
    }
}