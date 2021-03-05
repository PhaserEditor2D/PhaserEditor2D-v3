namespace phasereditor2d.scene.ui.sceneobjects {

    export class MoveToParentOperation extends editor.undo.SceneSnapshotOperation {

        private _parentId: string;

        constructor(editor: editor.SceneEditor, parentId?: string) {
            super(editor);

            this._parentId = parentId;
        }

        static canMoveAllTo(objList: ISceneGameObject[], parent: Container | Layer) {

            for (const obj of objList) {

                if (!this.canMoveTo(obj, parent)) {

                    return false;
                }
            }

            return true;
        }

        private static canMoveTo(obj: ISceneGameObject, targetParent: Container | Layer) {

            if (!(targetParent instanceof Container || targetParent instanceof Layer)) {

                return false;
            }

            if (targetParent.getEditorSupport().isPrefabInstance() || targetParent.getEditorSupport().isPrefabInstanceElement()) {

                return false;
            }

            const objParent = getObjectParent(obj);

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

                if (obj instanceof Layer && targetParent instanceof Container) {

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

                const hasPosition = obj.getEditorSupport().hasComponent(TransformComponent);

                const currentParent = getObjectParent(obj);

                const objSupport = obj.getEditorSupport();

                if (objSupport.getParentId() === this._parentId) {

                    continue;
                }

                const worldPoint = new Phaser.Math.Vector2(0, 0);

                if (hasPosition) {

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);
                }

                if (currentParent) {

                    currentParent.remove(obj);

                } else {

                    displayList.remove(obj);
                }

                if (this._parentId) {

                    const newParent = map.get(this._parentId) as (Container | Layer);

                    const p = new Phaser.Math.Vector2(0, 0);

                    if (newParent instanceof Container) {

                        newParent.getWorldTransformMatrix().applyInverse(worldPoint.x, worldPoint.y, p);

                    } else {

                        p.set(worldPoint.x, worldPoint.y);
                    }

                    if (hasPosition) {

                        sprite.x = p.x;
                        sprite.y = p.y;
                    }

                    newParent.add(sprite);

                } else {

                    if (hasPosition) {

                        sprite.x = worldPoint.x;
                        sprite.y = worldPoint.y;
                    }

                    displayList.add(sprite, true);
                }
            }
        }
    }
}