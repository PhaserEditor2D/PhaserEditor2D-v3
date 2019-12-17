/// <reference path="./EditorObjectMixin.ts" />

namespace phasereditor2d.scene.ui.gameobjects {

    export class EditorContainer extends Phaser.GameObjects.Container implements EditorObject {

        static add(scene: Phaser.Scene, x: number, y: number, list: EditorObject[]) {

            const container = new EditorContainer(scene, x, y, list);

            scene.sys.displayList.add(container);

            return container;
        }

        get list(): EditorObject[] {
            return <any>super.list;
        }

        set list(list : EditorObject[]) {
            super.list = list;
        }

        writeJSON(data: any) {

            data.type = "Container";

            json.ObjectComponent.write(this, data);

            json.VariableComponent.write(this, data);

            json.TransformComponent.write(this, data);

            // container

            data.list = this.list.map(obj => {

                const objData = {};

                obj.writeJSON(objData);

                return objData;
            });
        };

        readJSON(data: any) {

            json.ObjectComponent.read(this, data);

            json.VariableComponent.read(this, data);

            json.TransformComponent.read(this, data);

            // container

            const parser = new json.SceneParser(this.getEditorScene());

            for(const objData of data.list) {

                const sprite = parser.createObject(objData);    

                this.add(sprite);
            }
        };

        getScreenBounds(camera : Phaser.Cameras.Scene2D.Camera) {
            return getContainerScreenBounds(this, camera);
        }
    }

    export interface EditorContainer extends EditorObjectMixin {
        
    }

    colibri.lang.applyMixins(EditorContainer, [EditorObjectMixin]);
}