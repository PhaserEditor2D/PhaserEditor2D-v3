/// <reference path="./SceneSnapshotOperation.ts" />
namespace phasereditor2d.scene.ui.editor.undo {

    export class CreateObjectWithAssetOperation extends SceneSnapshotOperation {

        private _offsetX: number;
        private _offsetY: number;
        private _data: any[];

        constructor(editor: SceneEditor, data: any[], offsetX: number, offsetY: number) {
            super(editor);

            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._data = data;
        }

        protected async performModification() {

            const sprites = await this.getEditor().getDropManager().createWithDropEvent(this._data, this._offsetX, this._offsetY);

            this.getEditor().setSelection(sprites);
        }
    }
}