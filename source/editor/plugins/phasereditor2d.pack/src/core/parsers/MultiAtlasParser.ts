namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class MultiAtlasParser extends ImageFrameParser {

        constructor(packItem: AssetPackItem) {
            super(packItem);
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem() as MultiatlasAssetPackItem;

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const packItemData = item.getData();
                const atlasDataFile = item.getFileFromAssetUrl(packItemData.url);
                const atlasData = AssetPackUtils.getFileJSONFromPackUrl(item.getPack(), packItemData.url);

                if (atlasData && atlasDataFile) {

                    const images: HTMLImageElement[] = [];
                    const jsonArrayData = [];

                    for (const textureData of atlasData.textures) {

                        const imageName = textureData.image;
                        const imageFile = atlasDataFile.getSibling(imageName);
                        const image = ide.FileUtils.getImage(imageFile) as controls.DefaultImage;

                        images.push(image.getImageElement());

                        jsonArrayData.push(textureData);
                    }

                    game.textures.addAtlasJSONArray(this.getPackItem().getKey(), images, jsonArrayData);

                    for (const frame of item.getFrames()) {

                        cache.addImage(frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const item = this.getPackItem();
            const data = item.getData();
            const dataFile = item.getFileFromAssetUrl(data.url);

            if (dataFile) {

                return await ide.FileUtils.preloadFileString(dataFile);
            }

            return controls.Controls.resolveNothingLoaded();
        }

        parseFrames(): AssetPackImageFrame[] {
            const list: AssetPackImageFrame[] = [];

            const item = this.getPackItem();
            const data = item.getData();
            const dataFile = item.getFileFromAssetUrl(data.url);

            if (dataFile) {

                const str = ide.FileUtils.getFileString(dataFile);

                try {

                    const data2 = JSON.parse(str);

                    if (data2.textures) {

                        for (const textureData of data2.textures) {

                            const imageName = textureData.image;
                            const imageFile = dataFile.getSibling(imageName);
                            const image = ide.FileUtils.getImage(imageFile);

                            for (const frame of textureData.frames) {
                                const frameData = AtlasParser
                                    .buildFrameData(this.getPackItem(), image, frame, list.length);
                                list.push(frameData);
                            }
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            BaseAtlasParser.sortFrames(list);

            return list;
        }
    }

}