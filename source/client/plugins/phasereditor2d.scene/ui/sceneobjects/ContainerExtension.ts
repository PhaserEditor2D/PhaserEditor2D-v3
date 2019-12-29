/// <reference path="./SceneObjectExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerExtension extends SceneObjectExtension {

        constructor() {
            super({
                typeName: "Container",
                phaserTypeName: "Phaser.GameObjects.Container"
            });
        }

        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject {

            const container = this.createContainerObject(args.scene, 0, 0, []);

            container.getEditorSupport().readJSON(args.data);

            return container;
        }

        private createContainerObject(scene: GameScene, x: number, y: number, list: sceneobjects.SceneObject[]) {

            const container = new sceneobjects.Container(this, scene, x, y, list);

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