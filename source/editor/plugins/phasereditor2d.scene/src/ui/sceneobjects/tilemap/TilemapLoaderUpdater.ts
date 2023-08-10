namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {

            const keys = scene.cache.tilemap.getKeys();

            for (const key of keys) {

                scene.cache.tilemap.remove(key);
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.TilemapTiledJSONAssetPackItem;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            const item = asset as pack.core.TilemapTiledJSONAssetPackItem;

            await item.preload();

            item.addToPhaserCache(scene.game, scene.getPackCache());
        }

        async updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void> {
            // nothing
        }
    }
}