
namespace phasereditor2d.scene.ui.sceneobjects {

    export class TrimContainerOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            for (const obj of this._editor.getSelectedGameObjects()) {

                const container = obj as sceneobjects.Container;

                container.getEditorSupport().trim();
            }

            this.getEditor().dispatchSelectionChanged();
        }
    }
}