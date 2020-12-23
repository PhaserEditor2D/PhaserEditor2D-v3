/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CreateLayerWithObjectsOperation extends editor.undo.SceneSnapshotOperation {

        private findParentLayer(obj: ISceneGameObject) {

            const parent = getObjectParent(obj);

            if (parent) {

                if (parent instanceof Layer) {

                    return parent;
                }

                return this.findParentLayer(parent);
            }

            return null;
        }

        protected async performModification() {

            const [layer] = sceneobjects.LayerExtension.getInstance().createDefaultSceneObject({
                scene: this.getScene(),
                x: 0,
                y: 0
            }) as sceneobjects.Layer[];

            layer.getEditorSupport().setLabel(this.getScene().makeNewName("layer"));

            const list = [...this._editor.getSelectedGameObjects()];

            this._editor.getScene().sortObjectsByRenderingOrder(list);

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

                this.getScene().sys.displayList.remove(layer);

                newParent.add(layer);
            }

            for (const obj of list) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const worldPoint = new Phaser.Math.Vector2(0, 0);

                sprite.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

                const objParent = getObjectParentOrDisplayList(obj);

                objParent.remove(sprite);

                layer.add(sprite);

                sprite.x = worldPoint.x;
                sprite.y = worldPoint.y;
            }

            this.getEditor().setSelection([layer]);
        }
    }
}