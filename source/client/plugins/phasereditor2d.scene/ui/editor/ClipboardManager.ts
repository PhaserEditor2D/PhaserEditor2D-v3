namespace phasereditor2d.scene.ui.editor {

    import json = core.json;

    export interface IClipboardItem {

        type: string;
        data: object;
    }

    export class ClipboardManager {

        private _clipboard: IClipboardItem[];
        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            this._editor = editor;

            this._clipboard = [];
        }

        getClipboard() {
            return this._clipboard;
        }

        getClipboardCopy(): IClipboardItem[] {

            return this._clipboard.map(obj => JSON.parse(JSON.stringify(obj)));
        }

        copy() {

            this._clipboard = [];

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    const objData = {} as any;

                    (obj as sceneobjects.ISceneObject).getEditorSupport().writeJSON(objData);

                    this._clipboard.push({
                        type: "ISceneObject",
                        data: objData
                    });

                } else if (obj instanceof sceneobjects.ObjectList) {

                    const listData = {} as any;
                    obj.writeJSON(listData);

                    this._clipboard.push({
                        type: "ObjectList",
                        data: listData
                    });
                }
            }
        }

        paste() {

            if (this._clipboard.length > 0) {

                this._editor.getUndoManager().add(new undo.PasteOperation(this._editor));
            }
        }

        cut() {

            if (this._editor.getSelection().length > 0) {

                this._editor.getUndoManager().add(new undo.CutOperation(this._editor));
            }
        }
    }
}