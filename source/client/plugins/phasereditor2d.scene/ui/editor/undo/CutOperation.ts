/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class CutOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        performModification() {

            this._editor.getClipboardManager().copy();
            const lists = this._editor.getScene().getObjectLists();

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    const sprite = obj as sceneobjects.ISceneObject;

                    sprite.getEditorSupport().destroy();
                    lists
                        .removeObjectById(sprite.getEditorSupport().getId());

                } else if (obj instanceof sceneobjects.ObjectList) {

                    lists.removeListById(obj.getId());
                }
            }

            this._editor.setSelection([]);
        }
    }
}