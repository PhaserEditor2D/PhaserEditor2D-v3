namespace phasereditor2d.scene.ui.editor.properties {

    export abstract class BaseSceneSection<T> extends colibri.ui.controls.properties.PropertySection<T> {

        protected getHelp(key: string) {
            return "";
        }

        protected getScene() {

            return this.getSelection()[0];
        }

        getEditor(): SceneEditor {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as SceneEditor;
        }
    }

}