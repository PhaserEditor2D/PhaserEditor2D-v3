namespace phasereditor2d.scene.ui.editor.undo {

    export class SimpleSceneSnapshotOperation extends SceneSnapshotOperation {

        private _action: () => void;

        constructor(editor: SceneEditor, action: () => void) {
            super(editor);

            this._action = action;
        }

        protected async performModification() {

            this._action();

            delete this._action;
        }
    }
}