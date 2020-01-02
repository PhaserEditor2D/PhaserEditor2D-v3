namespace phasereditor2d.scene.ui.json {

    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneDataTable {

        private _map: Map<string, ObjectData>;

        constructor() {
            this._map = new Map();
        }

        async preload(): Promise<void> {

            const map = new Map<string, ObjectData>();

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as SceneData;

                    if (data.id) {

                        if (data.displayList.length > 0) {

                            const objData = data.displayList[0];

                            map.set(data.id, objData);
                        }
                    }

                } catch (e) {
                    console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${(e as Error).message}`);
                }
            }

            console.log(map);

            this._map = map;
        }

        getPrefabData(prefabId: string): ObjectData {

            return this._map.get(prefabId);
        }
    }
}