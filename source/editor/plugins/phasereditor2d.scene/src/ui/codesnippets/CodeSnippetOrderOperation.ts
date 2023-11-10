/// <reference path="./CodeSnippetsSnapshotOperation.ts" />
namespace phasereditor2d.scene.ui.codesnippets {

    import SceneEditor = editor.SceneEditor;
    import DepthMove = editor.undo.DepthMove;

    export class CodeSnippetOrderOperation extends CodeSnippetsSnapshotOperation {

        private _depthMove: editor.undo.DepthMove;

        constructor(editor: SceneEditor, depthMove: DepthMove) {
            super(editor);

            this._depthMove = depthMove;
        }

        static allow(editor: SceneEditor, move: DepthMove) {

            // sort the selection and filter off non-game-objects
            let sel = this.sortedSelection(editor);

            // if the sorted selection contains all the selected objects
            if (sel.length !== editor.getSelection().length) {

                return false;
            }

            const siblings = editor.getScene().getCodeSnippets().getSnippets();

            for (const obj of sel) {

                const index = siblings.indexOf(obj);

                let bottomIndex = 0;
                const len = siblings.length;

                if (move === "Bottom" || move === "Down") {

                    if (index === len - 1) {

                        return false;
                    }

                } else { // Top || Up

                    if (index === bottomIndex) {

                        return false;
                    }
                }
            }

            return true;
        }

        protected async performModification() {

            const editor = this.getEditor();

            const sel = CodeSnippetOrderOperation.sortedSelection(editor);

            const siblings = editor.getScene().getCodeSnippets().getSnippets();

            switch (this._depthMove) {

                case "Bottom":

                    for (const obj of sel) {

                        Phaser.Utils.Array.BringToTop(siblings, obj);
                    }

                    break;

                case "Top":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        Phaser.Utils.Array.SendToBack(siblings, obj);
                    }

                    break;

                case "Down":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        Phaser.Utils.Array.MoveUp(siblings, obj);
                    }

                    break;

                case "Up":

                    for (const obj of sel) {

                        Phaser.Utils.Array.MoveDown(siblings, obj);
                    }

                    break;
            }

            this.getEditor().repaint();
        }

        private static sortedSelection(editor: SceneEditor) {

            const sel = editor.getSelectedCodeSnippets();

            const siblings = editor.getScene().getCodeSnippets().getSnippets();

            sel.sort((a, b) => {

                const aa = siblings.indexOf(a);
                const bb = siblings.indexOf(b);

                return aa - bb;
            });

            return sel;
        }
    }
}