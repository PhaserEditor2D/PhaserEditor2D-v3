/// <reference path="./ObjectSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import io = colibri.core.io;
    import json = core.json;
    import ISceneObject = sceneobjects.ISceneObject;

    interface IObjectConversionData {
        parentId: string;
        objData: json.IObjectData;
        targetType: sceneobjects.SceneObjectExtension | io.FilePath;
    }

    declare type ITargetType = sceneobjects.SceneObjectExtension | io.FilePath;

    export class ConvertTypeOperation extends undo.ObjectSnapshotOperation {

        private _targetType: ITargetType;

        constructor(editor: SceneEditor, targetType: ITargetType) {
            super(editor,
                ConvertTypeOperation.filterObjects(editor.getSelectedGameObjects(), targetType)
            );

            this._targetType = targetType;
        }

        async execute() {

            if (this._targetType instanceof io.FilePath) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const sceneData = finder.getSceneData(this._targetType);

                await this.getEditor().getSceneMaker().updateSceneLoader(sceneData);
            }

            super.execute();
        }

        private static filterObjects(input: ISceneObject[], targetType: ITargetType) {

            return input.filter(obj => {

                if (obj.getEditorSupport().isPrefabInstance()) {

                    if (obj.getEditorSupport().getPrefabFile() === targetType) {

                        return false;
                    }

                } else if (obj.getEditorSupport().getExtension() === targetType) {

                    return false;
                }

                return true;

            });
        }

        performChange(input: ISceneObject[]): ISceneObject[] {

            const result: ISceneObject[] = [];

            const finder = ScenePlugin.getInstance().getSceneFinder();
            const scene = this.getScene();
            const maker = scene.getMaker();

            for (const oldObj of input) {

                const support = oldObj.getEditorSupport();

                const data: json.IObjectData = {} as any;

                support.writeJSON(data);

                if (support.isPrefabInstance()) {

                    delete data.prefabId;

                } else {

                    delete data.type;
                }

                if (this._targetType instanceof io.FilePath) {

                    data.prefabId = finder.getPrefabId(this._targetType);

                } else {

                    data.type = this._targetType.getTypeName();
                }

                const newObj = maker.createObject(data);
                scene.sys.displayList.remove(newObj);

                newObj.getEditorSupport().adjustAfterTypeChange(oldObj);

                result.push(newObj);
            }

            return result;
        }
    }
}