/// <reference path="./SceneEditorOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    export class AddObjectsOperation extends SceneEditorOperation {

        private _dataList: any[];

        constructor(editor: SceneEditor, objects: gameobjects.EditorObject[]) {
            super(editor);

            this._dataList = objects.map(obj => {
                const data = {};

                obj.writeJSON(data);

                return data;
            });
        }

        undo(): void {
            
            const scene = this._editor.getGameScene();

            for (const data of this._dataList) {

                const obj = scene.getByEditorId(data.id);

                if (obj) {
                    obj.destroy();
                }
            }

            this._editor.getSelectionManager().refreshSelection();

            this.updateEditor();
        }

        redo(): void {

            const maker = this._editor.getSceneMaker();

            for (const data of this._dataList) {
                maker.createObject(data);
            }

            this.updateEditor();
        }

        private updateEditor() {
            this._editor.setDirty(true);
            this._editor.repaint();
            this._editor.refreshOutline();
        }

    }

}