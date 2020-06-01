/// <reference path="../undo/SceneEditorOperation.ts" />

namespace phasereditor2d.scene.ui.editor.properties {

    export class ChangePrefabPropertiesOperation extends undo.SceneEditorOperation {
        private _before: any;
        private _after: any;

        constructor(editor: SceneEditor, before: any, after: any) {
            super(editor);

            this._before = before;
            this._after = after;
        }

        static snapshot(editor: SceneEditor) {

            const data = []

            editor.getScene().getPrefabUserProperties().writeJSON(data);

            return data;
        }

        private load(data: any) {

            this.getEditor().getScene().getPrefabUserProperties().readJSON(data);
            this.getEditor().setDirty(true);
            this.getEditor().dispatchSelectionChanged();
        }

        undo(): void {
            this.load(this._before);
        }

        redo(): void {
            this.load(this._after);
        }
    }
}