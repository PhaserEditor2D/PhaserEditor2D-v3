namespace phasereditor2d.scene.ui.editor.undo {

    export class CreateObjectWithAssetOperation extends SceneSnapshotOperation {

        private _e: DragEvent;
        private _data: any[];

        constructor(editor: SceneEditor, e: DragEvent, data: any[]) {
            super(editor);

            this._e = e;
            this._data = data;
        }

        protected async performModification() {

            const sprites = await this.getEditor().getDropManager().createWithDropEvent(this._e, this._data);

            this.getEditor().setSelection(sprites);
        }
    }
}