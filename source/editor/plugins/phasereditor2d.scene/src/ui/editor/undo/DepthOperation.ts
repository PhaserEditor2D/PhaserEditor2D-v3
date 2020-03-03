namespace phasereditor2d.scene.ui.editor.undo {

    export declare type DepthMove = "Up" | "Down" | "Top" | "Bottom";

    export class DepthOperation extends SceneSnapshotOperation {

        private _depthMove: DepthMove;

        constructor(editor: SceneEditor, depthMove: DepthMove) {
            super(editor);

            this._depthMove = depthMove;
        }

        protected performModification() {

            const objects = this.getEditor().getSelectedGameObjects();

            const displayList = this.getScene().sys.displayList;

            objects.sort((a, b) => {

                const aa = a.parentContainer ? a.parentContainer.getIndex(a) : displayList.getIndex(a);
                const bb = b.parentContainer ? b.parentContainer.getIndex(b) : displayList.getIndex(b);

                return aa - bb;
            });

            switch (this._depthMove) {

                case "Top":

                    for (const obj of objects) {

                        (obj.parentContainer || displayList).bringToTop(obj);
                    }

                    break;

                case "Bottom":

                    for (let i = 0; i < objects.length; i++) {

                        const obj = objects[objects.length - i - 1];

                        (obj.parentContainer || displayList).sendToBack(obj);
                    }

                    break;

                case "Up":

                    for (let i = 0; i < objects.length; i++) {

                        const obj = objects[objects.length - i - 1];

                        (obj.parentContainer || displayList).moveUp(obj);
                    }

                    break;

                case "Down":

                    for (const obj of objects) {

                        (obj.parentContainer || displayList).moveDown(obj);
                    }

                    break;
            }

            this.getEditor().repaint();
        }
    }
}