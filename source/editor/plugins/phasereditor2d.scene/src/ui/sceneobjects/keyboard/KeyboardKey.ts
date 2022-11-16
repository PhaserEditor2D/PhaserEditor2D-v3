namespace phasereditor2d.scene.ui.sceneobjects {

    export class KeyboardKey implements IScenePlainObject {

        public keyCode: string;
        private _editorSupport: KeyboardKeyEditorSupport;

        constructor(scene: Scene, keyCode: string = "SPACE") {

            this.keyCode = keyCode;

            this._editorSupport = new KeyboardKeyEditorSupport(scene, this);
        }
       
        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}