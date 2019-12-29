namespace phasereditor2d.scene.ui.sceneobjects {

    export class Container extends Phaser.GameObjects.Container implements SceneObject {

        private _editorSupport: ContainerSupport;

        constructor(extension: ContainerExtension, scene: GameScene, x: number, y: number, children: SceneObject[]) {
            super(scene, x, y, children);

            this._editorSupport = new ContainerSupport(extension, this);
        }

        getEditorSupport() {
            return this._editorSupport;
        }

        get list(): SceneObject[] {
            return super.list as any;
        }

        set list(list: SceneObject[]) {
            super.list = list;
        }

        writeJSON(data: any) {

            this._editorSupport.writeJSON(data);

            // container

            data.list = this.list.map(obj => {

                const objData = {};

                obj.writeJSON(objData);

                return objData;
            });
        }

        readJSON(data: any) {

            this._editorSupport.readJSON(data);

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