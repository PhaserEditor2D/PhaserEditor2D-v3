namespace phasereditor2d.scene.ui.sceneobjects {

    export class PlainObjectComponent<T extends IScenePlainObject> {

        private _obj: T;
        private _properties: IProperty<T>[];

        constructor(obj: T, ...properties: IProperty<T>[]) {

            this._obj = obj;
            this._properties = properties;
        }

        getProperties() {

            return this._properties;
        }

        getObject() {

            return this._obj;
        }
    }
}