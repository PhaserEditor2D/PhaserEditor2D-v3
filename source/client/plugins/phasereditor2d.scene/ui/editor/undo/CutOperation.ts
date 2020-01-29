/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class CutOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        performModification() {

            this._editor.getClipboardManager().copy();

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    (obj as sceneobjects.ISceneObject).getEditorSupport().destroy();

                } else if (obj instanceof sceneobjects.ObjectList) {

                    this._editor.getScene().getObjectLists().remove(obj);
                }
            }

            this._editor.setSelection([]);
        }
    }
}