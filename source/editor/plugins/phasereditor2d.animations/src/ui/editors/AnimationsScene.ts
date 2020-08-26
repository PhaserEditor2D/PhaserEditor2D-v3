namespace phasereditor2d.animations.ui.editors {

    export class AnimationsScene extends scene.ui.BaseScene {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {
            super("AnimationsScene");

            this._editor = editor;
        }

        createSceneMaker(): scene.ui.BaseSceneMaker {

            return new AnimationsSceneMaker(this);
        }
    }
}