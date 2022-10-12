namespace phasereditor2d.scene.ui.sceneobjects {

    export class Collider implements IScenePlainObject {

        public object1 = "";
        public object2 = "";
        public overlapOnly = false;
        public collideCallback = "";
        public processCallback = "";
        public callbackContext = ""

        private _editorSupport: ColliderEditorSupport;

        constructor(scene: Scene) {

            this._editorSupport = new ColliderEditorSupport(scene, this);
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}