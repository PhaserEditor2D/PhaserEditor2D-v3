namespace phasereditor2d.scene.ui.sceneobjects {

    export class ObjectListItem {

        private _parent: ObjectList;
        private _objectId: string;
        private _obj: ISceneGameObject;

        constructor(parent: ObjectList, objectId: string) {

            this._parent = parent;
            this._objectId = objectId;
        }

        getParent() {

            return this._parent;
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