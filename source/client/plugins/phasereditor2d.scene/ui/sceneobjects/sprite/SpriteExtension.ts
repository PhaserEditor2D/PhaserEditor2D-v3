namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteExtension extends BaseImageExtension {

        private static _instance = new SpriteExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.Sprite",
                typeName: "Sprite"
            });
        }

        getCodeDOMBuilder(): ObjectCodeDOMBuilder {
            return new BaseImageCodeDOMBuilder("sprite");
        }

        protected newObject(scene: Scene, key?: string, frame?: string | number): ISceneObject {
            return new Sprite(scene, 0, 0, key, frame);
        }
    }
}