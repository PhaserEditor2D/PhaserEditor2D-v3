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

        async preload(monitor: controls.IProgressMonitor) {

            await this._finder.preload(monitor);
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

    export interface IUserEvent {
        name: string;
        help: string;
        file: io.FilePath;
    }

    export class SceneFinder {

        private _prefabObjectId_ObjectData_Map: Map<string, IObjectData>;
        private _sceneFilename_Data_Map: Map<string, ISceneData>;
        private _sceneFilename_Settings_Map: Map<string, SceneSettings>;
        private _prefabId_File_Map: Map<string, io.FilePath>;
        private _sceneFiles: io.FilePath[];
        private _prefabFiles: io.FilePath[];
        private _compFiles: io.FilePath[];
        private _compFilename_Data_Map: Map<string, usercomponent.UserComponentsModel>;
        private _compModelsInfo: IUserComponentsModelInfo[];
        private _enabled: boolean;
        private _nestedPrefabIds: Set<string>;
        private _storageChangeListener: (e: io.FileStorageChange) => Promise<void>;

        constructor() {

            this._prefabObjectId_ObjectData_Map = new Map();
            this._nestedPrefabIds = new Set();
            this._sceneFilename_Data_Map = new Map();
            this._sceneFilename_Settings_Map = new Map();
            this._prefabId_File_Map = new Map();
            this._sceneFiles = [];
            this._prefabFiles = [];

            this._compFiles = [];
            this._compFilename_Data_Map = new Map();
            this._compModelsInfo = [];

            this._enabled = true;
        }

        registerStorageListener() {

            this._storageChangeListener = async (e: io.FileStorageChange) => {

                await this.handleStorageChange(e);
            };

            colibri.ui.ide.FileUtils.getFileStorage().addChangeListener(this._storageChangeListener);
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

                + (await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_USER_COMPONENTS)).length

                + 1;

            monitor.addTotal(total);

            await this.preloadSceneFiles(monitor);

            await this.preloadComponentsFiles(monitor);

            monitor.step();
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
            const nestedPrefabIds = new Set<string>();
            const sceneFilename_Data_Map = new Map<string, ISceneData>();
            const sceneFilename_Settings_Map = new Map<string, SceneSettings>();
            const prefabId_File_Map = new Map<string, io.FilePath>();
            const sceneFiles = [];
            const prefabFiles = [];

            const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);

            files.sort((a, b) => b.getModTime() - a.getModTime());

            for (const file of files) {

                const content = await FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content) as ISceneData;

                    ScenePlugin.getInstance().runSceneDataMigrations(data);

                    sceneFilename_Data_Map.set(file.getFullName(), data);
                    {
                        const settings = new SceneSettings();
                        settings.readJSON(data.settings);
                        sceneFilename_Settings_Map.set(file.getFullName(), settings);
                    }

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

                            this.mapNestedPrefabData(
                                prefabObjectId_ObjectData_Map, prefabId_File_Map, nestedPrefabIds, file, objData);
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
            this._nestedPrefabIds = nestedPrefabIds;
            this._sceneFilename_Data_Map = sceneFilename_Data_Map;
            this._sceneFilename_Settings_Map = sceneFilename_Settings_Map;
            this._prefabId_File_Map = prefabId_File_Map;
            this._sceneFiles = sceneFiles;
            this._prefabFiles = prefabFiles;
        }

        private mapNestedPrefabData(
            prefabObjectId_ObjectData_Map: Map<string, IObjectData>,
            prefabId_File_Map: Map<string, io.FilePath>,
            nestedPrefabIds: Set<string>,
            file: io.FilePath,
            objData: IObjectData) {

            if (objData.list) {

                for (const c of objData.list) {

                    if (c.private_np || ui.sceneobjects.isNestedPrefabScope(c.scope)) {

                        prefabObjectId_ObjectData_Map.set(c.id, c);
                        prefabId_File_Map.set(c.id, file);
                        nestedPrefabIds.add(c.id);

                        this.mapNestedPrefabData(prefabObjectId_ObjectData_Map, prefabId_File_Map, nestedPrefabIds, file, c);
                    }
                }
            }

            if (objData.nestedPrefabs) {

                for (const c of objData.nestedPrefabs) {

                    prefabObjectId_ObjectData_Map.set(c.id, c);
                    prefabId_File_Map.set(c.id, file);
                    nestedPrefabIds.add(c.id);

                    this.mapNestedPrefabData(prefabObjectId_ObjectData_Map, prefabId_File_Map, nestedPrefabIds, file, c);
                }
            }
        }

        getUserComponentsFiles() {

            return this._compFiles;
        }

        getUserComponentsByFile(file: io.FilePath) {

            return this._compFilename_Data_Map.get(file.getFullName());
        }

        getUserComponentsModels(includeLibraryFiles = true) {

            if (!includeLibraryFiles) {

                return this._compModelsInfo
                    .filter(info => !ide.core.code.isNodeLibraryFile(info.file)
                        && !ide.core.code.isCopiedLibraryFile(info.file))
            }

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

        getSceneFiles(includeLibraryFiles = true) {

            if (!includeLibraryFiles) {

                return this._sceneFiles
                    .filter(f => !ide.core.code.isNodeLibraryFile(f)
                        && !ide.core.code.isCopiedLibraryFile(f))
            }

            return this._sceneFiles;
        }

        getPrefabFiles() {

            return this._prefabFiles;
        }

        getScriptPrefabFiles() {

            return this._prefabFiles.filter(file => this.isScriptPrefabFile(file));
        }

        isScriptPrefabFile(file: io.FilePath) {

            let prefabId = this.getPrefabId(file);

            if (prefabId) {

                prefabId = this.getOriginalPrefabId(prefabId);

                const data = this.getPrefabData(prefabId);

                if (data && data.type === ui.sceneobjects.ScriptNodeExtension
                    .getInstance().getTypeName()) {

                    return true;
                }
            }

            return false;
        }

        getFirstNonNestedPrefabId(prefabId: string): string | undefined {

            if (this.isNestedPrefab(prefabId)) {

                const data = this.getPrefabData(prefabId);

                if (data.prefabId) {

                    return this.getFirstNonNestedPrefabId(data.prefabId);
                }

                return undefined;
            }

            return prefabId;
        }

        getOriginalPrefabId(prefabId: string): string | undefined {

            const objData = this.getPrefabData(prefabId);

            if (!objData) {

                return undefined;
            }

            if (objData.prefabId) {

                return this.getOriginalPrefabId(objData.prefabId);
            }

            return prefabId;
        }

        isNestedPrefab(prefabId: string) {

            return this._nestedPrefabIds.has(prefabId);
        }

        existsPrefab(prefabId: string) {

            return this._prefabObjectId_ObjectData_Map.has(prefabId);
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

        isPrefabVariant(basePrefabFile: io.FilePath, superPrefabFile: io.FilePath) {

            const basePrefabId = this.getPrefabId(basePrefabFile);

            const result = this.getPrefabHierarchy(basePrefabId);

            if (result.indexOf(superPrefabFile) >= 0) {

                return true;
            }

            return false;
        }

        private getPrefabHierarchy2(prefabId: string, result: io.FilePath[]) {

            const file = this.getPrefabFile(prefabId);

            if (file) {

                if (!this.isNestedPrefab(prefabId)) {

                    result.push(file);
                }

                const objData = this.getPrefabData(prefabId);

                if (objData && objData.prefabId) {

                    this.getPrefabHierarchy2(objData.prefabId, result);
                }
            }

            return result;
        }

        isPrefabFile(file: io.FilePath) {

            const data = this.getSceneData(file);

            return data && data.sceneType === SceneType.PREFAB;
        }

        getSceneData(file: io.FilePath) {

            return this._sceneFilename_Data_Map.get(file.getFullName());
        }

        getSceneSettings(file: io.FilePath) {

            return this._sceneFilename_Settings_Map.get(file.getFullName());
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

        printDebugInfo() {

            console.log("Scene Finder debug:")

            for (const prefab of this._prefabFiles) {

                console.log("Prefab file '" + prefab.getFullName() + "'");
            }

            for (const id of this._prefabObjectId_ObjectData_Map.keys()) {

                console.log("Prefab data " + id + ":");
                console.log(this._prefabObjectId_ObjectData_Map.get(id));
            }
        }

        async findUserEvents(): Promise<IUserEvent[]> {

            const result: IUserEvent[] = [];

            for (const file of colibri.ui.ide.FileUtils.getAllFiles()) {

                if (file.getName() === "events.txt") {

                    const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                    const lines = content.split("\n");

                    for (let line of lines) {

                        line = line.trim();

                        if (line.length === 0 || line.startsWith("#")) {

                            continue;
                        }

                        let name = line;
                        let help = "";

                        const i = line.indexOf(" ");

                        if (i > 0) {

                            name = line.substring(0, i);
                            help = line.substring(i + 1);
                        }

                        result.push({ name, help, file });
                    }
                }
            }

            return result;
        }
    }
}