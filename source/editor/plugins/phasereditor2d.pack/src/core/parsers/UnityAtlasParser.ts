namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;

    export class UnityAtlasParser extends BaseAtlasParser {

        constructor(packItem: AssetPackItem) {
            super(packItem, true);
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem() as UnityAtlasAssetPackItem;

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const atlasURL = item.getData().atlasURL;

                const atlasData = AssetPackUtils.getFileStringFromPackUrl(item.getPack(), atlasURL);

                const textureURL = item.getData().textureURL;

                const image = AssetPackUtils.getImageFromPackUrl(item.getPack(), textureURL) as controls.DefaultImage;

                if (image && atlasData) {

                    game.textures.addUnityAtlas(item.getKey(), image.getImageElement(), atlasData as any);

                    for (const frame of item.getFrames()) {
                        cache.addImage(frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.DefaultImage, atlas: string) {

            // Taken from Phaser code.

            const data = atlas.split("\n");

            const lineRegExp = /^[ ]*(- )*(\w+)+[: ]+(.*)/;

            let prevSprite = "";
            let currentSprite = "";
            let rect = { x: 0, y: 0, width: 0, height: 0 };

            // const pivot = { x: 0, y: 0 };
            // const border = { x: 0, y: 0, z: 0, w: 0 };

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < data.length; i++) {

                const results = data[i].match(lineRegExp);

                if (!results) {
                    continue;
                }

                const isList = (results[1] === "- ");
                const key = results[2];
                const value = results[3];

                if (isList) {
                    if (currentSprite !== prevSprite) {
                        this.addFrame(image, imageFrames, currentSprite, rect);
                        prevSprite = currentSprite;
                    }

                    rect = { x: 0, y: 0, width: 0, height: 0 };
                }

                if (key === "name") {
                    //  Start new list
                    currentSprite = value;
                    continue;
                }

                switch (key) {
                    case "x":
                    case "y":
                    case "width":
                    case "height":
                        rect[key] = parseInt(value, 10);
                        break;

                    // case 'pivot':
                    //     pivot = eval('const obj = ' + value);
                    //     break;

                    // case 'border':
                    //     border = eval('const obj = ' + value);
                    //     break;
                }
            }

            if (currentSprite !== prevSprite) {

                this.addFrame(image, imageFrames, currentSprite, rect);
            }

        }

        private addFrame(image: controls.DefaultImage, imageFrames: AssetPackImageFrame[], spriteName: string, rect: any) {

            if (!image) {
                
                return;
            }

            const src = new controls.Rect(rect.x, rect.y, rect.width, rect.height);
            src.y = image.getHeight() - src.y - src.h;

            const dst = new controls.Rect(0, 0, rect.width, rect.height);
            const srcSize = new controls.Point(rect.width, rect.height);
            const fd = new controls.FrameData(imageFrames.length, src, dst, srcSize);

            imageFrames.push(new AssetPackImageFrame(
                this.getPackItem() as ImageFrameContainerAssetPackItem, spriteName, image, fd));
        }

    }
}

/*

TextureImporter:
  spritePivot: {x: .5, y: .5}
  spriteBorder: {x: 0, y: 0, z: 0, w: 0}
  spritePixelsToUnits: 100
  spriteSheet:
    sprites:
    - name: asteroids_0
      rect:
        serializedVersion: 2
        x: 5
        y: 328
        width: 65
        height: 82
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
    - name: asteroids_1
      rect:
        serializedVersion: 2
        x: 80
        y: 322
        width: 53
        height: 88
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
  spritePackingTag: Asteroids

  */