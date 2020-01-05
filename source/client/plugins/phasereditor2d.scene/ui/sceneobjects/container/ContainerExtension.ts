namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;
    import code = core.code;

    export interface ContainerData extends json.ObjectData {

        list: json.ObjectData[];
    }

    export class ContainerExtension extends SceneObjectExtension {

        private static _instance: ContainerExtension;

        static getInstance() {
            return this._instance || (this._instance = new ContainerExtension());
        }

        private constructor() {
            super({
                typeName: "Container",
                phaserTypeName: "Phaser.GameObjects.Container"
            });
        }

        buildNewPrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs) {

            args.methodCallDOM.arg(args.sceneExpr);
        }

        buildAddObjectCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("container", args.gameObjectFactoryExpr);

            return call;
        }

        async getAssetsFromObjectData(args: GetAssetsFromObjectArgs) {

            const list = [];

            const children = args.serializer.read("list", []) as json.ObjectData[];

            for (const objData of children) {

                const ser = args.serializer.getSerializer(objData);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

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

        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject {

            const container = this.createContainerObject(args.scene, 0, 0, []);

            container.getEditorSupport().readJSON(args.scene.getMaker().getSerializer(args.data));

            return container;
        }

        private createContainerObject(scene: GameScene, x: number, y: number, list: sceneobjects.SceneObject[]) {

            const container = new sceneobjects.Container(scene, x, y, list);

            container.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(container);

            return container;
        }

        createContainerObjectWithChildren(
            scene: GameScene, objectList: sceneobjects.SceneObject[]): sceneobjects.Container {

            const container = this.createContainerObject(scene, 0, 0, objectList);

            const name = scene.makeNewName("container");

            container.getEditorSupport().setLabel(name);

            return container;
        }

        acceptsDropData(data: any): boolean {
            return false;
        }

        createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject {
            return null;
        }
    }
}