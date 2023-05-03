namespace phasereditor2d.scene.ui.sceneobjects {

    import DepthMove = scene.ui.editor.undo.DepthMove;
    import SceneEditor = scene.ui.editor.SceneEditor;

    export class ListOrderOperation extends ListsSnapshotOperation {

        private _depthMove: DepthMove;

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

            for (const obj of sel) {

                //const parent = obj.getEditorSupport().getObjectParent();
                const siblings = obj.getParent().getItems();

                const index = siblings.indexOf(obj);

                const len = siblings.length;

                if (move === "Bottom" || move === "Down") {

                    if (index === len - 1) {

                        return false;
                    }

                } else { // Top || Up

                    if (index === 0) {

                        return false;
                    }
                }
            }

            return true;
        }

        private static sortedSelection(editor: SceneEditor) {

            const sel = editor.getSelectedListItems();

            sel.sort((a, b) => {

                const aa = a.getParent().getItems().indexOf(a);
                const bb = a.getParent().getItems().indexOf(b);

                return aa - bb;
            });

            return sel;
        }

        performChange(lists: ObjectLists): void {

            const editor = this.getEditor();

            const sel = ListOrderOperation.sortedSelection(editor);

            switch (this._depthMove) {

                case "Bottom":

                    for (const obj of sel) {

                        const siblings = obj.getParent().getItems();

                        Phaser.Utils.Array.BringToTop(siblings, obj);

                        obj.getParent().updateOrderIdsFromItems();
                    }

                    break;

                case "Top":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        const siblings = obj.getParent().getItems();

                        Phaser.Utils.Array.SendToBack(siblings, obj)

                        obj.getParent().updateOrderIdsFromItems();
                    }

                    break;

                case "Down":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        const siblings = obj.getParent().getItems();

                        Phaser.Utils.Array.MoveUp(siblings, obj);

                        obj.getParent().updateOrderIdsFromItems();
                    }

                    break;

                case "Up":

                    for (const obj of sel) {

                        const siblings = obj.getParent().getItems();

                        Phaser.Utils.Array.MoveDown(siblings, obj);

                        obj.getParent().updateOrderIdsFromItems();
                    }

                    break;
            }
        }
    }
}