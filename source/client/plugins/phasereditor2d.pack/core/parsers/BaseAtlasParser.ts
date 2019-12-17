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

        addToPhaserCache(game: Phaser.Game) {

            const item = this.getPackItem() as ImageFrameContainerAssetPackItem;

            if (!game.textures.exists(item.getKey())) {

                const atlasURL = item.getData().atlasURL;
                const atlasData = AssetPackUtils.getFileJSONFromPackUrl(atlasURL);
                const textureURL = item.getData().textureURL;

                const image = <controls.DefaultImage>AssetPackUtils.getImageFromPackUrl(textureURL);

                if (image) {

                    game.textures.addAtlas(item.getKey(), image.getImageElement(), atlasData);

                    for(const frame of item.getFrames()) {
                        ImageFrameParser.setSourceImageFrame(game, frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const data = this.getPackItem().getData();

            const dataFile = AssetPackUtils.getFileFromPackUrl(data.atlasURL);

            if (!dataFile) {
                return controls.Controls.resolveNothingLoaded();
            }

            let result1 = await ide.FileUtils.preloadFileString(dataFile);

            const imageFile = AssetPackUtils.getFileFromPackUrl(data.textureURL);

            if (this._preloadImageSize) {

                let result2 = await ide.FileUtils.preloadImageSize(imageFile);
                result1 = Math.max(result1, result2);
            }

            return result1;
        }

        protected abstract parseFrames2(frames: AssetPackImageFrame[], image: controls.IImage, atlas: string);

        parseFrames(): AssetPackImageFrame[] {

            const list: AssetPackImageFrame[] = [];

            const data = this.getPackItem().getData();
            const dataFile = AssetPackUtils.getFileFromPackUrl(data.atlasURL);
            const imageFile = AssetPackUtils.getFileFromPackUrl(data.textureURL);
            const image = ide.FileUtils.getImage(imageFile);

            if (dataFile) {

                const str = ide.FileUtils.getFileString(dataFile);

                try {
                    this.parseFrames2(list, image, str);
                } catch (e) {
                    console.error(e);
                }
            }

            return list;
        }
    }
}