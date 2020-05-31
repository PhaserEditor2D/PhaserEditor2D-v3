
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneMaker {

        private _scene: Scene;
        private _packFinder: pack.core.PackFinder;

        constructor(scene: Scene) {
            this._scene = scene;
            this._packFinder = new pack.core.PackFinder();
        }

        static acceptDropFile(dropFile: io.FilePath, editorFile: io.FilePath) {

            if (dropFile.getFullName() === editorFile.getFullName()) {

                return false;
            }

            const sceneFinder = ScenePlugin.getInstance().getSceneFinder();

            const sceneData = sceneFinder.getSceneData(dropFile);

            if (sceneData) {

                if (sceneData.sceneType !== core.json.SceneType.PREFAB) {

                    return false;
                }

                if (sceneData.displayList.length === 0) {

                    return false;
                }

                const objData = sceneData.displayList[sceneData.displayList.length - 1];

                if (objData.prefabId) {

                    const prefabFile = sceneFinder.getPrefabFile(objData.prefabId);

                    if (prefabFile) {

                        return this.acceptDropFile(prefabFile, editorFile);
                    }
                }

                return true;
            }

            return false;
        }

        static isValidSceneDataFormat(data: json.ISceneData) {
            return "displayList" in data && Array.isArray(data.displayList);
        }

        getPackFinder() {
            return this._packFinder;
        }

        async preload() {

            await this._packFinder.preload();

            const updaters = ScenePlugin.getInstance().getLoaderUpdaters();

            for (const updater of updaters) {

                updater.clearCache(this._scene.game);
            }
        }

        async buildDependenciesHash() {

            const builder = new phasereditor2d.ide.core.MultiHashBuilder();

            for (const obj of this._scene.getDisplayListChildren()) {

                await obj.getEditorSupport().buildDependencyHash({ builder });
            }

            const cache = this._scene.getPackCache();

            const files = new Set<io.FilePath>();

            for (const asset of cache.getAssets()) {

                files.add(asset.getPack().getFile());

                asset.computeUsedFiles(files);
            }

            for (const file of files) {

                builder.addPartialFileToken(file);
            }

            const hash = builder.build();

            return hash;
        }

        isPrefabFile(file: io.FilePath) {

            const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            if (ct === core.CONTENT_TYPE_SCENE) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const data = finder.getSceneData(file);

                return data && data.sceneType === json.SceneType.PREFAB;
            }

            return false;
        }

        async createPrefabInstanceWithFile(file: io.FilePath) {

            const content = await FileUtils.preloadAndGetFileString(file);

            if (!content) {
                return null;
            }

            try {

                const prefabData = JSON.parse(content) as json.ISceneData;

                const obj = this.createObject({
                    id: Phaser.Utils.String.UUID(),
                    prefabId: prefabData.id,
                    label: "temporal"
                });

                const { x, y } = this.getCanvasCenterPoint();

                const transformComponent = obj.getEditorSupport()
                    .getComponent(sceneobjects.TransformComponent) as sceneobjects.TransformComponent;

                if (transformComponent) {

                    const sprite = obj as unknown as sceneobjects.ITransformLikeObject;

                    sprite.x = x;
                    sprite.y = y;
                }

                return obj;

            } catch (e) {

                console.error(e);

                return null;
            }
        }

        getSerializer(data: json.IObjectData) {
            return new json.Serializer(data);
        }

        createScene(sceneData: json.ISceneData) {

            if (sceneData.settings) {

                this._scene.getSettings().readJSON(sceneData.settings);
            }

            if (sceneData.lists) {

                this._scene.getObjectLists().readJSON(sceneData);
            }

            if (sceneData.prefabProperties) {

                this._scene.getUserProperties().readJSON(sceneData.prefabProperties);
            }

            this._scene.setSceneType(sceneData.sceneType);

            // removes this condition, it is used temporal for compatibility
            this._scene.setId(sceneData.id);

            for (const objData of sceneData.displayList) {

                this.createObject(objData);
            }
        }

        async updateSceneLoader(sceneData: json.ISceneData, monitor?: controls.IProgressMonitor) {

            await this.updateSceneLoaderWithObjDataList(sceneData.displayList, monitor);
        }

        async updateSceneLoaderWithObjDataList(list: json.IObjectData[], monitor?: controls.IProgressMonitor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const assets = [];

            for (const objData of list) {

                const ser = this.getSerializer(objData);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

                if (ext) {

                    const objAssets = await ext.getAssetsFromObjectData({
                        serializer: ser,
                        finder: finder,
                        scene: this._scene
                    });

                    assets.push(...objAssets);
                }
            }

            if (monitor) {

                monitor.addTotal(assets.length);
            }

            for (const asset of assets) {

                const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                if (updater) {

                    await updater.updateLoader(this._scene, asset);

                    if (monitor) {

                        monitor.step();
                    }
                }
            }
        }

        getCanvasCenterPoint() {

            const canvas = this._scene.game.canvas;

            let x = canvas.width / 2;
            let y = canvas.height / 2;

            const worldPoint = this._scene.getCamera().getWorldPoint(x, y);

            x = Math.floor(worldPoint.x);
            y = Math.floor(worldPoint.y);

            return { x, y };
        }

        createEmptyObject(ext: sceneobjects.SceneObjectExtension, extraData?: any) {

            const { x, y } = this.getCanvasCenterPoint();

            const newObject = ext.createEmptySceneObject({
                scene: this._scene,
                x,
                y,
                extraData
            });

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.ISceneObject).getEditorSupport().getLabel();
            });

            this._scene.visit(obj => nameMaker.update([obj]));

            newObject.getEditorSupport().setLabel(nameMaker.makeName(ext.getTypeName().toLowerCase()));

            return newObject;
        }

        createObject(data: json.IObjectData) {

            const ser = this.getSerializer(data);

            const type = ser.getType();

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

            if (ext) {

                const sprite = ext.createSceneObjectWithData({
                    data: data,
                    scene: this._scene
                });

                return sprite;

            } else {

                console.error(`SceneMaker: no extension is registered for type "${type}".`);
            }

            return null;
        }
    }
}