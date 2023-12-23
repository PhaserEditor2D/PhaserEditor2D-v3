namespace phasereditor2d.scene.ui.editor {

    import json = core.json;

    export interface IClipboardItem {

        type: "ISceneObject" | "IScenePlainObject" | "ObjectList" | "PrefabProperty";
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

            this.copyGameObjects();

            this.copyPlainObjects();

            this.copyObjectLists();

            this.copyPrefabProperties();
        }

        private copyPlainObjects() {

            for(const obj of this._editor.getSelectedPlainObjects()) {

                const data: any = {};

                obj.getEditorSupport().writeJSON(data);

                ClipboardManager._clipboard.push({
                    data,
                    type: "IScenePlainObject"
                });
            }
        }

        private copyPrefabProperties() {

            for (const prop of this._editor.getSelectedPrefabProperties()) {

                const data = {};

                prop.writeJSON(data);

                ClipboardManager._clipboard.push({
                    data,
                    type: "PrefabProperty"
                });
            }
        }

        private copyObjectLists() {

            for (const list of this._editor.getSelectedLists()) {

                const listData = {} as any;
                list.writeJSON(listData);

                ClipboardManager._clipboard.push({
                    type: "ObjectList",
                    data: listData
                });
            }
        }

        private copyGameObjects() {

            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;

            const p = new Phaser.Math.Vector2();

            const selection = new Set(this._editor.getSelectedGameObjects());

            const copyObjects: sceneobjects.ISceneGameObject[] = [];

            // filter off the children of selected parents

            for(const obj of selection) {

                let include = true;

                const objES = obj.getEditorSupport();

                const parents = objES.getAllParents();

                for(const parent of parents) {

                    if (selection.has(parent)) {

                        include = false;
                        break;
                    }
                }

                if (include) {

                    copyObjects.push(obj);
                }
            }

            // record game objects positions

            for (const obj of copyObjects) {

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

            // serialize objects

            for (const obj of copyObjects) {

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

                objData["__shiftLeft_x"] = p.x;
                objData["__shiftLeft_y"] = p.y;

                ClipboardManager._clipboard.push({
                    type: "ISceneObject",
                    data: objData
                });
            }
        }

        paste(pasteInPlace: boolean) {

            if (ClipboardManager._clipboard.length > 0) {

                this._editor.getUndoManager().add(new undo.PasteOperation(this._editor, pasteInPlace));
            }
        }

        cut() {

            if (this._editor.getSelection().length > 0) {

                this._editor.getUndoManager().add(new undo.CutOperation(this._editor));
            }
        }
    }
}