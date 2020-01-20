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
                phaserTypeName: "Phaser.GameObjects.Image"
            });
        }

        getCodeDOMBuilder(): ObjectCodeDOMBuilder {

            return new BaseImageCodeDOMBuilder("image");
        }

        protected newObject(scene: Scene, key?: string, frame?: string | number): ISceneObject {

            return new sceneobjects.Image(scene, 0, 0, key || null, frame);
        }
    }
}