/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CreateLayerWithObjectsOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            const [layer] = sceneobjects.LayerExtension.getInstance().createDefaultSceneObject({
                scene: this.getScene(),
                x: 0,
                y: 0
            }) as sceneobjects.Layer[];

            layer.getEditorSupport().setLabel(this.getScene().makeNewName("layer"));

            const list = [...this._editor.getSelectedGameObjects()];

            this._editor.getScene().sortObjectsByRenderingOrder(list);

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