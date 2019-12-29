/// <reference path="./SceneObjectExtension.ts" />

namespace phasereditor2d.scene.ui.extensions {

    export class ImageExtension extends SceneObjectExtension {

        constructor() {
            super({
                typeName: "Image",
                phaserTypeName: "Phaser.GameObjects.Image"
            });
        }

        static isImageOrImageFrameAsset(data: any) {

            return data instanceof pack.core.AssetPackImageFrame || data instanceof pack.core.ImageAssetPackItem;
        }

        acceptsDropData(data: any): boolean {

            return ImageExtension.isImageOrImageFrameAsset(data);
        }

        createSceneObjectWithAsset(args: CreateWithAssetArgs): gameobjects.EditorObject {

            let key: string;
            let frame: string;
            let baseLabel: string;

            if (args.asset instanceof pack.core.AssetPackImageFrame) {

                key = args.asset.getPackItem().getKey();
                frame = args.asset.getName();
                baseLabel = frame;

            } else if (args.asset instanceof pack.core.ImageAssetPackItem) {

                key = args.asset.getKey();
                frame = null;
                baseLabel = key;
            }

            const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);

            sprite.setEditorLabel(args.nameMaker.makeName(baseLabel));
            sprite.setEditorTexture(args.asset.getKey(), frame);

            return sprite;
        }

        createSceneObjectWithData(args: CreateWithDataArgs): gameobjects.EditorObject {

            const sprite = this.createImageObject(args.scene, 0, 0, undefined);

            sprite.readJSON(args.data);

            return sprite;
        }

        private createImageObject(scene: GameScene, x: number, y: number, key: string, frame?: string | number) {

            const sprite = new gameobjects.EditorImage(scene, 0, 0, key, frame);

            sprite.setEditorScene(scene);

            scene.sys.displayList.add(sprite);

            return sprite;
        }
    }
}