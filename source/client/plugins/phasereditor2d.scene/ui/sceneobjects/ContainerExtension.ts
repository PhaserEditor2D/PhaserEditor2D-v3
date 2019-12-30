/// <reference path="./SceneObjectExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ContainerData extends json.ObjectData {

        list: json.ObjectData[];
    }

    export class ContainerExtension extends SceneObjectExtension {

        constructor() {
            super({
                typeName: "Container",
                phaserTypeName: "Phaser.GameObjects.Container"
            });
        }

        async getAssetsFromObjectData(args: GetAssetsFromObjectArgs) {

            const list = [];

            const containerData = args.data as ContainerData;

            for (const objData of containerData.list) {

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(objData.type);

                if (ext) {

                    const list2 = await ext.getAssetsFromObjectData({
                        data: objData,
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

            container.getEditorSupport().readJSON(args.data as ContainerData);

            return container;
        }

        private createContainerObject(scene: GameScene, x: number, y: number, list: sceneobjects.SceneObject[]) {

            const container = new sceneobjects.Container(this, scene, x, y, list);

            container.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(container);

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