namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class ObjectList {

        private _id: string;
        private _label: string;
        private _scope: ObjectScope;
        private _objectIds: string[];
        private _items: ObjectListItem[];

        constructor() {

            this._id = Phaser.Utils.String.UUID();
            this._label = "list";
            this._scope = ObjectScope.CLASS;
            this._objectIds = [];
            this._items = [];
        }

        getItemsWithObjects(scene: Scene) {

            const map = scene.buildObjectIdMap();

            for(const item of this._items) {

                item.setObject(map.get(item.getObjectId()));
            }

            return this._items.filter(item => Boolean(item.getObject()));
        }

        updateOrderIdsFromItems() {

            this._objectIds = this._items.map(i => i.getObjectId());
        }

        removeItem(id: string) {

            this._items = this._items.filter(i => i.getId() !== id);
            
            this._objectIds = this._items.map(i => i.getObjectId());
        }

        getItems() {

            return this._items;
        }

        getObjectIds() {

            return this._objectIds;
        }

        setObjectsIds(ids: string[]) {

            this._objectIds = ids;

            this._items = this._objectIds.map(id => new ObjectListItem(this, id));
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

        inferType(objMap: Map<string, ISceneGameObject>) {

            const types = new Set(this.getObjectIds()

                .map(id => objMap.get(id))

                .filter(obj => obj !== undefined)

                .map(obj => {

                    const support = obj.getEditorSupport();

                    if (support.isPrefabInstance()) {

                        return support.getPrefabName();
                    }

                    return support.getPhaserType();
                }));

            let listType = [...types].join("|");

            if (types.size === 0) {

                listType = "Array<any>";

            } else if (types.size === 1) {

                listType = listType + "[]";

            } else {

                listType = "Array<" + listType + ">";
            }

            return listType;
        }

        readJSON(data: json.IObjectListData) {

            this._id = data.id;
            this._label = data.label;
            this._scope = data.scope || sceneobjects.ObjectScope.CLASS;
            this.setObjectsIds(data.objectIds || []);
        }

        writeJSON(data: json.IObjectListData) {

            data.id = this._id;
            data.label = this._label;
            data.objectIds = this._objectIds.length === 0 ? undefined : [...this._objectIds];
            data.scope = this._scope === sceneobjects.ObjectScope.CLASS ? undefined : this._scope;
        }
    }
}