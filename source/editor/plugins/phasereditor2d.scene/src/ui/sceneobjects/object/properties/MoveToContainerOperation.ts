namespace phasereditor2d.scene.ui.sceneobjects {

    interface IObjectMove {

        dstParentId: string;
        srcObjectId: string;
        dstIndex: number;
        x?: number;
        y?: number;
    }

    export class MoveToContainerOperation extends editor.undo.SceneSnapshotOperation {

        private _parentId: string;

        constructor(editor: editor.SceneEditor, parentId?: string) {
            super(editor);

            this._parentId = parentId;
        }

        static canMoveAllTo(objList: ISceneGameObject[], container: Container | Layer) {

            for (const obj of objList) {

                if (!this.canMoveTo(obj, container)) {

                    return false;
                }
            }

            return true;
        }

        static canMoveTo(obj: ISceneGameObject, targetParent: Container | Layer) {

            const objParent = GameObjectEditorSupport.getObjectParent(obj);

            if (objParent === targetParent) {

                return false;
            }

            if (obj instanceof Container || obj instanceof Layer) {

                if (obj === targetParent) {

                    return false;
                }

                const parents = new Set(targetParent.getEditorSupport().getAllParents());

                if (parents.has(obj)) {

                    return false;
                }
            }

            return true;
        }

        protected async performModification() {

            const map = this.getScene().buildObjectIdMap();

            const displayList = this.getScene().sys.displayList;

            for (const obj of this.getEditor().getSelectedGameObjects()) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const currentParent = GameObjectEditorSupport.getObjectParent(obj);

                const objSupport = obj.getEditorSupport();

                if (objSupport.getParentId() === this._parentId) {

                    continue;
                }

                const worldPoint = new Phaser.Math.Vector2(0, 0);
                sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                if (currentParent) {

                    currentParent.remove(sprite);

                } else {

                    displayList.remove(sprite);
                }

                if (this._parentId) {

                    const newParent = map.get(this._parentId) as (Container | Layer);

                    const p = new Phaser.Math.Vector2(0, 0);

                    if (newParent instanceof Container) {

                        newParent.getWorldTransformMatrix().applyInverse(worldPoint.x, worldPoint.y, p);

                    } else {

                        p.set(worldPoint.x, worldPoint.y);
                    }

                    sprite.x = p.x;
                    sprite.y = p.y;

                    newParent.add(sprite);

                } else {

                    sprite.x = worldPoint.x;
                    sprite.y = worldPoint.y;

                    displayList.add(sprite);
                }
            }
        }
    }
}