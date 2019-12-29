namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class DropManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            this._editor = editor;

            const canvas = this._editor.getOverlayLayer().getCanvas();

            canvas.addEventListener("dragover", e => this.onDragOver(e));
            canvas.addEventListener("drop", e => this.onDragDrop_async(e));
        }

        async onDragDrop_async(e: DragEvent) {

            const dataArray = controls.Controls.getApplicationDragDataAndClean();

            if (this.acceptsDropDataArray(dataArray)) {

                e.preventDefault();

                const maker = this._editor.getSceneMaker();

                const sprites = await maker.createWithDropEvent_async(e, dataArray);

                this._editor.getUndoManager().add(new undo.AddObjectsOperation(this._editor, sprites));

                this._editor.setSelection(sprites);

                this._editor.refreshOutline();

                this._editor.setDirty(true);

                this._editor.repaint();

                ide.Workbench.getWorkbench().setActivePart(this._editor);
            }
        }

        private onDragOver(e: DragEvent) {

            if (this.acceptsDropDataArray(controls.Controls.getApplicationDragData())) {
                e.preventDefault();
            }
        }

        private acceptsDropData(data: any): boolean {

            for (const ext of ScenePlugin.getInstance().getObjectExtensions()) {

                if (ext.acceptsDropData(data)) {
                    return true;
                }
            }

            return false;
        }

        private acceptsDropDataArray(dataArray: any[]) {

            if (!dataArray) {
                return false;
            }

            for (const item of dataArray) {

                if (!this.acceptsDropData(item)) {
                    return false;
                }
            }

            return true;
        }
    }
}