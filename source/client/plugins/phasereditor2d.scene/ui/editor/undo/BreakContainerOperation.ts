/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class BreakContainerOperation extends SceneSnapshotOperation {

        protected async performModification() {

            const displayList = this.getEditor().getScene().sys.displayList;

            const sel = [];

            for (const obj of this._editor.getSelectedGameObjects()) {

                const container = obj as sceneobjects.Container;

                for (const child of container.list) {

                    const sprite = child as unknown as Phaser.GameObjects.Sprite;

                    const p = new Phaser.Math.Vector2(0, 0);

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    sprite.x = p.x;
                    sprite.y = p.y;

                    container.remove(sprite);

                    displayList.add(sprite);

                    sel.push(sprite);
                }
            }

            this.getEditor().setSelection(sel);
        }
    }
}