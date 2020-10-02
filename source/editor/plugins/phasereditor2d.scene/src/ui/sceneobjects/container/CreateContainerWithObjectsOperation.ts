/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CreateContainerWithObjectsOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            const container = sceneobjects.ContainerExtension.getInstance().createDefaultSceneObject({
                scene: this.getScene(),
                x: 0,
                y: 0
            });

            container.getEditorSupport().setLabel(this.getScene().makeNewName("container"));

            const list = [...this._editor.getSelectedGameObjects()];

            this._editor.getScene().sortObjectsByRenderingOrder(list);

            let newParent: Container;

            for (const obj of list) {

                const objParent = obj.parentContainer as Container;

                if (objParent) {

                    if (newParent) {

                        if (newParent.getEditorSupport().isDescendentOf(objParent)) {

                            newParent = objParent;
                        }

                    } else {

                        newParent = objParent;
                    }
                }
            }

            if (newParent) {

                this.getScene().sys.displayList.remove(container);

                newParent.add(container);
            }

            for (const obj of list) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const worldPoint = new Phaser.Math.Vector2(0, 0);

                sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                if (sprite.parentContainer) {

                    sprite.parentContainer.remove(sprite);
                }

                container.add(sprite);

                const localPoint = new Phaser.Math.Vector2(0, 0);

                container.getWorldTransformMatrix().applyInverse(worldPoint.x, worldPoint.y, localPoint);

                sprite.x = localPoint.x;
                sprite.y = localPoint.y;
            }

            container.getEditorSupport().trim();

            this.getEditor().setSelection([container]);
        }
    }
}