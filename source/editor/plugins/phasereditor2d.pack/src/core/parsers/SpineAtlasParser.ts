namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class SpineAtlasParser extends ImageFrameParser {

        constructor(packItem: SpineAtlasAssetPackItem) {
            super(packItem);
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const item = this.getPackItem();

            const data = item.getData();

            const atlasFile = item.getFileFromAssetUrl(data.url);

            if (!atlasFile) {

                return controls.Controls.resolveNothingLoaded();
            }

            let result = await ide.FileUtils.preloadFileString(atlasFile);

            const images = this.getTextureImages(atlasFile);

            for (const img of images) {

                const result2 = await img.preloadSize();

                result = Math.max(result, result2);
            }

            return result;
        }

        parseFrames(): AssetPackImageFrame[] {

            const packItem = this.getPackItem() as SpineAtlasAssetPackItem;

            const itemData = packItem.getData();

            const atlasUrl = itemData.url;

            const atlasFile = packItem.getFileFromAssetUrl(atlasUrl);

            const frames: AssetPackImageFrame[] = [];

            if (!atlasFile) {

                return frames;
            }

            const atlasContent = ide.FileUtils.getFileString(atlasFile);

            const spineAtlas = new spine.TextureAtlas(atlasContent);

            for (const page of spineAtlas.pages) {

                const imageFile = atlasFile.getSibling(page.name);

                const image = colibri.Platform.getWorkbench().getFileImage(imageFile);

                let i = 0;

                for (const region of page.regions) {

                    let src: controls.Rect;
                    let dst: controls.Rect;
                    let size: controls.Point;

                    if (region.degrees === 90) {

                        src = new controls.Rect(region.x, region.y, region.height, region.width);
                        dst = new controls.Rect(region.x + region.offsetX, region.y + region.offsetX, region.height, region.width);
                        size = new controls.Point(region.height, region.width);

                    } else {

                        src = new controls.Rect(region.x, region.y, region.width, region.height);
                        dst = new controls.Rect(region.x + region.offsetX, region.y + region.offsetX, region.width, region.height);
                        size = new controls.Point(region.width, region.height);
                    }

                    const fd = new controls.FrameData(i++, src, dst, size);

                    const frame = new AssetPackImageFrame(packItem, region.name, image, fd);

                    frames.push(frame);
                }
            }

            return frames;
        }

        private getTextureImages(atlasFile: io.FilePath) {

            const str = ide.FileUtils.getFileString(atlasFile);

            const textures = this.getTextures(str);

            return textures

                .map(texture => atlasFile.getSibling(texture))

                .filter(file => Boolean(file))

                .map(file => colibri.Platform.getWorkbench().getFileImage(file))

                .filter(img => Boolean(img));
        }

        private getTextures(atlasContent: string) {

            // taken from spine-phaser runtime.

            const textures: string[] = [];

            var lines = atlasContent.split(/\r\n|\r|\n/);

            textures.push(lines[0]);

            for (var t = 1; t < lines.length; t++) {

                var line = lines[t];

                if (line.trim() === '' && t < lines.length - 1) {

                    line = lines[t + 1];

                    textures.push(line);
                }
            }

            return textures;
        }


        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            // Nothing, the spine atlas frames are not using in regular game objects like
            // Image, Sprite, TileSprite, etc...
            //
            // The spine atlas are used only by the spine game objects.
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