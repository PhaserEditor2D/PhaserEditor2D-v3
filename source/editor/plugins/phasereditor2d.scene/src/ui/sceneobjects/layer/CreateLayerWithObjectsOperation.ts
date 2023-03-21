/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CreateLayerWithObjectsOperation extends editor.undo.SceneSnapshotOperation {

        private findParentLayer(obj: ISceneGameObject) {

            const parent = obj.getEditorSupport().getObjectParent();

            if (parent) {

                if (parent instanceof Layer) {

                    return parent;
                }

                return this.findParentLayer(parent);
            }

            return null;
        }

        protected async performModification() {

            const scene = this.getScene();

            const [layer] = sceneobjects.LayerExtension.getInstance().createDefaultSceneObject({
                scene: this.getScene(),
                x: 0,
                y: 0
            }) as sceneobjects.Layer[];

            layer.getEditorSupport().setLabel(scene.makeNewName("layer"));

            const list = [...this._editor.getSelectedGameObjects()];

            scene.sortObjectsByRenderingOrder(list);

            let newParent: Layer;

            for (const obj of list) {

                const objParent = this.findParentLayer(obj);

                if (objParent && objParent instanceof Layer) {

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

                scene.removeGameObject(layer);

                const newParentES = newParent.getEditorSupport();

                newParentES.addObjectChild(layer);
                newParentES.sortObjectChildren();

            } else {

                scene.sortGameObjects();
            }

            for (const obj of list) {

                const sprite = obj as unknown as Sprite;

                const worldPoint = new Phaser.Math.Vector2(0, 0);

                sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                const objParent = obj.getEditorSupport().getObjectParent();

                if (objParent) {

                    objParent.getEditorSupport().removeObjectChild(sprite);

                } else {

                    scene.removeGameObject(sprite);
                }

                layer.getEditorSupport().addObjectChild(sprite);

                sprite.x = worldPoint.x;
                sprite.y = worldPoint.y;
            }

            this.getEditor().setSelection([layer]);
        }
    }
}