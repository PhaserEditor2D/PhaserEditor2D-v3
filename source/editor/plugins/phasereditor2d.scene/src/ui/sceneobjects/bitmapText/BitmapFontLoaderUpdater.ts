namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapFontLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {
            
            const fontCache = scene.cache.bitmapFont;

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

            const serializer = new core.json.Serializer(data);
            const type = serializer.getType();

            if (type === BitmapTextExtension.getInstance().getTypeName()) {

                const font = serializer.read("font");

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