namespace phasereditor2d.scene.ui.sceneobjects {

    export class LayerExtension extends SceneGameObjectExtension {

        private static _instance: LayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new LayerExtension());
        }

        constructor() {
            super({
                category: SCENE_OBJECT_GROUPING_CATEGORY,
                icon: ScenePlugin.getInstance().getIconDescriptor(ICON_LAYER),
                phaserTypeName: "Phaser.GameObjects.Layer",
                typeName: "Layer"
            });
        }

        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            return null;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneGameObject {

            const container = this.createLayerObject(args.scene, []);

            container.getEditorSupport().readJSON(args.data as IContainerData);

            return container;
        }

        private createLayerObject(scene: Scene, list: sceneobjects.ISceneGameObject[]) {

            const layer = new sceneobjects.Layer(scene, list);

            layer.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(layer);

            return layer;
        }

        getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return ContainerExtension.getAssetsFromNestedData(args);
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            return [this.createLayerObject(args.scene, [])];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return LayerCodeDOMBuilder.getInstance();
        }
    }
}