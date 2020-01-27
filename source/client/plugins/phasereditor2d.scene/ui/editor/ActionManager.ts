namespace phasereditor2d.scene.ui.editor {

    export class ActionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            this._editor = editor;
        }

        deleteObjects() {

            const operations: colibri.ui.ide.undo.Operation[] = [];

            const objects = this._editor.getSelectedGameObjects();

            const lists = this._editor.getSelection()
                .filter(obj => obj instanceof sceneobjects.ObjectList);

            if (lists.length > 0) {

                operations.push(new sceneobjects.RemoveObjectListOperation(this._editor, lists));
            }

            if (objects.length > 0) {

                operations.push(new undo.RemoveObjectsOperation(this._editor, objects));
            }

            // create the undo-operation before destroy the objects

            this._editor.getUndoManager().add(
                new colibri.ui.ide.undo.MultiOperation(operations)
            );

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

            const container = sceneobjects.ContainerExtension.getInstance()
                .createContainerObjectWithChildren(this._editor.getScene(), sel);

            this._editor.getUndoManager().add(new undo.JoinObjectsInContainerOperation(this._editor, container));

            this._editor.setSelection([container]);

            this._editor.refreshOutline();
            this._editor.setDirty(true);
            this._editor.repaint();
        }
    }
}