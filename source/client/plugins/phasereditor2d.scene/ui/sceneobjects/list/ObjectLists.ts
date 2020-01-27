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

        readJSON_lists(listsArray: json.IObjectListData[]) {

            this._lists = [];

            for (const listData of listsArray) {

                const list = new sceneobjects.ObjectList();

                list.readJSON(listData);

                this._lists.push(list);
            }
        }

        readJSON(sceneData: json.ISceneData) {

            const data = sceneData.lists;

            if (data.lists) {

                this.readJSON_lists(data.lists);

            } else {

                this._lists = [];
            }
        }

        writeJSON(sceneData: json.ISceneData) {

            sceneData.lists = undefined;

            if (this._lists.length > 0) {

                sceneData.lists = {
                    lists: this.toJSON_lists()
                };
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
    }
}