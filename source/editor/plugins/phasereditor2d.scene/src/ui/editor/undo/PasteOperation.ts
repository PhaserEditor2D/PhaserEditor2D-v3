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
                (obj: sceneobjects.ISceneGameObject) => obj.getEditorSupport().getLabel());

            this.getScene().visitAskChildren(obj => {

                nameMaker.update([obj]);

                return !obj.getEditorSupport().isPrefabInstance();
            });

            const prefabObj = this._editor.getScene().getPrefabObject();

            const sprites: sceneobjects.ISceneGameObject[] = [];

            for (const item of items) {

                if (item.type === "ISceneObject") {

                    const data = item.data as json.IObjectData;

                    this.setNewObjectId(data);

                    data.label = nameMaker.makeName(data.label);

                    const { x, y } = this.getEditor().getMouseManager().getDropPosition();

                    data["x"] = data["x"] + x;
                    data["y"] = data["y"] + y;

                    const loaders = ScenePlugin.getInstance().getLoaderUpdaters();

                    for(const loader of loaders) {

                        await loader.updateLoaderWithObjData(this.getScene(), data);
                    }

                    const obj = maker.createObject(data);

                    if (obj) {

                        sprites.push(obj);

                        sel.push(obj);
                    }
                }
            }

            maker.afterDropObjects(prefabObj, sprites);

            this._editor.setSelection(sel);
        }

        private setNewObjectId(data: json.IObjectData) {

            data.id = Phaser.Utils.String.UUID();

            if (data.list) {

                for (const child of data.list) {

                    this.setNewObjectId(child);
                }
            }

            if (data.nestedPrefabs) {

                for (const child of data.nestedPrefabs) {

                    this.setNewObjectId(child);
                }
            }
        }
    }
}