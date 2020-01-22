namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteExtension extends BaseImageExtension {

        private static _instance = new TileSpriteExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.TileSprite",
                typeName: "TileSprite"
            });
        }

        getCodeDOMBuilder(): ObjectCodeDOMBuilder {

            return new TileSpriteCodeDOMBuilder();
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneObject {

            if (key) {

                return new TileSprite(scene, x, y, 0, 0, key, frame);
            }

            return new TileSprite(scene, x, y, 64, 64, null, null);
        }
    }
}