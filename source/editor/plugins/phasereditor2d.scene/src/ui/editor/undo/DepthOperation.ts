namespace phasereditor2d.scene.ui.editor.undo {

    export declare type DepthMove = "Up" | "Down" | "Top" | "Bottom";

    export class DepthOperation extends SceneSnapshotOperation {

        private _depthMove: DepthMove;

        constructor(editor: SceneEditor, depthMove: DepthMove) {
            super(editor);

            this._depthMove = depthMove;
        }

        static allow(editor: SceneEditor, move: DepthMove) {

            const sel = this.sortedSelection(editor);

            for (const obj of sel) {

                const parent = obj.getEditorSupport().getObjectParentOrDisplayList();

                const index = parent.getIndex(obj);

                let bottomIndex = 0;
                const len = parent.list.length;

                if (parent instanceof Phaser.GameObjects.GameObject) {

                    const parentES: sceneobjects.ParentGameObjectEditorSupport<any>
                        = (parent as sceneobjects.ISceneGameObject).getEditorSupport() as any;

                    bottomIndex = parentES.getCountPrefabChildren();
                }

                if (move === "Top" || move === "Up") {

                    if (index === len - 1) {

                        return false;
                    }

                } else { // Bottom || Down

                    if (index === bottomIndex) {

                        return false;
                    }
                }
            }

            return true;
        }

        private static sortedSelection(editor: SceneEditor) {

            const sel = editor.getSelectedGameObjects();

            sel.sort((a, b) => {

                const aParent = a.getEditorSupport().getObjectParentOrDisplayList();
                const bParent = b.getEditorSupport().getObjectParentOrDisplayList();

                const aa = aParent.getIndex(a);
                const bb = bParent.getIndex(b);

                return aa - bb;
            });

            return sel;
        }

        protected async performModification() {

            const sel = DepthOperation.sortedSelection(this.getEditor());

            switch (this._depthMove) {

                case "Top":

                    for (const obj of sel) {

                        obj.getEditorSupport().getObjectParentOrDisplayList().bringToTop(obj);
                    }

                    break;

                case "Bottom":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        const parent = obj.getEditorSupport().getObjectParentOrDisplayList();

                        let bottomIndex = 0;

                        if (sceneobjects.isGameObject(parent)) {

                            const parentES = (parent as sceneobjects.Container).getEditorSupport();

                            bottomIndex = parentES.getCountPrefabChildren();
                        }

                        if (bottomIndex === 0) {

                            parent.sendToBack(obj);

                        } else {

                            let i = parent.getIndex(obj);
                            
                            for(; i > bottomIndex; i--) {
                                
                                parent.moveDown(obj);
                            }
                        }
                    }

                    break;

                case "Up":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        obj.getEditorSupport().getObjectParentOrDisplayList().moveUp(obj);
                    }

                    break;

                case "Down":

                    for (const obj of sel) {

                        obj.getEditorSupport().getObjectParentOrDisplayList().moveDown(obj);
                    }

                    break;
            }

            this.getEditor().repaint();
        }
    }
}