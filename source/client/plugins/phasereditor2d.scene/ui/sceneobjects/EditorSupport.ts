namespace phasereditor2d.scene.ui.sceneobjects {

    export class EditorSupport {

        private _object: SceneObject;
        private _label: string;
        private _scene: GameScene;

        constructor(obj: SceneObject) {
            this._object = obj;
        }

        getObject() {
            return this._object;
        }

        getId() {
            return this._object.name;
        }

        setId(id: string) {
            this._object.name = id;
        }

        getLabel() {
            return this._label;
        }

        setLabel(label: string) {
            this._label = label;
        }

        getScene() {
            return this._scene;
        }

        setScene(scene: GameScene) {
            this._scene = scene;
        }
    }
}