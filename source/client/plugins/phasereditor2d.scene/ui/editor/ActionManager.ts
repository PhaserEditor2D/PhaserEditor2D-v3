namespace phasereditor2d.scene.ui.editor {

    export class ActionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            this._editor = editor;
        }

        deleteObjects() {
            const objects = this._editor.getSelectedGameObjects();

            // create the undo-operation before destroy the objects
            this._editor.getUndoManager().add(new undo.RemoveObjectsOperation(this._editor, objects));

            for (const obj of objects) {
                (<Phaser.GameObjects.GameObject>obj).destroy();
            }

            this._editor.refreshOutline();
            this._editor.getSelectionManager().refreshSelection();
            this._editor.setDirty(true);
            this._editor.repaint();
        }

        joinObjectsInContainer() {

            const sel = this._editor.getSelectedGameObjects();

            for (const obj of sel) {
                if (obj instanceof Phaser.GameObjects.Container || obj.parentContainer) {
                    alert("Nested containers are not supported");
                    return;
                }
            }

            const container = this._editor.getSceneMaker().createContainerWithObjects(sel);

            this._editor.getUndoManager().add(new undo.JoinObjectsInContainerOperation(this._editor, container));

            this._editor.setSelection([container]);

            this._editor.refreshOutline();
            this._editor.setDirty(true);
            this._editor.repaint();

        }

    }

}