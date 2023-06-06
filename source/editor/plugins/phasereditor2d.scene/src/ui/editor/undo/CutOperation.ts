/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class CutOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        protected async performModification() {

            this._editor.getClipboardManager().copy();

            const scene  = this.getScene();

            const lists = this._editor.getScene().getObjectLists();

            for (const obj of this._editor.getSelection()) {

                if (sceneobjects.isGameObject(obj)) {

                    const sprite = obj as sceneobjects.ISceneGameObject;

                    sprite.getEditorSupport().destroy();
                    lists
                        .removeObjectById(sprite.getEditorSupport().getId());

                }
            }

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof sceneobjects.ObjectList) {

                    lists.removeListById(obj.getId());
                }
            }

            const plainObjects = this._editor.getSelectedPlainObjects();

            if (plainObjects.length > 0) {

                scene.removePlainObjects(plainObjects);
            }

            this._editor.setSelection([]);
        }
    }
}