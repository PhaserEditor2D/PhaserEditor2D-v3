namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class MultiAtlasParser extends ImageFrameParser {

        constructor(packItem: AssetPackItem) {
            super(packItem);
        }

        addToPhaserCache(game: Phaser.Game) {

            const item = this.getPackItem() as MultiatlasAssetPackItem;

            if (!game.textures.exists(item.getKey())) {

                const packItemData = item.getData();
                const atlasDataFile = AssetPackUtils.getFileFromPackUrl(packItemData.url);
                const atlasData = AssetPackUtils.getFileJSONFromPackUrl(packItemData.url);

                if (atlasData && atlasDataFile) {

                    const images: HTMLImageElement[] = [];
                    const jsonArrayData = [];

                    for (const textureData of atlasData.textures) {

                        const imageName = textureData.image;
                        const imageFile = atlasDataFile.getSibling(imageName);
                        const image = <controls.DefaultImage>ide.FileUtils.getImage(imageFile);

                        images.push(image.getImageElement());

                        jsonArrayData.push(textureData);
                    }

                    game.textures.addAtlasJSONArray(this.getPackItem().getKey(), images, jsonArrayData);

                    for(const frame of item.getFrames()) {
                        ImageFrameParser.setSourceImageFrame(game, frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const data = this.getPackItem().getData();
            const dataFile = AssetPackUtils.getFileFromPackUrl(data.url);

            if (dataFile) {
                return await ide.FileUtils.preloadFileString(dataFile);
            }

            return controls.Controls.resolveNothingLoaded();
        }

        parseFrames(): AssetPackImageFrame[] {
            const list: AssetPackImageFrame[] = [];

            const data = this.getPackItem().getData();
            const dataFile = AssetPackUtils.getFileFromPackUrl(data.url);

            if (dataFile) {

                const str = ide.FileUtils.getFileString(dataFile);

                try {

                    const data = JSON.parse(str);

                    if (data.textures) {

                        for (const textureData of data.textures) {

                            const imageName = textureData.image;
                            const imageFile = dataFile.getSibling(imageName);
                            const image = ide.FileUtils.getImage(imageFile);

                            for (const frame of textureData.frames) {
                                const frameData = AtlasParser.buildFrameData(this.getPackItem(), image, frame, list.length);
                                list.push(frameData);
                            }
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            return list;
        }
    }

}