namespace phasereditor2d.scene.ui.editor.undo {

    export class DeleteOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        performModification() {

            const editor = this._editor;
            const lists = editor.getScene().getObjectLists();

            for (const obj of editor.getSelectedGameObjects()) {

                obj.getEditorSupport().destroy();

                lists.removeObjectById(obj.getEditorSupport().getId());
            }

            for (const obj of editor.getSelectedLists()) {

                lists.removeListById(obj.getId());
            }

            editor.setSelection([]);
        }
    }
}