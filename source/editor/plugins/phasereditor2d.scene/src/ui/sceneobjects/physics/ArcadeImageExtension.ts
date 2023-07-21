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
                icon: resources.getIconDescriptor(resources.ICON_IMAGE_TYPE)
            });
        }

        getCodeDOMBuilder(): ISceneGameObjectCodeDOMBuilder {

            return new ISceneGameObjectCodeDOMBuilder("image");
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new ArcadeImage(scene, x, y, key || null, frame);
        }

        async collectExtraDataForCreateDefaultObject(editor: editor.SceneEditor, inReplaceTypeContext: boolean): Promise<ICreateExtraDataResult> {

            if (inReplaceTypeContext) {

                return { };
            }

            return this.collectTextureDataCreateDefaultObject(editor);
        }
    }
}