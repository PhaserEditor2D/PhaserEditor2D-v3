namespace phasereditor2d.scene.ui.editor.undo {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import json = core.json;

    interface IObjectConversionData {
        parentId: string;
        objData: json.IObjectData;
    }

    export class ConvertTypeOperation extends undo.SceneEditorOperation {

        private _targetType: sceneobjects.SceneObjectExtension | io.FilePath;
        private _beforeData: IObjectConversionData[];
        private _afterData: IObjectConversionData[];

        constructor(editor: SceneEditor, targetType: sceneobjects.SceneObjectExtension | io.FilePath) {
            super(editor);

            this._targetType = targetType;
        }

        execute() {

            const sel = this.getEditor().getSelection()
                .filter(obj => obj instanceof Phaser.GameObjects.GameObject);

            const objects: sceneobjects.ISceneObject[] = [];

            for (const obj of sel) {

                const sceneObj = obj as sceneobjects.ISceneObject;

                const support = sceneObj.getEditorSupport();

                if (support.isPrefabInstance()) {

                    if (this._targetType === support.getPrefabFile()) {

                        continue;
                    }

                } else if (support.getExtension() === this._targetType) {

                    continue;
                }

                objects.push(obj);
            }

            this._beforeData = [];
            this._afterData = [];

            let targetPrefabId: string;
            let targetTypeName: string;

            if (this._targetType instanceof io.FilePath) {

                const finder = ScenePlugin.getInstance().getSceneFinder();
                targetPrefabId = finder.getPrefabId(this._targetType);

            } else {

                const ext = this._targetType as sceneobjects.SceneObjectExtension;
                targetTypeName = ext.getTypeName();
            }

            for (const obj of objects) {

                let parentId: string;

                if (obj.parentContainer) {

                    parentId = (obj.parentContainer as sceneobjects.Container).getEditorSupport().getId();
                }

                const data1: json.IObjectData = {} as any;

                obj.getEditorSupport().writeJSON(data1);

                this._beforeData.push({
                    parentId,
                    objData: data1
                });

                const data2: json.IObjectData = JSON.parse(JSON.stringify(data1));

                if (targetTypeName) {

                    data2.type = targetTypeName;
                    delete data2.prefabId;

                } else {

                    delete data2.type;
                    data2.prefabId = targetPrefabId;
                }

                this._afterData.push({
                    parentId,
                    objData: data2
                });
            }

            this.loadData(this._afterData);
        }

        private async loadData(conversionData: IObjectConversionData[]) {

            const finder = ScenePlugin.getInstance().getSceneFinder();
            const scene = this.getScene();
            const maker = scene.getMaker();
            const displayList = scene.sys.displayList;

            if (this._targetType instanceof io.FilePath) {

                const sceneData = finder.getSceneData(this._targetType as io.FilePath);

                if (sceneData) {
                    await maker.updateSceneLoader(sceneData);
                }
            }

            const sel = [];

            for (const data of conversionData) {

                const oldObj = scene.getByEditorId(data.objData.id) as sceneobjects.ISceneObject;

                const newObj = maker.createObject(data.objData);
                displayList.remove(newObj);

                if (data.parentId) {

                    const container = scene.getByEditorId(data.parentId) as sceneobjects.Container;
                    container.replace(oldObj, newObj);

                } else {

                    displayList.replace(oldObj, newObj);
                }

                oldObj.getEditorSupport().destroy();

                newObj.getEditorSupport().adjustAfterTypeChange(oldObj as any);

                sel.push(newObj);
            }

            this.getEditor().setDirty(true);
            this.getEditor().setSelection(sel);
            this.getEditor().refreshScene();
        }

        undo(): void {
            this.loadData(this._beforeData);
        }

        redo(): void {
            this.loadData(this._afterData);
        }
    }
}