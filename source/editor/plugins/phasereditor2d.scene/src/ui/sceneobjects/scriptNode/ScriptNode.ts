namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNode extends Phaser.GameObjects.GameObject implements ISceneGameObject {

        private _editorSupport: ScriptNodeEditorSupport;
        private _parent: ISceneGameObject | Phaser.GameObjects.DisplayList;

        constructor(scene: Scene) {
            super(scene, "ScriptNode");

            this._editorSupport = new ScriptNodeEditorSupport(scene, this);

            this._parent = scene.children;
        }

        getParentDisplayObject() {

            if (this._parent) {

                if (this._parent instanceof ScriptNode) {

                    return this._parent.getParentDisplayObject();

                } else if (isGameObject(this._parent)) {

                    return this._parent;
                }
            }

            return undefined;
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