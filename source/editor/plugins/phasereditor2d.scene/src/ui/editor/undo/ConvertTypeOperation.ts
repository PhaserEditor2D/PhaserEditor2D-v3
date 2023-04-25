/// <reference path="./ObjectSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import io = colibri.core.io;
    import json = core.json;
    import ISceneObject = sceneobjects.ISceneGameObject;

    declare type ITargetType = sceneobjects.SceneGameObjectExtension | io.FilePath;

    export class ConvertTypeOperation extends undo.ObjectSnapshotOperation {

        private _targetType: ITargetType;
        private _extraData: any;

        constructor(editor: SceneEditor, targetType: ITargetType, extraData?: any) {
            super(editor,
                ConvertTypeOperation.filterObjects(editor.getSelectedGameObjects(), targetType)
            );

            this._targetType = targetType;
            this._extraData = extraData || {};
        }

        async execute() {

            if (this._targetType instanceof io.FilePath) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const sceneData = finder.getSceneData(this._targetType);

                await this.getEditor().getSceneMaker().updateSceneLoader(sceneData);
            }

            await super.execute();
        }

        makeChangeSnapshot(input: ISceneObject[]): ISnapshot {

            const result: ISnapshot = {
                objects: []
            };

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const obj of input) {

                const parentId = obj.getEditorSupport().getParentId();

                const support = obj.getEditorSupport();

                const objData: json.IObjectData = {} as any;

                support.writeJSON(objData);

                if (support.isPrefabInstance()) {

                    delete objData.prefabId;

                } else {

                    delete objData.type;
                }

                if (this._targetType instanceof io.FilePath) {

                    objData.prefabId = finder.getPrefabId(this._targetType);
                    objData.components = [];
                    objData.list = [];

                } else {

                    objData.type = this._targetType.getTypeName();
                }

                const ser = this._editor.getScene().getMaker().getSerializer(objData);
                const type = ser.getType();
                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                if (obj.getEditorSupport().isUnlockedPropertyXY(sceneobjects.TransformComponent.position)) {

                    ser.setUnlocked(sceneobjects.TransformComponent.x.name, true);
                    ser.setUnlocked(sceneobjects.TransformComponent.y.name, true);
                }

                ext.adaptDataAfterTypeConversion(ser, obj, this._extraData);

                result.objects.push({
                    objData,
                    parentId
                });
            }

            return result;
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
    }
}