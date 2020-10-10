namespace phasereditor2d.scene.ui.editor.undo {

    export class DeleteOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        protected async performModification(): Promise<boolean | void> {

            const editor = this._editor;
            const scene = this._editor.getScene();
            const lists = scene.getObjectLists();

            let refresh = false;

            for (const obj of editor.getSelectedGameObjects()) {

                const result = obj.getEditorSupport().destroy();
                refresh = refresh || result === true;

                lists.removeObjectById(obj.getEditorSupport().getId());
            }

            for (const obj of editor.getSelectedLists()) {

                lists.removeListById(obj.getId());
            }

            scene.removePlainObjects(editor.getSelectedPlainObjects());

            editor.setSelection([]);

            return refresh;
        }
    }
}