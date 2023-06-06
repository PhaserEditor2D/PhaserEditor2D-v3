/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class CutOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        protected async performModification() {

            this._editor.getClipboardManager().copy();

            const scene = this.getScene();

            const lists = this._editor.getScene().getObjectLists();

            // delete game objects

            for (const obj of this._editor.getSelectedGameObjects()) {

                const objES = obj.getEditorSupport();

                objES.destroy();
                lists.removeObjectById(objES.getId());
            }

            // delete plain objects

            const plainObjects = this._editor.getSelectedPlainObjects();

            if (plainObjects.length > 0) {

                scene.removePlainObjects(plainObjects);
            }

            // delete ObjectLists

            for (const objectList of this._editor.getSelectedLists()) {

                lists.removeListById(objectList.getId());
            }

            // delete prefab properties

            for (const prop of this._editor.getSelectedPrefabProperties()) {

                prop.getManager().deleteProperty(prop.getName());
            }

            // clear selection

            this._editor.setSelection([]);
        }
    }
}