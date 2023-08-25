namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {

            for (const cache of [scene.cache.json, scene.cache.binary]) {

                const keys = cache.getKeys();

                for (const key of keys) {

                    cache.remove(key);
                }
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.SpineAssetPackItem;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            const item = asset as pack.core.AssetPackItem;

            await item.preload();

            item.addToPhaserCache(scene.game, scene.getPackCache());
        }

        async updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void> {
            // TODO
        }
    }
}