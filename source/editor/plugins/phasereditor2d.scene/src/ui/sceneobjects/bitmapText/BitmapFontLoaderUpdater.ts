namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapFontLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(game: Phaser.Game): void {

            const fontCache = game.cache.bitmapFont;

            const keys = fontCache.getKeys();

            for (const key of keys) {

                fontCache.remove(key);
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.BitmapFontAssetPackItem;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            const font = asset as pack.core.BitmapFontAssetPackItem;

            await font.preload();

            await font.preloadImages();

            font.addToPhaserCache(scene.game, scene.getPackCache());
        }
    }
}