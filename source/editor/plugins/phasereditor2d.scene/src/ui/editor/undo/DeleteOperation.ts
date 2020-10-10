namespace phasereditor2d.scene.ui.editor.undo {

    export class DeleteOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        protected async performModification() {

            const editor = this._editor;
            const scene = this._editor.getScene();
            const lists = scene.getObjectLists();

            for (const obj of editor.getSelectedGameObjects()) {

                obj.getEditorSupport().destroy();

                lists.removeObjectById(obj.getEditorSupport().getId());
            }

            for (const obj of editor.getSelectedLists()) {

                lists.removeListById(obj.getId());
            }

            scene.removePlainObjects(editor.getSelectedPlainObjects());

            editor.setSelection([]);
        }
    }
}