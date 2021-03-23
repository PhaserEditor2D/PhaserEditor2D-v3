/// <reference path="./ImageFrameParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export abstract class BaseAtlasParser extends ImageFrameParser {

        private _preloadImageSize: boolean;

        constructor(packItem: AssetPackItem, preloadImageSize: boolean) {
            super(packItem);

            this._preloadImageSize = preloadImageSize;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem() as ImageFrameContainerAssetPackItem;

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const atlasURL = item.getData().atlasURL;
                const atlasData = AssetPackUtils.getFileJSONFromPackUrl(item.getPack(), atlasURL);
                const textureURL = item.getData().textureURL;

                const image = AssetPackUtils.getImageFromPackUrl(item.getPack(), textureURL) as controls.DefaultImage;

                if (image) {

                    game.textures.addAtlas(item.getKey(), image.getImageElement(), atlasData);

                    for (const frame of item.getFrames()) {

                        cache.addImage(frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const item = this.getPackItem();

            const data = item.getData();

            const dataFile = item.getFileFromAssetUrl(data.atlasURL);

            if (!dataFile) {

                return controls.Controls.resolveNothingLoaded();
            }

            let result1 = await ide.FileUtils.preloadFileString(dataFile);

            const imageFile = item.getFileFromAssetUrl(data.textureURL);

            if (this._preloadImageSize) {

                const result2 = await ide.FileUtils.preloadImageSize(imageFile);
                result1 = Math.max(result1, result2);
            }

            return result1;
        }

        protected abstract parseFrames2(frames: AssetPackImageFrame[], image: controls.IImage, atlas: string);

        parseFrames(): AssetPackImageFrame[] {

            const list: AssetPackImageFrame[] = [];

            const item = this.getPackItem();
            const data = item.getData();
            const dataFile = item.getFileFromAssetUrl(data.atlasURL);
            const imageFile = item.getFileFromAssetUrl(data.textureURL);
            const image = ide.FileUtils.getImage(imageFile);

            if (dataFile) {

                const str = ide.FileUtils.getFileString(dataFile);

                try {
                    this.parseFrames2(list, image, str);
                } catch (e) {
                    console.error(e);
                }
            }

            BaseAtlasParser.sortFrames(list);

            return list;
        }

        static sortFrames(frames: AssetPackImageFrame[]) {

            frames.sort((a, b) => {

                return (a.getName() as string).localeCompare(b.getName() as string);
            });
        }
    }
}