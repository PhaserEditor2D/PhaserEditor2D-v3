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

        async updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void> {

            if (data.type === BitmapTextExtension.getInstance().getTypeName()) {

                const font = (data as any).font;

                if (font) {

                    const finder = scene.getMaker().getPackFinder();

                    const asset = finder.findAssetPackItem(font);

                    if (asset && asset instanceof pack.core.BitmapFontAssetPackItem) {

                        await this.updateLoader(scene, asset);
                    }
                }
            }
        }
    }
}