/// <reference path="./SceneObjectExtension.ts" />7

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageExtension extends SceneObjectExtension {

        constructor() {
            super({
                typeName: "Image",
                phaserTypeName: "Phaser.GameObjects.Image"
            });
        }

        async updateLoaderWithObjectData(args: UpdateLoaderWithObjectData) {

            const key = (args.data as sceneobjects.TextureData).textureKey;

            const finder = args.finder;

            const item = finder.findAssetPackItem(key);

            if (item) {

                await ImageExtension.addImageFramesToCache(args.scene, item);
            }
        }

        static async addImageFramesToCache(
            scene: GameScene, data: pack.core.AssetPackItem | pack.core.AssetPackImageFrame) {

            let imageFrameContainerPackItem: pack.core.ImageFrameContainerAssetPackItem = null;

            if (data instanceof pack.core.ImageFrameContainerAssetPackItem) {

                imageFrameContainerPackItem = data;

            } else if (data instanceof pack.core.AssetPackImageFrame) {

                imageFrameContainerPackItem = (data.getPackItem() as pack.core.ImageFrameContainerAssetPackItem);
            }

            if (imageFrameContainerPackItem !== null) {

                await imageFrameContainerPackItem.preload();

                await imageFrameContainerPackItem.preloadImages();

                imageFrameContainerPackItem.addToPhaserCache(scene.game);
            }
        }

        static isImageOrImageFrameAsset(data: any) {

            return data instanceof pack.core.AssetPackImageFrame || data instanceof pack.core.ImageAssetPackItem;
        }

        acceptsDropData(data: any): boolean {

            return ImageExtension.isImageOrImageFrameAsset(data);
        }

        createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject {

            let key: string;
            let frame: string | number;
            let baseLabel: string;

            if (args.asset instanceof pack.core.AssetPackImageFrame) {

                key = args.asset.getPackItem().getKey();
                frame = args.asset.getName();
                baseLabel = frame + "";

            } else if (args.asset instanceof pack.core.ImageAssetPackItem) {

                key = args.asset.getKey();
                frame = null;
                baseLabel = key;
            }

            const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);

            sprite.getEditorSupport().setLabel(args.nameMaker.makeName(baseLabel));
            sprite.getEditorSupport().getTextureSupport().setTexture(args.asset.getKey(), frame);

            return sprite;
        }

        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject {

            const sprite = this.createImageObject(args.scene, 0, 0, undefined);

            sprite.getEditorSupport().readJSON(args.data);

            return sprite;
        }

        private createImageObject(scene: GameScene, x: number, y: number, key: string, frame?: string | number) {

            const sprite = new sceneobjects.Image(this, scene, x, y, key, frame);

            sprite.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(sprite);

            return sprite;
        }
    }
}