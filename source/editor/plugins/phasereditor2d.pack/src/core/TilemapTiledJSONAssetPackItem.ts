/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export interface ITilesetData {
        name: string;
        image: string;
    }

    export class TilemapTiledJSONAssetPackItem extends AssetPackItem {

        private _tilesetsData: ITilesetData[];

        constructor(pack: AssetPack, data: any) {
            super(pack, data);

            this._tilesetsData = [];
        }

        async preload() {

            const tilesetsData = [];

            const url = this.getUrl();

            const file = pack.core.AssetPackUtils.getFileFromPackUrl(url);

            if (file) {

                const result = await colibri.ui.ide.FileUtils.preloadFileString(file);

                const str = colibri.ui.ide.FileUtils.getFileString(file);

                const data = JSON.parse(str);

                if (data.tilesets) {

                    for (const tilesetData of data.tilesets) {

                        tilesetsData.push({
                            name: tilesetData.name,
                            image: tilesetData.image
                        });
                    }
                }

                this._tilesetsData = tilesetsData;

                return result;
            }

            this._tilesetsData = tilesetsData;

            return colibri.ui.controls.PreloadResult.NOTHING_LOADED;
        }

        getUrl() {

            return this.getData()["url"];
        }

        getTilesetsData() {

            return this._tilesetsData;
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