/// <reference path="./SceneObjectExtension.ts" />

namespace phasereditor2d.scene.ui.extensions {

    export class ContainerExtension extends SceneObjectExtension {

        constructor() {
            super({
                typeName: "Container",
                phaserTypeName: "Phaser.GameObjects.Container"
            });
        }

        createSceneObjectWithData(args: CreateWithDataArgs): gameobjects.EditorObject {

            const container = this.createContainerObject(args.scene, 0, 0, []);

            container.readJSON(args.data);

            return container;
        }

        private createContainerObject(scene: GameScene, x: number, y: number, list: gameobjects.EditorObject[]) {

            const container = new gameobjects.EditorContainer(scene, x, y, list);

            scene.sys.displayList.add(container);

            return container;
        }

        acceptsDropData(data: any): boolean {
            return false;
        }

        createSceneObjectWithAsset(args: CreateWithAssetArgs): gameobjects.EditorObject {
            return null;
        }
    }
}