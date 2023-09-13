namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {

            const spineAtlasCache = scene.cache.custom["esotericsoftware.spine.atlas.cache"];
            const spineSkeletonCache = scene.cache.custom["esotericsoftware.spine.skeletonFile.cache"];

            const caches = [
                scene.cache.json,
                scene.cache.binary,
                spineAtlasCache,
                spineSkeletonCache]
                .filter(c => Boolean(c));

            for (const cache of caches) {

                const keys = cache.getKeys();

                for (const key of keys) {

                    cache.remove(key);
                }
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.SpineAssetPackItem
                || asset instanceof pack.core.SpineAtlasAssetPackItem;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            const item = asset as pack.core.AssetPackItem;

            await item.preload();

            item.addToPhaserCache(scene.game, scene.getPackCache());
        }

        async updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void> {

            const serializer = new core.json.Serializer(data);
            const type = serializer.getType();

            if (type === SpineExtension.getInstance().getTypeName()) {

                const dataKey = serializer.read("dataKey");
                const atlasKey = serializer.read("atlerKey");

                const finder = scene.getMaker().getPackFinder();

                for (const key of [dataKey, atlasKey]) {

                    if (key) {

                        const asset = finder.findAssetPackItem(key);

                        if (asset && this.acceptAsset(asset)) {

                            await this.updateLoader(scene, asset);
                        }
                    }
                }
            }
        }
    }
}