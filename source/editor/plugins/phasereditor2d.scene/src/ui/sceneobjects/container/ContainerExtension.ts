namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class ContainerExtension extends SceneGameObjectExtension {

        private static _instance: ContainerExtension;

        static getInstance() {
            return this._instance || (this._instance = new ContainerExtension());
        }

        private constructor() {
            super({
                typeName: "Container",
                phaserTypeName: "Phaser.GameObjects.Container",
                category: SCENE_OBJECT_GROUPING_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_GROUP)
            });
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return ContainerCodeDOMBuilder.getInstance();
        }

        static async getAssetsFromNestedData(args: IGetAssetsFromObjectArgs) {

            const list = [];

            const { children } = GameObjectEditorSupport.buildRawChildrenData(args.serializer.getData());

            for (const objData of children) {

                const ser = args.serializer.getSerializer(objData);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                if (ext) {

                    const list2 = await ext.getAssetsFromObjectData({
                        serializer: ser,
                        scene: args.scene,
                        finder: args.finder
                    });

                    list.push(...list2);
                }
            }

            return list;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs) {

            return ContainerExtension.getAssetsFromNestedData(args);
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            return [this.createContainerObject(args.scene, 0, 0, [])];
        }

        createGameObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneGameObject {

            const container = this.createContainerObject(args.scene, 0, 0, []);

            container.getEditorSupport().readJSON(args.data);

            return container;
        }

        private createContainerObject(scene: Scene, x: number, y: number, list: sceneobjects.ISceneGameObject[]) {

            const container = new sceneobjects.Container(scene, x, y, list);

            container.getEditorSupport().setScene(scene);

            scene.addGameObject(container);

            return container;
        }

        createContainerObjectWithChildren(
            scene: Scene, objectList: sceneobjects.ISceneGameObject[]): sceneobjects.Container {

            const container = this.createContainerObject(scene, 0, 0, objectList);

            const name = scene.makeNewName("container");

            container.getEditorSupport().setLabel(name);

            return container;
        }

        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneGameObject {

            return null;
        }
    }
}