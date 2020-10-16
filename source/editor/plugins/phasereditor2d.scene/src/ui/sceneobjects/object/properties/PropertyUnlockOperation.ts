/// <reference path="../SceneGameObjectOperation.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PropertyUnlockOperation extends SceneGameObjectOperation<ISceneGameObjectLike> {

        private _properties: Array<IProperty<ISceneGameObjectLike>>;

        constructor(
            editor: editor.SceneEditor,
            objects: ISceneGameObjectLike[],
            properties: Array<IProperty<ISceneGameObjectLike>>,
            unlocked: boolean) {

            super(editor, objects, unlocked);

            this._properties = properties;
        }

        getValue(obj: ISceneGameObjectLike) {

            for (const prop of this._properties) {

                const locked = !obj.getEditorSupport().isUnlockedProperty(prop);

                if (locked) {
                    return false;
                }
            }

            return true;
        }

        setValue(obj: ISceneGameObjectLike, unlocked: any): void {

            for (const prop of this._properties) {

                const support = obj.getEditorSupport();

                if (support.isPrefabInstance()) {

                    if (!unlocked) {

                        const prefabSer = support.getPrefabSerializer();

                        const propValue = prefabSer.read(prop.name, prop.defValue);

                        prop.setValue(obj, propValue);
                    }

                    obj.getEditorSupport().setUnlockedProperty(prop, unlocked);
                }
            }
        }
    }
}