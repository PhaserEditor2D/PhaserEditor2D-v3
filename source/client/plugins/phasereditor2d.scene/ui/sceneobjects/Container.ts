namespace phasereditor2d.scene.ui.sceneobjects {

    export class Container extends Phaser.GameObjects.Container implements SceneObject {

        private _editorSupport: EditorSupport;

        constructor(scene: GameScene, x: number, y: number, children: SceneObject[]) {
            super(scene, x, y, children);

            this._editorSupport = new EditorSupport(this);
        }

        getEditorSupport() {
            return this._editorSupport;
        }

        static add(scene: GameScene, x: number, y: number, list: SceneObject[]) {

            const container = new Container(scene, x, y, list);

            scene.sys.displayList.add(container);

            return container;
        }

        get list(): SceneObject[] {
            return super.list as any;
        }

        set list(list: SceneObject[]) {
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
        }

        readJSON(data: any) {

            json.ObjectComponent.read(this, data);

            json.VariableComponent.read(this, data);

            json.TransformComponent.read(this, data);

            // container

            const parser = new json.SceneParser(this.getEditorSupport().getScene());

            for (const objData of data.list) {

                const sprite = parser.createObject(objData);

                this.add(sprite);
            }
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {
            return getContainerScreenBounds(this, camera);
        }
    }
}