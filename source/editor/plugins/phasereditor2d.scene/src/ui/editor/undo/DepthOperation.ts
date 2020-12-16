namespace phasereditor2d.scene.ui.editor.undo {

    export declare type DepthMove = "Up" | "Down" | "Top" | "Bottom";

    export class DepthOperation extends SceneSnapshotOperation {

        private _depthMove: DepthMove;

        constructor(editor: SceneEditor, depthMove: DepthMove) {
            super(editor);

            this._depthMove = depthMove;
        }

        protected async performModification() {

            const objects = this.getEditor().getSelectedGameObjects();

            const displayList = this.getScene().sys.displayList;

            objects.sort((a, b) => {

                const aParent = sceneobjects.getObjectParentOrDisplayList(a);
                const bParent = sceneobjects.getObjectParentOrDisplayList(a);

                const aa = aParent.getIndex(a);
                const bb = bParent.getIndex(b);

                return aa - bb;
            });

            switch (this._depthMove) {

                case "Top":

                    for (const obj of objects) {

                        sceneobjects.getObjectParentOrDisplayList(obj).bringToTop(obj);
                    }

                    break;

                case "Bottom":

                    for (let i = 0; i < objects.length; i++) {

                        const obj = objects[objects.length - i - 1];

                        sceneobjects.getObjectParentOrDisplayList(obj).sendToBack(obj);
                    }

                    break;

                case "Up":

                    for (let i = 0; i < objects.length; i++) {

                        const obj = objects[objects.length - i - 1];

                        sceneobjects.getObjectParentOrDisplayList(obj).moveUp(obj);
                    }

                    break;

                case "Down":

                    for (const obj of objects) {

                        sceneobjects.getObjectParentOrDisplayList(obj).moveDown(obj);
                    }

                    break;
            }

            this.getEditor().repaint();
        }
    }
}