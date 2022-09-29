/// <reference path="../SceneGameObjectOperation.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PropertyUnlockOperation extends SceneGameObjectOperation<ISceneGameObject> {

        private _properties: Array<IProperty<ISceneGameObject>>;

        constructor(
            editor: editor.SceneEditor,
            objects: ISceneGameObject[],
            properties: Array<IProperty<ISceneGameObject>>,
            unlocked: boolean) {

            super(editor, objects, unlocked);

            this._properties = properties;
        }

        getValue(obj: ISceneGameObject) {

            for (const prop of this._properties) {

                const locked = !obj.getEditorSupport().isUnlockedProperty(prop);

                if (locked) {
                    return false;
                }
            }

            return true;
        }

        setValue(obj: ISceneGameObject, unlocked: any): void {

            for (const prop of this._properties) {

                const support = obj.getEditorSupport();

                if (support.isPrefabInstance()) {

                    if (!unlocked) {

                        const prefabSer = support.getPrefabSerializer();

                        const propValue = prefabSer.read(prop.name, support.getPropertyDefaultValue(prop));

                        prop.setValue(obj, propValue);
                    }

                    obj.getEditorSupport().setUnlockedProperty(prop, unlocked);
                }
            }
        }
    }
}