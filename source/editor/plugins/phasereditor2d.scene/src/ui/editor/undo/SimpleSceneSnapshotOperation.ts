namespace phasereditor2d.scene.ui.editor.undo {

    export class SimpleSceneSnapshotOperation extends SceneSnapshotOperation {

        private _action: () => void;

        constructor(editor: SceneEditor, action: () => void) {
            super(editor);

            this._action = action;
        }

        protected performModification() {

            this._action();
        }
    }
}