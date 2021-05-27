/// <reference path="../../ui/editor/usercomponent/UserComponent.ts" />
namespace phasereditor2d.scene.core.json {

    import FileUtils = colibri.ui.ide.FileUtils;
    import io = colibri.core.io;
    import controls = colibri.ui.controls;
    import usercomponent = ui.editor.usercomponent;

    class SceneFinderPreloader extends colibri.ui.ide.PreloadProjectResourcesExtension {

        private _finder: SceneFinder;

        constructor(finder: SceneFinder) {
            super();

            this._finder = finder;
        }

        async computeTotal(): Promise<number> {

            return 0;
        }

        preload(monitor: controls.IProgressMonitor) {

            return this._finder.preload(monitor);
        }
    }


    export interface IUserComponentsModelInfo {
        file: io.FilePath;
        model: usercomponent.UserComponentsModel;
    }

    export interface IFindComponentResult {
        file: io.FilePath,
        model: usercomponent.UserComponentsModel,
        component: usercomponent.UserComponent
    }

    export class SceneFinder {

        private _prefabObjectId_ObjectData_Map: Map<string, IObjectData>;
        private _sceneFilename_Data_Map: Map<string, ISceneData>;
        private _prefabId_File_Map: Map<string, io.FilePath>;
        private _sceneFiles: io.FilePath[];
        private _prefabFiles: io.FilePath[];
        private _compFiles: io.FilePath[];
        private _compFilename_Data_Map: Map<string, usercomponent.UserComponentsModel>;
        private _compModelsInfo: IUserComponentsModelInfo[];
        private _enabled: boolean;

        constructor() {

            this._prefabObjectId_ObjectData_Map = new Map();
            this._sceneFilename_Data_Map = new Map();
            this._prefabId_File_Map = new Map();
            this._sceneFiles = [];
            this._prefabFiles = [];

            this._compFiles = [];
            this._compFilename_Data_Map = new Map();
            this._compModelsInfo = [];

            this._enabled = true;

            colibri.ui.ide.FileUtils.getFileStorage().addChangeListener(async (e) => {

                await this.handleStorageChange(e);

            });
        }

        private async handleStorageChange(change: io.FileStorageChange) {

            const test = (names: Set<string>) => {

                for (const name of names) {

                    if (name.endsWith(".scene") || name.endsWith(".components")) {

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

            if (!this.isEnabled()) {

                return;
            }

            const total = (await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE)).length

                + (await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_USER_COMPONENTS)).length;

            monitor.addTotal(total);

            await this.preloadSceneFiles(monitor);

            await this.preloadComponentsFiles(monitor);
        }

        private async preloadComponentsFiles(monitor: controls.IProgressMonitor): Promise<void> {

            const compFiles = [];
            const compFilename_Data_Map = new Map();
            const compModels: IUserComponentsModelInfo[] = [];

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_USER_COMPONENTS);

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as usercomponent.IUserComponentsModelData;

                    const model = new usercomponent.UserComponentsModel();

                    model.readJSON(data);

                    compModels.push({ file, model });

                    compFilename_Data_Map.set(file.getFullName(), model);

                    compFiles.push(file);

                } catch (e) {
                    console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${(e as Error).message}`);
                }

                monitor.step();
            }

            this._compFiles = compFiles;
            this._compFilename_Data_Map = compFilename_Data_Map;
            this._compModelsInfo = compModels;
        }

        setEnabled(enabled: boolean) {

            this._enabled = enabled;
        }

        isEnabled() {

            return this._enabled;
        }

        private async preloadSceneFiles(monitor: controls.IProgressMonitor): Promise<void> {
            const sceneIdSet = new Set<string>();
            const prefabObjectId_ObjectData_Map = new Map<string, IObjectData>();
            const sceneFilename_Data_Map = new Map<string, ISceneData>();
            const prefabId_File_Map = new Map<string, io.FilePath>();
            const sceneFiles = [];
            const prefabFiles = [];

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            files.sort((a, b) => b.getModTime() - a.getModTime());

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as ISceneData;

                    sceneFilename_Data_Map.set(file.getFullName(), data);

                    if (data.id) {


                        if (sceneIdSet.has(data.id)) {

                            const mappedFile = prefabId_File_Map.get(data.id);

                            alert(`ERROR! File ${mappedFile.getFullName()} has a duplicated ID ${data.id}. Run the command Fix Duplicated Scenes ID.`);

                        } else {

                            sceneIdSet.add(data.id);
                        }

                        if (data.displayList.length > 0) {

                            const objData = data.displayList[data.displayList.length - 1];

                            prefabObjectId_ObjectData_Map.set(data.id, objData);
                            prefabId_File_Map.set(data.id, file);
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

            this._prefabObjectId_ObjectData_Map = prefabObjectId_ObjectData_Map;
            this._sceneFilename_Data_Map = sceneFilename_Data_Map;
            this._prefabId_File_Map = prefabId_File_Map;
            this._sceneFiles = sceneFiles;
            this._prefabFiles = prefabFiles;
        }

        getUserComponentsFiles() {

            return this._compFiles;
        }

        getUserComponentsByFile(file: io.FilePath) {

            return this._compFilename_Data_Map.get(file.getFullName());
        }

        getUserComponentsModels() {

            return this._compModelsInfo;
        }

        getUserComponentByName(name: string): IFindComponentResult {

            for (const info of this._compModelsInfo) {

                for (const comp of info.model.getComponents()) {

                    if (comp.getName() === name) {

                        return {
                            file: info.file,
                            model: info.model,
                            component: comp
                        };
                    }
                }
            }

            return undefined;
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

        getSceneFiles() {
            return this._sceneFiles;
        }

        getPrefabFiles() {
            return this._prefabFiles;
        }

        getPrefabData(prefabId: string): IObjectData {

            return this._prefabObjectId_ObjectData_Map.get(prefabId);
        }

        getPrefabFile(prefabId: string): io.FilePath {

            return this._prefabId_File_Map.get(prefabId);
        }

        getPrefabHierarchy(prefabId: string) {

            return this.getPrefabHierarchy2(prefabId, []);
        }

        private getPrefabHierarchy2(prefabId: string, result: io.FilePath[]) {

            const file = this.getPrefabFile(prefabId);

            if (file) {

                result.push(file);

                const objData = this.getPrefabData(prefabId);

                if (objData && objData.prefabId) {

                    this.getPrefabHierarchy2(objData.prefabId, result);
                }
            }

            return result;
        }

        getSceneData(file: io.FilePath) {

            return this._sceneFilename_Data_Map.get(file.getFullName());
        }

        getScenePhaserType(file: io.FilePath) {

            const data = this.getSceneData(file);

            if (data.sceneType === core.json.SceneType.SCENE) {

                return "Phaser.Scene";
            }

            const prefabId = this.getPrefabId(file);

            if (prefabId) {

                const prefabData = this.getPrefabData(prefabId);

                if (prefabData) {

                    const serializer = new core.json.Serializer(prefabData);

                    const type = serializer.getPhaserType();

                    return type;
                }
            }

            return undefined;
        }

        getAllSceneData() {

            return this.getSceneFiles().map(file => this.getSceneData(file));
        }
    }
}