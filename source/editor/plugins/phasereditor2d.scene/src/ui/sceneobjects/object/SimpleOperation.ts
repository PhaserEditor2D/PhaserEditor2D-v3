/// <reference path="./SceneGameObjectOperation.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class SimpleOperation<T extends ISceneObject> extends SceneGameObjectOperation<T> {

        private _property: IProperty<T>;

        constructor(editor: editor.SceneEditor, objects: T[], property: IProperty<T>, value: any) {
            super(editor, objects, value);

            this._property = property;
        }

        getValue(obj: T) {

            return this._property.getValue(obj);
        }

        setValue(obj: T, value: any): void {

            this._property.setValue(obj, value);
        }
    }
}