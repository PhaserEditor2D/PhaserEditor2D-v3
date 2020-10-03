/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export class TilemapTiledJSONAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload() {

            const url = this.getUrl();

            const file = pack.core.AssetPackUtils.getFileFromPackUrl(url);

            if (file) {

                return await colibri.ui.ide.FileUtils.preloadFileString(file)
            }

            return colibri.ui.controls.PreloadResult.NOTHING_LOADED;
        }

        getUrl() {

            return this.getData()["url"];
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const file = pack.core.AssetPackUtils.getFileFromPackUrl(this.getUrl());

            if (file) {

                const fileContent = colibri.ui.ide.FileUtils.getFileString(file);

                const fileData = JSON.parse(fileContent);

                const tileData = { format: Phaser.Tilemaps.Formats.TILED_JSON, data: fileData };

                game.cache.tilemap.add(this.getKey(), tileData);
            }

            cache.addAsset(this);
        }
    }
}