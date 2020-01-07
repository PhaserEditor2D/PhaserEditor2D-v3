namespace phasereditor2d.scene.core.json {

    import FileUtils = colibri.ui.ide.FileUtils;
    import io = colibri.core.io;
    import controls = colibri.ui.controls;


    class SceneFinderPreloader extends colibri.ui.ide.PreloadProjectResourcesExtension {

        private _finder: SceneFinder;

        constructor(finder: SceneFinder) {
            super();

            this._finder = finder;
        }

        async computeTotal(): Promise<number> {

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            return files.length;
        }

        preload(monitor: controls.IProgressMonitor) {

            return this._finder.preload(monitor);
        }
    }

    export class SceneFinder {

        private _dataMap: Map<string, ObjectData>;
        private _sceneDataMap: Map<string, SceneData>;
        private _fileMap: Map<string, io.FilePath>;
        private _files: io.FilePath[];

        constructor() {

            this._dataMap = new Map();
            this._sceneDataMap = new Map();
            this._fileMap = new Map();
            this._files = [];
        }

        getProjectPreloader() {
            return new SceneFinderPreloader(this);
        }

        async preload(monitor: controls.IProgressMonitor): Promise<void> {

            const dataMap = new Map<string, ObjectData>();
            const sceneDataMap = new Map<string, SceneData>();
            const fileMap = new Map<string, io.FilePath>();
            const newFiles = [];

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as SceneData;

                    sceneDataMap.set(file.getFullName(), data);

                    if (data.id) {

                        if (data.displayList.length > 0) {

                            const objData = data.displayList[0];

                            dataMap.set(data.id, objData);
                            fileMap.set(data.id, file);
                        }
                    }

                    newFiles.push(file);

                } catch (e) {
                    console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${(e as Error).message}`);
                }

                monitor.step();
            }

            this._dataMap = dataMap;
            this._sceneDataMap = sceneDataMap;
            this._fileMap = fileMap;
            this._files = newFiles;
        }

        getFiles() {
            return this._files;
        }

        getPrefabData(prefabId: string): ObjectData {

            return this._dataMap.get(prefabId);
        }

        getPrefabFile(prefabId: string): io.FilePath {

            return this._fileMap.get(prefabId);
        }

        getSceneData(file: io.FilePath) {

            return this._sceneDataMap.get(file.getFullName());
        }
    }
}