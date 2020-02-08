/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class BreakContainerOperation extends SceneSnapshotOperation {

        protected async performModification() {

            const displayList = this.getEditor().getScene().sys.displayList;

            const sel = [];

            for (const obj of this._editor.getSelectedGameObjects()) {

                const container = obj as sceneobjects.Container;

                const children = [...container.list];

                for (const child of children) {

                    const sprite = child as unknown as Phaser.GameObjects.Sprite;

                    const p = new Phaser.Math.Vector2(0, 0);

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    sprite.x = p.x;
                    sprite.y = p.y;

                    sel.push(sprite);

                    container.remove(sprite);
                }

                container.getEditorSupport().destroy();
            }

            for (const obj of sel) {

                displayList.add(obj);
            }

            this.getEditor().setSelection(sel);
        }
    }
}