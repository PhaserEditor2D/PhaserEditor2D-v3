namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleExtension extends SceneGameObjectExtension {

        private static _instance: RectangleExtension;

        static getInstance() {
            return this._instance ? this._instance : (this._instance = new RectangleExtension());
        }

        constructor() {
            super({
                icon: resources.getIconDescriptor(resources.ICON_GROUP),
                phaserTypeName: "Phaser.GameObjects.Rectangle",
                category: SCENE_OBJECT_SHAPE_CATEGORY,
                typeName: "Rectangle"
            });
        }

        getBlockCellRenderer() {

            return RectangleBlockCellRenderer.getInstance();
        }


        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            // not supported

            return null;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const obj = new Rectangle(args.scene, 0, 0);

            obj.getEditorSupport().readJSON(args.data as any);

            return obj;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            const obj = new Rectangle(args.scene, args.x, args.y);

            obj.isFilled = true;

            return [obj];
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return [];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new RectangleCodeDOMBuilder();
        }
    }
}