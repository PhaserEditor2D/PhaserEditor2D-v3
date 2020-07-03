namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class SnapshotOperation extends colibri.ui.ide.undo.Operation {

        private _editor: UserComponentsEditor;
        private _before: any;
        private _after: any;

        constructor(editor: UserComponentsEditor) {
            super();

            this._editor = editor;
        }

        executeOperation(action: () => void) {

            this._before = this._editor.getModel().toJSON();

            action();

            this._after = this._editor.getModel().toJSON();
        }

        private loadSnapshot(data: any) {

            this._editor.getModel().readJSON(data);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}