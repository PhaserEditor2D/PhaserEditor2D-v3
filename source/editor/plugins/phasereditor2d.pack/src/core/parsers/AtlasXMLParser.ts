/// <reference path="./BaseAtlasParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class AtlasXMLParser extends BaseAtlasParser {

        constructor(packItem: AssetPackItem) {
            super(packItem, false);
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem() as AtlasXMLAssetPackItem;

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const atlasURL = item.getData().atlasURL;
                const atlasData = AssetPackUtils.getFileXMLFromPackUrl(item.getPack(), atlasURL);
                const textureURL = item.getData().textureURL;

                const image = AssetPackUtils.getImageFromPackUrl(item.getPack(), textureURL) as controls.DefaultImage;

                if (atlasData && image) {

                    game.textures.addAtlasXML(item.getKey(), image.getImageElement(), atlasData);

                    for (const frame of item.getFrames()) {

                        cache.addImage(frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.DefaultImage, atlas: string) {

            try {

                const parser = new DOMParser();
                const data = parser.parseFromString(atlas, "text/xml");
                const elements = data.getElementsByTagName("SubTexture");

                for (let i = 0; i < elements.length; i++) {

                    const elem = elements.item(i);

                    const name = elem.getAttribute("name");

                    const frameX = Number.parseInt(elem.getAttribute("x"), 10);
                    const frameY = Number.parseInt(elem.getAttribute("y"), 10);
                    const frameW = Number.parseInt(elem.getAttribute("width"), 10);
                    const frameH = Number.parseInt(elem.getAttribute("height"), 10);

                    let spriteX = frameX;
                    let spriteY = frameY;
                    let spriteW = frameW;
                    let spriteH = frameH;

                    if (elem.hasAttribute("frameX")) {

                        spriteX = Number.parseInt(elem.getAttribute("frameX"), 10);
                        spriteY = Number.parseInt(elem.getAttribute("frameY"), 10);
                        spriteW = Number.parseInt(elem.getAttribute("frameWidth"), 10);
                        spriteH = Number.parseInt(elem.getAttribute("frameHeight"), 10);
                    }

                    const fd = new controls.FrameData(i,
                        new controls.Rect(frameX, frameY, frameW, frameH),
                        new controls.Rect(spriteX, spriteY, spriteW, spriteH),
                        new controls.Point(frameW, frameH)
                    );

                    imageFrames.push(new AssetPackImageFrame(
                        this.getPackItem() as ImageFrameContainerAssetPackItem, name, image, fd));
                }

            } catch (e) {
                console.error(e);
            }
        }
    }
}