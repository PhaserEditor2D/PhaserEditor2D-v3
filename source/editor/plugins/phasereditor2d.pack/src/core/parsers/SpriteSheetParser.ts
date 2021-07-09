/// <reference path="./BaseAtlasParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SpriteSheetParser extends ImageFrameParser {

        constructor(packItem: AssetPackItem) {
            super(packItem);
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem() as SpritesheetAssetPackItem;

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const data = item.getData();

                const image = AssetPackUtils.getImageFromPackUrl(item.getPack(), data.url) as controls.DefaultImage;

                if (image) {

                    game.textures.addSpriteSheet(item.getKey(), image.getImageElement(), data.frameConfig);

                    cache.addSpritesheetImage(image, item.getKey());

                    for (const frame of item.getFrames()) {

                        cache.addImage(frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const item = this.getPackItem();
            const data = item.getData();

            const imageFile = item.getFileFromAssetUrl(data.url);

            if (!imageFile) {

                return controls.Controls.resolveNothingLoaded();
            }

            const image = ide.FileUtils.getImage(imageFile);

            if (!image) {
                return controls.Controls.resolveNothingLoaded();
            }

            return await image.preloadSize();
        }

        parseFrames(): AssetPackImageFrame[] {

            const frames: AssetPackImageFrame[] = [];
            const item = this.getPackItem();
            const data = item.getData();

            const imageFile = item.getFileFromAssetUrl(data.url);
            const image = ide.FileUtils.getImage(imageFile);

            if (!image) {
                return frames;
            }

            const w = data.frameConfig.frameWidth;
            const h = data.frameConfig.frameHeight;
            const margin = data.frameConfig.margin || 0;
            const spacing = data.frameConfig.spacing || 0;
            const startFrame = data.frameConfig.startFrame || 0;
            const endFrame = data.frameConfig.endFrame || -1;

            if (w <= 0 || h <= 0 || spacing < 0 || margin < 0) {
                // invalid values
                return frames;
            }

            const start = startFrame < 0 ? 0 : startFrame;
            const end = endFrame < 0 ? Number.MAX_SAFE_INTEGER : endFrame;

            let i = 0;
            // let row = 0;
            // let column = 0;
            let x = margin;
            let y = margin;
            const imageHeight = image.getHeight();
            const imageWidth = image.getWidth();

            while (true) {

                if (i > end || y >= imageHeight || i > 1000) {

                    break;
                }

                if (x + w + spacing <= imageWidth) {

                    if (i >= start) {

                        const fd = new controls.FrameData(i,
                            new controls.Rect(x, y, w, h),
                            new controls.Rect(0, 0, w, h),
                            new controls.Point(w, h)
                        );

                        frames.push(new AssetPackImageFrame(
                            this.getPackItem() as ImageFrameContainerAssetPackItem, i, image, fd));
                    }

                    i++;
                }

                x += w + spacing;

                if (x >= imageWidth) {

                    x = margin;
                    y += h + spacing;
                }
            }

            return frames;
        }
    }
}