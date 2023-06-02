namespace phasereditor2d.scene.ui.editor.undo {

    export class PlainObjectOrderOperation extends SceneSnapshotOperation {

        private _depthMove: DepthMove;

        constructor(editor: SceneEditor, depthMove: DepthMove) {
            super(editor);

            this._depthMove = depthMove;
        }

        private static getSibling(editor: SceneEditor, obj: sceneobjects.IScenePlainObject) {

            const objES = obj.getEditorSupport();

            const category = objES.getExtension().getCategory();

            const siblings = editor.getScene().getPlainObjectsByCategory(category);

            return siblings;
        }

        static allow(editor: SceneEditor, move: DepthMove) {

            // sort the selection and filter off non-game-objects
            let sel = this.sortedSelection(editor);

            // if the sorted selection contains all the selected objects
            if (sel.length !== editor.getSelection().length) {

                return false;
            }

            for (const obj of sel) {

                const siblings = this.getSibling(editor, obj);

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

            const sel = PlainObjectOrderOperation.sortedSelection(editor);

            const plainObjects = editor.getScene().getPlainObjects();

            switch (this._depthMove) {

                case "Bottom":

                    for (const obj of sel) {

                        const siblings = PlainObjectOrderOperation.getSibling(editor, obj);

                        const start = plainObjects.indexOf(siblings[0]);
                        
                        Phaser.Utils.Array.BringToTop(siblings, obj);

                        plainObjects.splice(start, siblings.length, ...siblings);
                    }

                    break;

                case "Top":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        const siblings = PlainObjectOrderOperation.getSibling(editor, obj);

                        const start = plainObjects.indexOf(siblings[0]);

                        Phaser.Utils.Array.SendToBack(siblings, obj);

                        plainObjects.splice(start, siblings.length, ...siblings);
                    }

                    break;

                case "Down":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        Phaser.Utils.Array.MoveUp(plainObjects, obj);
                    }

                    break;

                case "Up":

                    for (const obj of sel) {

                        Phaser.Utils.Array.MoveDown(plainObjects, obj);
                    }

                    break;
            }

            this.getEditor().repaint();
        }

        private static sortedSelection(editor: SceneEditor) {

            const sel = editor.getSelectedPlainObjects();

            const plainObjects = editor.getScene().getPlainObjects();

            sel.sort((a, b) => {

                const aa = plainObjects.indexOf(a);
                const bb = plainObjects.indexOf(b);

                return aa - bb;
            });

            return sel;
        }
    }
}