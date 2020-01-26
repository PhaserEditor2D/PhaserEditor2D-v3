namespace phasereditor2d.scene.ui.sceneobjects {

    interface IObjectMove {

        dstParentId: string;
        srcObjectId: string;
        dstIndex: number;
        x?: number;
        y?: number;
    }

    export class MoveToContainerOperation extends editor.undo.SceneEditorOperation {

        private _before: IObjectMove[];
        private _after: IObjectMove[];

        constructor(editor: editor.SceneEditor, parentId?: string) {
            super(editor);

            this._before = [];
            this._after = [];

            const objects = editor.getSelectedGameObjects();

            const displayList = this.getScene().sys.displayList;

            const map = this.getScene().buildObjectIdMap();

            for (const obj of objects) {

                if (obj instanceof Container) {

                    continue;
                }

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const objSupport = obj.getEditorSupport();

                if (objSupport.getParentId() === parentId) {

                    continue;
                }

                const objParentList = obj.parentContainer ? obj.parentContainer.list : displayList.list;

                this._before.push({
                    dstParentId: objSupport.getParentId(),
                    dstIndex: objParentList.indexOf(obj),
                    srcObjectId: objSupport.getId(),
                    x: sprite.x,
                    y: sprite.y
                });

                const p = new Phaser.Math.Vector2(0, 0);

                if (parentId) {

                    const container = map.get(parentId) as Container;

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                    container.getWorldTransformMatrix().applyInverse(p.x, p.y, p);

                    this._after.push({
                        dstParentId: parentId,
                        dstIndex: container.length,
                        srcObjectId: objSupport.getId(),
                        x: p.x,
                        y: p.y
                    });

                } else {

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    this._after.push({
                        dstParentId: parentId,
                        dstIndex: displayList.length,
                        srcObjectId: objSupport.getId(),
                        x: p.x,
                        y: p.y
                    });
                }
            }
        }

        execute() {

            this.loadMove(this._after);
        }

        private loadMove(moves: IObjectMove[]) {

            const scene = this.getScene();
            const displayList = scene.sys.displayList;

            const map = scene.buildObjectIdMap();

            for (const move of moves) {

                const obj = map.get(move.srcObjectId) as unknown as Phaser.GameObjects.Sprite;

                obj.x = move.x;
                obj.y = move.y;

                if (obj.parentContainer) {

                    obj.parentContainer.remove(obj);

                } else {

                    displayList.remove(obj);
                }

                if (move.dstParentId) {

                    const container = map.get(move.dstParentId) as Container;
                    container.addAt(obj, move.dstIndex);

                } else {

                    displayList.addAt(obj, move.dstIndex);
                }
            }

            const editor = this.getEditor();

            editor.setDirty(true);
            editor.refreshOutline();
            editor.repaint();
        }

        undo(): void {

            this.loadMove(this._before);
        }

        redo(): void {

            this.loadMove(this._after);
        }
    }
}