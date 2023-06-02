/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import json = core.json;

    export class PasteOperation extends SceneSnapshotOperation {

        private _pasteInPlace: boolean;

        constructor(editor: SceneEditor, pasteInPlace: boolean) {
            super(editor);

            this._pasteInPlace = pasteInPlace;
        }

        // TODO: keep an eye on this. I did a full refreshScene() for loading all the required assets,
        // but I'm now using the data loaders in the performModification() method.
        // So I'm commenting this, but let's see if it doesn't introduce regressions.

        // async execute() {

        //     await super.execute();

        //     await this.getEditor().refreshScene();
        // }

        protected async performModification() {

            const items = ClipboardManager.getClipboardCopy();

            const sel = [];

            await this.pasteGameObjects(items, sel);

            this.pastePrefaProperties(items, sel);

            this._editor.setSelection(sel);
        }

        private pastePrefaProperties(clipboardItems: IClipboardItem[], sel: any[]) {

            const scene = this._editor.getScene();

            if (!scene.isPrefabSceneType()) {

                return;
            }

            for (const item of clipboardItems) {

                if (item.type === "PrefabProperty") {

                    const data = item.data as any;

                    const id = data.type.id;

                    const propType = ScenePlugin.getInstance().getUserPropertyType(id);

                    if (propType) {

                        const userProps = scene.getPrefabUserProperties();

                        const dataName = colibri.ui.ide.utils.NameMaker.trimNumbering(data.name);
                        const dataLabel = colibri.ui.ide.utils.NameMaker.trimNumbering(data.label);

                        const { name, label } = userProps.createNewPropertyNameInfo(dataName, dataLabel);

                        data.name = name;
                        data.label = label;

                        const prop = userProps.createPropertyFromData(data);

                        userProps.add(prop);

                        sel.push(prop);
                    }
                }
            }
        }

        private async pasteGameObjects(clipboardItems: IClipboardItem[], sel: any[]) {

            const scene = this._editor.getScene();

            const maker = this._editor.getSceneMaker();

            const nameMaker = scene.createNameMaker();

            const prefabObj = scene.getPrefabObject();

            const sprites: sceneobjects.ISceneGameObject[] = [];

            const displayList = clipboardItems.filter(i => i.type === "ISceneObject").map(i => i.data as json.IObjectData);

            await scene.getMaker().updateLoaderWithData([], displayList);

            for (const item of clipboardItems) {

                if (item.type === "ISceneObject") {

                    const data = item.data as json.IObjectData;

                    this.setNewObjectId(data);

                    if (!this._pasteInPlace) {

                        const { x, y } = this.getEditor().getMouseManager().getDropPosition();

                        data["x"] = data["__shiftLeft_x"] + x;
                        data["y"] = data["__shiftLeft_y"] + y;
                    }

                    const loaders = ScenePlugin.getInstance().getLoaderUpdaters();

                    for (const loader of loaders) {

                        await loader.updateLoaderWithObjData(this.getScene(), data);
                    }

                    const obj = maker.createObject(data);

                    if (obj) {

                        sprites.push(obj);

                        sel.push(obj);
                    }
                }
            }

            for (const newObj of sprites) {

                const oldLabel = newObj.getEditorSupport().getLabel();

                const newLabel = nameMaker.makeName(oldLabel);

                newObj.getEditorSupport().setLabel(newLabel);
            }

            maker.afterDropObjects(prefabObj, sprites);
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