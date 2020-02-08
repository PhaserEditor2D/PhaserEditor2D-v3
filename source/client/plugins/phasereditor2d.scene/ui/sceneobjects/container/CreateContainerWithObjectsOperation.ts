/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class CreateContainerWithObjectsOperation extends editor.undo.SceneSnapshotOperation {

        protected async performModification() {

            const container = sceneobjects.ContainerExtension.getInstance().createEmptySceneObject({
                scene: this.getScene(),
                x: 0,
                y: 0
            });

            container.getEditorSupport().setLabel(this.getScene().makeNewName("container"));

            for (const obj of this._editor.getSelectedGameObjects()) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                const p = new Phaser.Math.Vector2(0, 0);

                sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                if (sprite.parentContainer) {

                    sprite.parentContainer.remove(sprite);
                }

                container.add(sprite);

                sprite.x = p.x;
                sprite.y = p.y;
            }

            container.getEditorSupport().trim();

            this.getEditor().setSelection([container]);
        }
    }
}