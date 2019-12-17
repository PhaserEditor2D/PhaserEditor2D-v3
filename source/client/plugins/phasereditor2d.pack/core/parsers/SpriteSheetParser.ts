/// <reference path="./BaseAtlasParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SpriteSheetParser extends ImageFrameParser {

        constructor(packItem: AssetPackItem) {
            super(packItem);
        }

        addToPhaserCache(game: Phaser.Game) {

            const item = this.getPackItem() as SpritesheetAssetPackItem;

            if (!game.textures.exists(item.getKey())) {

                const data = item.getData();

                const image = <controls.DefaultImage>AssetPackUtils.getImageFromPackUrl(data.url);

                if (image) {
                    
                    game.textures.addSpriteSheet(item.getKey(), image.getImageElement(), data.frameConfig);

                    for(const frame of item.getFrames()) {
                        ImageFrameParser.setSourceImageFrame(game, frame, item.getKey(), frame.getName());
                    }
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const data = this.getPackItem().getData();

            const imageFile = AssetPackUtils.getFileFromPackUrl(data.url);

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

            const data = this.getPackItem().getData();

            const imageFile = AssetPackUtils.getFileFromPackUrl(data.url);
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
            const end = endFrame < 0 ? Number.MAX_VALUE : endFrame;

            let i = 0;
            let row = 0;
            let column = 0;
            let x = margin;
            let y = margin;

            while (true) {

                if (i > end || y >= image.getHeight() || i > 50) {
                    break;
                }

                if (i >= start) {

                    if (x + w <= image.getWidth() && y + h <= image.getHeight()) {

                        const fd = new controls.FrameData(i,
                            new controls.Rect(x, y, w, h),
                            new controls.Rect(0, 0, w, h),
                            new controls.Point(w, h)
                        );

                        frames.push(new AssetPackImageFrame(<ImageFrameContainerAssetPackItem>this.getPackItem(), i.toString(), image, fd));
                    }
                }

                column++;

                x += w + spacing;

                if (x >= image.getWidth()) {
                    x = margin;
                    y += h + spacing;
                    column = 0;
                    row++;
                }

                i++;
            }

            return frames;
        }
    }
}