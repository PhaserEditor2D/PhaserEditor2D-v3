namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNode extends Phaser.GameObjects.GameObject implements ISceneGameObject{

        private _editorSupport: GameObjectEditorSupport<ScriptNode>;

        constructor(scene: Scene) {
            super(scene, "ScriptNode");

            this._editorSupport = new ScriptNodeEditorSupport(scene, this);
        }

        willRender(camera: Phaser.Cameras.Scene2D.Camera): boolean {
            
            return false;
        }

        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}