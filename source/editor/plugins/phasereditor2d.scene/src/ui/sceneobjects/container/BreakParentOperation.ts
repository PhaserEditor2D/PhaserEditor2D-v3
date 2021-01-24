/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class BreakParentOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            const editor = this.getEditor();

            const scene = editor.getScene();

            const selectedObjects = editor.getSelectedGameObjects();

            const sel = BreakParentOperation.breakParent(scene, selectedObjects);

            this.getEditor().setSelection(sel);
        }

        static breakParent(scene: Scene, selectedObjects: ISceneGameObject[]) {

            const displayList = scene.sys.displayList;

            const sel = [];

            for (const obj of selectedObjects) {

                const parent = obj as sceneobjects.Container | sceneobjects.Layer;

                const children = [...parent.getChildren()];

                for (const child of children) {

                    const sprite = child as unknown as Phaser.GameObjects.Sprite;

                    const p = new Phaser.Math.Vector2(0, 0);

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    sel.push(sprite);

                    parent.remove(sprite);
                    sprite.displayList = null;

                    if (parent.parentContainer) {

                        parent.parentContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);

                        parent.parentContainer.add(sprite);

                    } else {

                        if (parent.displayList instanceof Layer) {

                            parent.displayList.add(sprite);

                        } else {

                            displayList.add(sprite);
                        }
                    }

                    sprite.x = p.x;
                    sprite.y = p.y;
                }

                parent.getEditorSupport().destroy();
            }

            return sel;
        }
    }
}