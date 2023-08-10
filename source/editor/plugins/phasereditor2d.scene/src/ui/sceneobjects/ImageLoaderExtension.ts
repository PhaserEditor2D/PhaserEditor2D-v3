/// <reference path="./LoaderUpdaterExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageLoaderExtension extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {

            const list = scene.textures.list;

            for (const key in list) {

                if (key === "__DEFAULT" || key === "__MISSING") {

                    continue;
                }

                if (list.hasOwnProperty(key)) {

                    const texture = list[key];

                    texture.destroy();

                    delete list[key];
                }
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.ImageFrameContainerAssetPackItem
                || asset instanceof pack.core.AssetPackImageFrame;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            let imageFrameContainerPackItem: pack.core.ImageFrameContainerAssetPackItem = null;

            if (asset instanceof pack.core.ImageFrameContainerAssetPackItem) {

                imageFrameContainerPackItem = asset;

            } else if (asset instanceof pack.core.AssetPackImageFrame) {

                imageFrameContainerPackItem = (asset.getPackItem() as pack.core.ImageFrameContainerAssetPackItem);
            }

            if (imageFrameContainerPackItem !== null) {

                await imageFrameContainerPackItem.preload();

                await imageFrameContainerPackItem.preloadImages();

                imageFrameContainerPackItem.addToPhaserCache(scene.game, scene.getPackCache());
            }
        }

        async updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void> {

            const serializer = new core.json.Serializer(data);

            const textureKeys = serializer.read("texture") as ITextureKeys;

            if (textureKeys) {

                const { key, frame } = textureKeys;

                if (key) {

                    const finder = scene.getMaker().getPackFinder();

                    const asset = finder.getAssetPackItemImage(key, frame);

                    if (asset) {

                        if (this.acceptAsset(asset)) {

                            await this.updateLoader(scene, asset);
                        }
                    }
                }
            }
        }
    }
}