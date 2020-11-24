namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteExtension extends BaseImageExtension {

        private static _instance = new SpriteExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.Sprite",
                typeName: "Sprite",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: ScenePlugin.getInstance().getIconDescriptor(ICON_SPRITE_TYPE)
            });
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new BaseImageCodeDOMBuilder("sprite");
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new Sprite(scene, x, y, key || null, frame);
        }
    }
}