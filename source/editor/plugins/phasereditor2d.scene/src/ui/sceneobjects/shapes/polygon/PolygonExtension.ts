namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonExtension extends SceneGameObjectExtension {

        private static _instance: PolygonExtension;

        static getInstance() {
            return this._instance ? this._instance : (this._instance = new PolygonExtension());
        }

        constructor() {
            super({
                icon: resources.getIconDescriptor(resources.ICON_GROUP),
                phaserTypeName: "Phaser.GameObjects.Polygon",
                typeName: "Polygon",
                category: SCENE_OBJECT_SHAPE_CATEGORY,
            });
        }

        getBlockCellRenderer() {

            return PolygonBlockCellRenderer.getInstance();
        }


        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            // not supported

            return null;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const obj = new Polygon(args.scene, 0, 0, Polygon.DEFAULT_POINTS);

            obj.getEditorSupport().readJSON(args.data as any);

            return obj;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            const obj = new Polygon(args.scene, args.x, args.y, Polygon.DEFAULT_POINTS);

            obj.isFilled = true;

            return [obj];
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return [];
        }

        getCodeDOMBuilder() {

            return new PolygonCodeDOMBuilder();
        }
    }
}