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

        private _dataMap: Map<string, IObjectData>;
        private _sceneDataMap: Map<string, ISceneData>;
        private _fileMap: Map<string, io.FilePath>;
        private _files: io.FilePath[];
        private _prefabFiles: io.FilePath[];

        constructor() {

            this._dataMap = new Map();
            this._sceneDataMap = new Map();
            this._fileMap = new Map();
            this._files = [];
            this._prefabFiles = [];

            colibri.ui.ide.FileUtils.getFileStorage().addChangeListener(async (e) => {

                await this.handleStorageChange(e);

            });
        }

        private async handleStorageChange(change: io.FileStorageChange) {

            const test = (names: Set<string>) => {

                for (const name of names) {

                    if (name.endsWith(".scene")) {

                        return true;
                    }
                }

                return false;
            };

            if (
                test(change.getAddRecords())

                || test(change.getModifiedRecords())

                || test(change.getDeleteRecords())

                || test(change.getRenameFromRecords())

                || test(change.getRenameToRecords())
            ) {

                await this.preload(controls.EMPTY_PROGRESS_MONITOR);
            }
        }

        getProjectPreloader() {
            return new SceneFinderPreloader(this);
        }

        async preload(monitor: controls.IProgressMonitor): Promise<void> {

            const dataMap = new Map<string, IObjectData>();
            const sceneDataMap = new Map<string, ISceneData>();
            const fileMap = new Map<string, io.FilePath>();
            const sceneFiles = [];
            const prefabFiles = [];

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as ISceneData;

                    sceneDataMap.set(file.getFullName(), data);

                    if (data.id) {

                        if (data.displayList.length > 0) {

                            const objData = data.displayList[data.displayList.length - 1];

                            dataMap.set(data.id, objData);
                            fileMap.set(data.id, file);
                        }

                        if (data.sceneType === SceneType.PREFAB) {

                            prefabFiles.push(file);
                        }
                    }

                    sceneFiles.push(file);

                } catch (e) {
                    console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${(e as Error).message}`);
                }

                monitor.step();
            }

            this._dataMap = dataMap;
            this._sceneDataMap = sceneDataMap;
            this._fileMap = fileMap;
            this._files = sceneFiles;
            this._prefabFiles = prefabFiles;
        }

        getPrefabId(file: io.FilePath) {

            const data = this.getSceneData(file);

            if (data) {

                if (data.sceneType === SceneType.PREFAB) {

                    return data.id;
                }
            }

            return null;
        }

        getFiles() {
            return this._files;
        }

        getPrefabFiles() {
            return this._prefabFiles;
        }

        getPrefabData(prefabId: string): IObjectData {

            return this._dataMap.get(prefabId);
        }

        getPrefabFile(prefabId: string): io.FilePath {

            return this._fileMap.get(prefabId);
        }

        getSceneData(file: io.FilePath) {

            return this._sceneDataMap.get(file.getFullName());
        }

        getAllSceneData() {

            return this.getFiles().map(file => this.getSceneData(file));
        }
    }
}