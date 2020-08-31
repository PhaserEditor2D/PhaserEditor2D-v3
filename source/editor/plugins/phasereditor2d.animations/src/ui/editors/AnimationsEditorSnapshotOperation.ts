namespace phasereditor2d.animations.ui.editors {

    declare type JSONAnimations = Phaser.Types.Animations.JSONAnimations;

    export class AnimationsEditorSnapshotOperation extends colibri.ui.ide.undo.Operation {

        private _before: JSONAnimations;
        private _after: JSONAnimations;
        private _editor: AnimationsEditor;
        private _useAnimationIndexAsKey: boolean;

        constructor(editor: AnimationsEditor, before: JSONAnimations, after: JSONAnimations, useAnimationIndexAsKey: boolean) {
            super();

            this._editor = editor;
            this._before = before;
            this._after = after;
            this._useAnimationIndexAsKey = useAnimationIndexAsKey;
        }

        async execute() {

            await this.loadSnapshot(this._after);
        }

        static takeSnapshot(editor: AnimationsEditor) {

            return editor.getScene().anims.toJSON();
        }

        private async loadSnapshot(data: JSONAnimations) {

            this._editor.setDirty(true);

            await this._editor.reset(data, this._useAnimationIndexAsKey);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}