/// <reference path="./SceneObjectOperation.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PropertyUnlockOperation extends SceneObjectOperation<ISceneObjectLike> {

        private _properties: Array<IProperty<ISceneObjectLike>>;

        constructor(
            editor: editor.SceneEditor,
            objects: ISceneObjectLike[],
            properties: Array<IProperty<ISceneObjectLike>>,
            unlocked: boolean) {

            super(editor, objects, unlocked);

            this._properties = properties;
        }

        getValue(obj: ISceneObjectLike) {

            for (const prop of this._properties) {

                const locked = !obj.getEditorSupport().isUnlockedProperty(prop.name);

                if (locked) {
                    return false;
                }
            }

            return true;
        }

        setValue(obj: ISceneObjectLike, unlocked: any): void {

            for (const prop of this._properties) {

                const support = obj.getEditorSupport();

                if (support.isPrefabInstance()) {

                    if (!unlocked) {

                        const prefabSer = support.getPrefabSerializer();

                        const propValue = prefabSer.read(prop.name, prop.defValue);

                        prop.setValue(obj, propValue);
                    }

                    obj.getEditorSupport().setUnlockedProperty(prop.name, unlocked);
                }
            }
        }
    }
}