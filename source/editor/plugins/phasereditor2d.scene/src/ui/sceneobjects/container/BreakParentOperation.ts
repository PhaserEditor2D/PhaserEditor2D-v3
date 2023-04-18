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

            const sel = [];

            for (const obj of selectedObjects) {

                const parent = obj as sceneobjects.Container | sceneobjects.Layer;

                const children = [...parent.getEditorSupport().getObjectChildren()];

                for (const childObj of children) {

                    const pos = new Phaser.Math.Vector2(0, 0);

                    let childAsSprite: Image;

                    if (childObj.getEditorSupport().hasComponent(TransformComponent)) {

                        childAsSprite = childObj as Image;

                        childAsSprite.getWorldTransformMatrix().transformPoint(0, 0, pos);
                    }

                    sel.push(childObj);

                    parent.getEditorSupport().removeObjectChild(childObj);

                    scene.removeGameObject(childObj);

                    childObj.displayList = null;

                    if (parent.parentContainer) {

                        parent.parentContainer.getWorldTransformMatrix().applyInverse(pos.x, pos.y, pos);

                        (parent.parentContainer as Container).getEditorSupport().addObjectChild(childObj);

                    } else {

                        if (parent.displayList instanceof Layer) {

                            parent.displayList.getEditorSupport().addObjectChild(childObj);

                        } else {

                            const i = scene.getGameObjectIndex(parent);

                            scene.addGameObjectAt(childObj, i, true);
                        }
                    }

                    if (childAsSprite) {

                        childAsSprite.x = pos.x;
                        childAsSprite.y = pos.y;
                    }
                }

                parent.getEditorSupport().destroy();
            }

            return sel;
        }
    }
}