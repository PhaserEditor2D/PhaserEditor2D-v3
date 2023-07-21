/// <reference path="./BaseImageExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageExtension extends BaseImageExtension {

        private static _instance;

        static getInstance() {
            return this._instance ?? (this._instance = new ImageExtension());
        }

        private constructor() {
            super({
                typeName: "Image",
                phaserTypeName: "Phaser.GameObjects.Image",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_IMAGE_TYPE)
            });
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new BaseImageCodeDOMBuilder("image");
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new sceneobjects.Image(scene, x, y, key || null, frame);
        }
    }
}