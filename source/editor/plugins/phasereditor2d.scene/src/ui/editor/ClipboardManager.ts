namespace phasereditor2d.scene.ui.editor {

    import json = core.json;

    export interface IClipboardItem {

        type: string;
        data: object;
    }

    export class ClipboardManager {

        private static _clipboard: IClipboardItem[] = [];
        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;
        }

        static getClipboard() {
            return this._clipboard;
        }

        static getClipboardCopy(): IClipboardItem[] {

            return this._clipboard.map(obj => JSON.parse(JSON.stringify(obj)));
        }

        copy() {

            ClipboardManager._clipboard = [];

            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;

            const p = new Phaser.Math.Vector2();

            for (const obj of this._editor.getSelectedGameObjects()) {

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                if (sprite.getWorldTransformMatrix) {

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                } else {

                    // the case of Layer
                    p.set(0, 0);
                }

                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
            }

            for (const obj of this._editor.getSelectedGameObjects()) {

                const objData = {} as any;

                obj.getEditorSupport().writeJSON(objData);

                const sprite = obj as unknown as Phaser.GameObjects.Sprite;

                if (sprite.getWorldTransformMatrix) {

                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                } else {

                    // the case of Layer
                    p.set(0, 0);
                }

                p.x -= minX;
                p.y -= minY;

                objData["x"] = p.x;
                objData["y"] = p.y;

                ClipboardManager._clipboard.push({
                    type: "ISceneObject",
                    data: objData
                });
            }

            for (const list of this._editor.getSelectedLists()) {

                const listData = {} as any;
                list.writeJSON(listData);

                ClipboardManager._clipboard.push({
                    type: "ObjectList",
                    data: listData
                });
            }
        }

        paste() {

            if (ClipboardManager._clipboard.length > 0) {

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