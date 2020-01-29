namespace phasereditor2d.scene.ui.editor {

    // TODO: please, deprecate this! Migrate this to the operations.
    export class ActionManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            this._editor = editor;
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