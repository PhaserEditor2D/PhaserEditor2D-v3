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

        protected performModification() {

            const map = this.getScene().buildObjectIdMap();

            const displayList = this.getScene().sys.displayList;

            for (const obj of this.getEditor().getSelectedGameObjects()) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const objSupport = obj.getEditorSupport();

                if (objSupport.getParentId() === this._parentId) {

                    continue;
                }

                const worldPoint = new Phaser.Math.Vector2(0, 0);
                sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                if (sprite.parentContainer) {

                    sprite.parentContainer.remove(sprite);

                } else {

                    displayList.remove(sprite);
                }

                if (this._parentId) {

                    const container = map.get(this._parentId) as Container;

                    const p = new Phaser.Math.Vector2(0, 0);

                    container.getWorldTransformMatrix().applyInverse(worldPoint.x, worldPoint.y, p);

                    sprite.x = p.x;
                    sprite.y = p.y;

                    container.add(sprite);

                } else {

                    sprite.x = worldPoint.x;
                    sprite.y = worldPoint.y;

                    displayList.add(sprite);
                }
            }
        }
    }
}