namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;

    export class ImageParser extends ImageFrameParser {

        constructor(packItem: AssetPackItem) {
            super(packItem);
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const item = this.getPackItem();

            cache.addAsset(item);

            if (!game.textures.exists(item.getKey())) {

                const url = item.getData().url;

                const image = AssetPackUtils.getImageFromPackUrl(item.getPack(), url) as controls.DefaultImage;

                if (image) {

                    game.textures.addImage(item.getKey(), image.getImageElement());

                    cache.addImage(image, item.getKey());
                }
            }
        }

        async preloadFrames(): Promise<controls.PreloadResult> {

            const item = this.getPackItem();
            const url = item.getData().url;

            const img = AssetPackUtils.getImageFromPackUrl(item.getPack(), url);

            if (img) {

                return await img.preloadSize();
            }

            return controls.Controls.resolveNothingLoaded();
        }

        parseFrames(): AssetPackImageFrame[] {

            const item = this.getPackItem();
            const url = item.getData().url;
            const img = AssetPackUtils.getImageFromPackUrl(item.getPack(), url);

            let fd: controls.FrameData;

            if (img) {

                fd = new controls.FrameData(0,
                    new controls.Rect(0, 0, img.getWidth(), img.getHeight()),
                    new controls.Rect(0, 0, img.getWidth(), img.getHeight()),
                    new controls.Point(img.getWidth(), img.getWidth())
                );

            } else {

                fd = new controls.FrameData(0,
                    new controls.Rect(0, 0, 10, 10),
                    new controls.Rect(0, 0, 10, 10),
                    new controls.Point(10, 10)
                );
            }

            return [new AssetPackImageFrame(
                this.getPackItem() as ImageFrameContainerAssetPackItem, this.getPackItem().getKey(), img, fd)];
        }
    }
}