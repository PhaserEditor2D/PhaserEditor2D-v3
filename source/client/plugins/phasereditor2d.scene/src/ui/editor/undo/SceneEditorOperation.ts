namespace phasereditor2d.scene.ui.editor.undo {

    import ide = colibri.ui.ide;

    export abstract class SceneEditorOperation extends ide.undo.Operation {

        protected _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super();

            this._editor = editor;
        }

        getEditor() {
            return this._editor;
        }

        getScene() {
            return this._editor.getScene();
        }
    }

}