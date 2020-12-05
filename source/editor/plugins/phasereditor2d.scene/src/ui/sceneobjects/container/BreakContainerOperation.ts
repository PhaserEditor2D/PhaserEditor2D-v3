/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class BreakContainerOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            const editor = this.getEditor();

            const scene = editor.getScene();

            const selectedObjects = editor.getSelectedGameObjects();

            const sel = BreakContainerOperation.breakContainer(scene, selectedObjects);

            this.getEditor().setSelection(sel);
        }

        static breakContainer(scene: Scene, selectedObjects: ISceneGameObject[]) {

            const displayList = scene.sys.displayList;

            const sel = [];

            for (const obj of selectedObjects) {

                const container = obj as sceneobjects.Container;

                const children = [...container.list];

                for (const child of children) {

                    const sprite = child as unknown as Phaser.GameObjects.Sprite;

                    const p = new Phaser.Math.Vector2(0, 0);

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    sel.push(sprite);

                    container.remove(sprite);

                    if (container.parentContainer) {

                        container.parentContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);

                        container.parentContainer.add(sprite);

                    } else {

                        displayList.add(sprite);
                    }

                    sprite.x = p.x;
                    sprite.y = p.y;
                }

                container.getEditorSupport().destroy();
            }

            return sel;
        }
    }
}