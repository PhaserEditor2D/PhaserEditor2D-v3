/// <reference path="./LoaderUpdaterExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageLoaderExtension extends LoaderUpdaterExtension {

        clearCache(scene: BaseScene): void {

            const list = scene.textures.list;

            for (const key of scene.textures.getTextureKeys()) {

                const texture = list[key];

                texture.destroy();

                delete list[key];
            }
        }

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.ImageFrameContainerAssetPackItem
                || asset instanceof pack.core.AsepriteAssetPackItem
                || asset instanceof pack.core.AssetPackImageFrame
                || asset instanceof pack.core.AnimationConfigInPackItem;
        }

        async updateLoader(scene: BaseScene, asset: any) {

            if (asset instanceof pack.core.AnimationConfigInPackItem) {

                for (const animFrame of asset.getFrames()) {

                    const textureFrame = animFrame.getTextureFrame();

                    if (textureFrame) {

                        await this.updateLoader(scene, textureFrame);
                    }
                }
            }

            let framesContainer: pack.core.ImageFrameContainerAssetPackItem | pack.core.AsepriteAssetPackItem = null;

            if (asset instanceof pack.core.ImageFrameContainerAssetPackItem
                || asset instanceof pack.core.AsepriteAssetPackItem) {

                framesContainer = asset;

            } else if (asset instanceof pack.core.AssetPackImageFrame) {

                framesContainer = (asset.getPackItem() as pack.core.ImageFrameContainerAssetPackItem);
            }

            if (framesContainer !== null) {

                await framesContainer.preload();

                await framesContainer.preloadImages();

                framesContainer.addToPhaserCache(scene.game, scene.getPackCache());
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