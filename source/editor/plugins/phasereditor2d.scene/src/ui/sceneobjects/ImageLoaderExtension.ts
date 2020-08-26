/// <reference path="./LoaderUpdaterExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageLoaderUpdater extends LoaderUpdaterExtension {

        clearCache(game: Phaser.Game): void {

            const list = game.textures.list;

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
    }
}