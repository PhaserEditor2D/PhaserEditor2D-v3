/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import json = core.json;

    export class PasteOperation extends SceneSnapshotOperation {

        constructor(editor: SceneEditor) {
            super(editor);
        }

        async execute() {

            await super.execute();

            await this.getEditor().refreshScene();
        }

        protected async performModification() {

            const items = ClipboardManager.getClipboardCopy();

            const maker = this._editor.getSceneMaker();

            const sel = [];

            const nameMaker = new colibri.ui.ide.utils.NameMaker(
                (obj: sceneobjects.ISceneObject) => obj.getEditorSupport().getLabel());

            this.getScene().visitAskChildren(obj => {

                nameMaker.update([obj]);

                return !obj.getEditorSupport().isPrefabInstance();
            });

            for (const item of items) {

                if (item.type === "ISceneObject") {

                    const data = item.data as json.IObjectData;

                    data.id = Phaser.Utils.String.UUID();
                    data.label = nameMaker.makeName(data.label);

                    const { x, y } = this.getEditor().getMouseManager().getDropPosition();

                    data["x"] = data["x"] + x;
                    data["y"] = data["y"] + y;

                    const obj = maker.createObject(data);

                    sel.push(obj);
                }
            }

            this._editor.setSelection(sel);
        }
    }
}