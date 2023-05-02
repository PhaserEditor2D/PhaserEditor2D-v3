namespace phasereditor2d.scene.ui.sceneobjects {

    export class ObjectListItem {

        private _objectId: string;
        private _obj: ISceneGameObject;

        constructor(objectId: string) {

            this._objectId = objectId;
        }

        getId() {

            return `ListItem#${this._objectId}`;
        }

        getObjectId() {

            return this._objectId;
        }

        getObject(): ISceneGameObject {

            return this._obj;
        }

        setObject(obj: ISceneGameObject) {

            this._obj = obj;
        }
    }

}