namespace phasereditor2d.animations.ui.editors {

    declare type JSONAnimations = Phaser.Types.Animations.JSONAnimations;

    export class AnimationsEditorSnapshotOperation extends colibri.ui.ide.undo.Operation {

        private _before: JSONAnimations;
        private _after: JSONAnimations;
        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor, before: JSONAnimations, after: JSONAnimations) {
            super();

            this._editor = editor;
            this._before = before;
            this._after = after;
        }

        async execute() {

            this.loadSnapshot(this._after);
        }

        static takeSnapshot(editor: AnimationsEditor) {

            return editor.getScene().anims.toJSON();
        }

        private loadSnapshot(data: JSONAnimations) {

            this._editor.reset(data);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}