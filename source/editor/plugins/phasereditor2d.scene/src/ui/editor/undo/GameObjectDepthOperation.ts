namespace phasereditor2d.scene.ui.editor.undo {

    export declare type DepthMove = "Up" | "Down" | "Top" | "Bottom";

    export class GameObjectDepthOperation extends SceneSnapshotOperation {

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

                const parent = obj.getEditorSupport().getObjectParent();
                const siblings =obj.getEditorSupport().getObjectSiblings();

                const index = siblings.indexOf(obj);

                let bottomIndex = 0;
                const len = siblings.length;

                if (sceneobjects.isGameObject(parent)) {

                    const parentES: sceneobjects.DisplayParentGameObjectEditorSupport<any>
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

                const aParent = a.getEditorSupport().getObjectSiblings();
                const bParent = b.getEditorSupport().getObjectSiblings();

                const aa = aParent.indexOf(a);
                const bb = bParent.indexOf(b);

                return aa - bb;
            });

            return sel;
        }

        protected async performModification() {

            const sel = GameObjectDepthOperation.sortedSelection(this.getEditor());

            switch (this._depthMove) {

                case "Top":

                    for (const obj of sel) {

                        const siblings = obj.getEditorSupport().getObjectSiblings();
                        
                        Phaser.Utils.Array.BringToTop(siblings, obj);
                    }

                    break;

                case "Bottom":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];
                        const objES = obj.getEditorSupport();

                        const parent = objES.getObjectParent();
                        const siblings = objES.getObjectSiblings();

                        let bottomIndex = 0;

                        if (parent && sceneobjects.isGameObject(parent)) {

                            const parentES = (parent as sceneobjects.Container).getEditorSupport();

                            bottomIndex = parentES.getCountPrefabChildren();
                        }

                        if (bottomIndex === 0) {

                            Phaser.Utils.Array.SendToBack(siblings, obj)

                        } else {

                            let i = siblings.indexOf(obj);
                            
                            for(; i > bottomIndex; i--) {
                                
                                Phaser.Utils.Array.MoveDown(siblings, obj);
                            }
                        }
                    }

                    break;

                case "Up":

                    for (let i = 0; i < sel.length; i++) {

                        const obj = sel[sel.length - i - 1];

                        const siblings = obj.getEditorSupport().getObjectSiblings();

                        Phaser.Utils.Array.MoveUp(siblings, obj);
                    }

                    break;

                case "Down":

                    for (const obj of sel) {

                        const siblings = obj.getEditorSupport().getObjectSiblings();

                        Phaser.Utils.Array.MoveDown(siblings, obj);
                    }

                    break;
            }

            sceneobjects.sortGameObjects(sel);

            const objectsToSyncFxSet: Set<sceneobjects.ISceneGameObject> = new Set();

            for (const obj of sel) {

                if (obj instanceof sceneobjects.FXObject) {

                    objectsToSyncFxSet.add(obj.getParent());
                }
            }

            if (objectsToSyncFxSet.size > 0) {

                const selManager = this.getEditor().getSelectionManager();

                const selIds = selManager.getSelectionIds();

                for(const obj of objectsToSyncFxSet) {

                    const objES = obj.getEditorSupport();
    
                    const data: any = {};
    
                    objES.writeJSON(data);

                    const sprite = obj as unknown as Phaser.GameObjects.Image;
                    
                    sprite.preFX?.clear();
                    sprite.postFX?.clear();
    
                    objES.readJSON(data);
                }

                selManager.setSelectionByIds(selIds);
            }

            this.getEditor().repaint();
        }
    }
}