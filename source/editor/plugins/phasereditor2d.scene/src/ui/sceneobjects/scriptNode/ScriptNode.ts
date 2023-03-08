namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNode extends Phaser.GameObjects.GameObject implements ISceneGameObject {

        private _editorSupport: GameObjectEditorSupport<ScriptNode>;
        private _parent: ISceneGameObject | Phaser.GameObjects.DisplayList;

        constructor(scene: Scene) {
            super(scene, "ScriptNode");

            this._editorSupport = new ScriptNodeEditorSupport(scene, this);

            this._parent = scene.children;
        }

        willRender(camera: Phaser.Cameras.Scene2D.Camera): boolean {

            return false;
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        getParent() {

            return this._parent;
        }

        setParent(parent: ISceneGameObject) {

            this._parent = parent;
        }

        removeFromParent() {

            if (isGameObject(this._parent)) {

                (this._parent as ISceneGameObject).getEditorSupport().removeObjectChild(this);

            } else {

                (this.scene as Scene).removeGameObject(this);
            }

            this._parent = undefined;
        }
    }
}