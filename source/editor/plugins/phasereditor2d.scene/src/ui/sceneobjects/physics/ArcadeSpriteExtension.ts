namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeSpriteExtension extends BaseImageExtension {

        private static _instance = new ArcadeSpriteExtension();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super({
                    typeName: "ArcadeSprite",
                    phaserTypeName: "Phaser.Physics.Arcade.Sprite",
                    category: SCENE_OBJECT_ARCADE_CATEGORY,
                    icon: resources.getIconDescriptor(resources.ICON_SPRITE_TYPE)
            });
        }

        getCodeDOMBuilder(): ISceneGameObjectCodeDOMBuilder {

            return new ISceneGameObjectCodeDOMBuilder("sprite");
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new ArcadeSprite(scene, x, y, key || null, frame);
        }

        async collectExtraDataForCreateDefaultObject(editor: editor.SceneEditor, inReplaceTypeContext: boolean): Promise<ICreateExtraDataResult> {
            
            if (inReplaceTypeContext) {

                return { };
            }

            return this.collectTextureDataCreateDefaultObject(editor);
        }
    }
}