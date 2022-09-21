namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImageExtension extends BaseImageExtension {

        private static _instance = new ArcadeImageExtension();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super({
                    typeName: "ArcadeImage",
                    phaserTypeName: "Phaser.Physics.Arcade.Image",
                    category: SCENE_OBJECT_ARCADE_CATEGORY,
                    icon: ScenePlugin.getInstance().getIconDescriptor(ICON_IMAGE_TYPE)
            });
        }

        getCodeDOMBuilder(): ArcadeImageCodeDOMBuilder {

            return new ArcadeImageCodeDOMBuilder();
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new ArcadeImage(scene, x, y, key || null, frame);
        }
    }
}