namespace phasereditor2d.scene.ui.sceneobjects {

    export class MoveToParentOperation extends editor.undo.SceneSnapshotOperation {

        private _parentId: string;

        constructor(editor: editor.SceneEditor, parentId?: string) {
            super(editor);

            this._parentId = parentId;
        }

        protected async performModification() {

            const scene = this.getScene();

            const map = scene.buildObjectIdMap();

            const objects = this.getEditor().getSelectedGameObjects();

            scene.sortObjectsByIndex(objects);

            for (const obj of objects) {

                const sprite = obj as unknown as Sprite;

                const objES = obj.getEditorSupport();

                const canTranslate = objES.hasComponent(TransformComponent)
                    && objES.isUnlockedProperty(TransformComponent.x);

                const currentParent = objES.getObjectParent();

                if (objES.getParentId() === this._parentId) {

                    continue;
                }

                const worldPoint = new Phaser.Math.Vector2(0, 0);

                if (canTranslate) {

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);
                }

                if (currentParent) {

                    currentParent.getEditorSupport().removeObjectChild(obj);

                } else {

                    scene.removeGameObject(obj);
                }

                if (this._parentId) {

                    const newParent = map.get(this._parentId);

                    if (canTranslate) {

                        const p = new Phaser.Math.Vector2(0, 0);

                        if (newParent instanceof Container) {

                            newParent.getWorldTransformMatrix().applyInverse(worldPoint.x, worldPoint.y, p);

                        } else {

                            p.set(worldPoint.x, worldPoint.y);
                        }

                        sprite.x = p.x;
                        sprite.y = p.y;
                    }

                    newParent.getEditorSupport().addObjectChild(sprite);

                } else {

                    if (canTranslate) {

                        sprite.x = worldPoint.x;
                        sprite.y = worldPoint.y;
                    }

                    scene.addGameObject(sprite, true);
                }
            }
        }
    }
}