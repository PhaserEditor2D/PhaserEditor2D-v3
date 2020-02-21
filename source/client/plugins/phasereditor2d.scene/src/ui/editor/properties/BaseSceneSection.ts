namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class BaseSceneSection<T> extends colibri.ui.controls.properties.PropertySection<T> {

        protected getHelp(key: string) {
            return "";
        }

        getEditor(): SceneEditor {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as SceneEditor;
        }

        protected getUndoManager() {

            return this.getEditor().getUndoManager();
        }
    }

}