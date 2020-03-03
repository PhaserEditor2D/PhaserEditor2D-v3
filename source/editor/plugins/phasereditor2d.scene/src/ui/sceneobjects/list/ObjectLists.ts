namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class ObjectLists {

        private _lists: ObjectList[];

        constructor() {

            this._lists = [];
        }

        getLists() {
            return this._lists;
        }

        getListById(id: string) {

            return this._lists.find(list => list.getId() === id);
        }

        getListsByObjectId(objectId: string) {

            const result = this._lists
                .filter(list => list.getObjectIds().findIndex(id => id === objectId) >= 0);

            return result;
        }

        readJSON_lists(listsArray: json.IObjectListData[]) {

            this._lists = [];

            for (const listData of listsArray) {

                const list = new sceneobjects.ObjectList();

                list.readJSON(listData);

                this._lists.push(list);
            }
        }

        readJSON(sceneData: json.ISceneData) {

            const lists = sceneData.lists;

            if (Array.isArray(lists)) {

                this.readJSON_lists(lists);

            } else {

                this._lists = [];
            }
        }

        writeJSON(sceneData: json.ISceneData) {

            sceneData.lists = undefined;

            if (this._lists.length > 0) {

                sceneData.lists = this.toJSON_lists();
            }
        }

        toJSON_lists() {

            const listsData: json.IObjectListData[] = [];

            for (const list of this._lists) {

                const listData = {} as json.IObjectListData;

                list.writeJSON(listData);

                listsData.push(listData);
            }

            return listsData;
        }

        removeListById(id: string) {

            const i = this._lists.findIndex(l => l.getId() === id);

            if (i >= 0) {

                this._lists.splice(i, 1);
            }
        }

        removeObjectById(objId: string) {

            for (const list of this._lists) {

                const i = list.getObjectIds().findIndex(id => id === objId);

                if (i >= 0) {

                    list.getObjectIds().splice(i, 1);
                }
            }
        }
    }
}