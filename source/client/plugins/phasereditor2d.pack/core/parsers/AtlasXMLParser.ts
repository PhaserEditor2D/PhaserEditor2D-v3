/// <reference path="./BaseAtlasParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class AtlasXMLParser extends BaseAtlasParser {

        constructor(packItem: AssetPackItem) {
            super(packItem, false);
        }

        addToPhaserCache(game: Phaser.Game) {

            const item = this.getPackItem() as AtlasXMLAssetPackItem;

            if (!game.textures.exists(item.getKey())) {

                const atlasURL = item.getData().atlasURL;
                const atlasData = AssetPackUtils.getFileXMLFromPackUrl(atlasURL);
                const textureURL = item.getData().textureURL;

                const image = <controls.DefaultImage>AssetPackUtils.getImageFromPackUrl(textureURL);

                if (atlasData && image) {

                    game.textures.addAtlasXML(item.getKey(), image.getImageElement(), atlasData);

                    for(const frame of item.getFrames()) {
                        ImageFrameParser.setSourceImageFrame(game, frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.IImage, atlas: string) {

            try {

                const parser = new DOMParser();
                const data = parser.parseFromString(atlas, "text/xml");
                const elements = data.getElementsByTagName("SubTexture");

                for (let i = 0; i < elements.length; i++) {

                    const elem = elements.item(i);

                    const name = elem.getAttribute("name");

                    const frameX = Number.parseInt(elem.getAttribute("x"));
                    const frameY = Number.parseInt(elem.getAttribute("y"));
                    const frameW = Number.parseInt(elem.getAttribute("width"));
                    const frameH = Number.parseInt(elem.getAttribute("height"));

                    let spriteX = frameX;
                    let spriteY = frameY;
                    let spriteW = frameW;
                    let spriteH = frameH;

                    if (elem.hasAttribute("frameX")) {

                        spriteX = Number.parseInt(elem.getAttribute("frameX"));
                        spriteY = Number.parseInt(elem.getAttribute("frameY"));
                        spriteW = Number.parseInt(elem.getAttribute("frameWidth"));
                        spriteH = Number.parseInt(elem.getAttribute("frameHeight"));
                    }

                    const fd = new controls.FrameData(i,
                        new controls.Rect(frameX, frameY, frameW, frameH),
                        new controls.Rect(spriteX, spriteY, spriteW, spriteH),
                        new controls.Point(frameW, frameH)
                    );

                    imageFrames.push(new AssetPackImageFrame(<ImageFrameContainerAssetPackItem>this.getPackItem(), name, image, fd));
                }

            } catch (e) {
                console.error(e);
            }
        }
    }
}