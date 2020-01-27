namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class ObjectList {

        private _id: string;
        private _label: string;
        private _scope: ObjectScope;
        private _objectIds: string[];

        constructor() {

            this._id = Phaser.Utils.String.UUID();
            this._label = "list";
            this._scope = ObjectScope.METHOD;
            this._objectIds = [];
        }

        getObjectIds() {
            return this._objectIds;
        }

        getId() {
            return this._id;
        }

        setId(id: string) {
            this._id = id;
        }

        getLabel() {
            return this._label;
        }

        setLabel(label: string) {
            this._label = label;
        }

        getScope() {
            return this._scope;
        }

        setScope(scope: ObjectScope) {
            this._scope = scope;
        }

        readJSON(data: json.IObjectListData) {

            this._id = data.id;
            this._label = data.label;
            this._objectIds = data.objectIds || [];
            this._scope = data.scope || sceneobjects.ObjectScope.CLASS;
        }

        writeJSON(data: json.IObjectListData) {

            data.id = this._id;
            data.label = this._label;
            data.objectIds = this._objectIds.length === 0 ? undefined : this._objectIds;
            data.scope = this._scope === sceneobjects.ObjectScope.CLASS ? undefined : this._scope;
        }
    }
}