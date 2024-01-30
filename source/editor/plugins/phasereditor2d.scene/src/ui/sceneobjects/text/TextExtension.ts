namespace phasereditor2d.scene.ui.sceneobjects {

    export class TextExtension extends SceneGameObjectExtension {

        private static _instance = new TextExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.Text",
                typeName: "Text",
                category: SCENE_OBJECT_TEXT_CATEGORY,
                icon:  resources.getIconDescriptor(resources.ICON_TEXT_TYPE)
            });
        }

        acceptsDropData(data: any): boolean {
            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {
            return null;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const text = new Text(args.scene, args.x, args.y, "New text", {});

            return [text];
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const text = new Text(args.scene, 0, 0, "", {});

            text.getEditorSupport().readJSON(args.data);

            return text;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

           // Maybe it contains FX objects depending on textures
           const childrenAssets = await ContainerExtension.getAssetsFromNestedData(args);

           return childrenAssets;
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new TextCodeDOMBuilder();
        }
    }
}