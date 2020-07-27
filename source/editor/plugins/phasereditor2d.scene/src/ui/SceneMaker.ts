
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

        afterDropObjects(prefabObj: sceneobjects.ISceneObject, sprites: sceneobjects.ISceneObject[]) {

            let container: sceneobjects.Container;

            for (const sprite of this._scene.getEditor().getSelectedGameObjects()) {

                if (sprite instanceof sceneobjects.Container) {

                    container = sprite;

                } else if (sprite.parentContainer) {

                    container = sprite.parentContainer as sceneobjects.Container;
                }
            }

            if (container) {

                for (const obj of sprites) {

                    const sprite = obj as sceneobjects.Sprite;
                    const p = new Phaser.Math.Vector2();
                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    this._scene.sys.displayList.remove(sprite);
                    container.add(sprite);

                    container.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
                    sprite.x = p.x;
                    sprite.y = p.y;
                }

            } else {

                this.afterDropObjectsInPrefabScene(prefabObj, sprites);
            }
        }

        private afterDropObjectsInPrefabScene(prefabObj: sceneobjects.ISceneObject, sprites: sceneobjects.ISceneObject[]) {

            if (!prefabObj) {
                return;
            }

            const scene = prefabObj.getEditorSupport().getScene();

            if (!scene.isPrefabSceneType()) {

                return;
            }

            let container: sceneobjects.Container;

            if (scene.isPrefabSceneType()) {

                if (sprites.length > 0) {

                    if (prefabObj instanceof sceneobjects.Container) {

                        container = prefabObj;

                    } else {

                        container = sceneobjects.ContainerExtension.getInstance().createEmptySceneObject({
                            scene: scene,
                            x: 0,
                            y: 0
                        });

                        container.getEditorSupport().setLabel(scene.makeNewName("container"));

                        scene.sys.displayList.remove(prefabObj);
                        container.add(prefabObj);
                    }

                    if (container) {

                        for (const sprite of sprites) {

                            if (sprite.getEditorSupport().hasComponent(sceneobjects.TransformComponent)) {

                                (sprite as sceneobjects.Sprite).x -= container.x;
                                (sprite as sceneobjects.Sprite).y -= container.y;
                            }

                            scene.sys.displayList.remove(sprite);
                            container.add(sprite);
                        }

                        if (container !== prefabObj) {

                            container.getEditorSupport().trim();
                        }
                    }
                }
            }
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

        createScene(sceneData: json.ISceneData, errors?: string[]) {

            if (sceneData.settings) {

                this._scene.getSettings().readJSON(sceneData.settings);
            }

            if (sceneData.lists) {

                this._scene.getObjectLists().readJSON(sceneData);
            }

            if (sceneData.prefabProperties) {

                this._scene.getPrefabUserProperties().readJSON(sceneData.prefabProperties);
            }

            this._scene.setSceneType(sceneData.sceneType || core.json.SceneType.SCENE);

            // removes this condition, it is used temporal for compatibility
            this._scene.setId(sceneData.id);

            for (const objData of sceneData.displayList) {

                this.createObject(objData, errors);
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

                try {
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
                } catch (e) {

                    console.error(e);
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

        createObject(data: json.IObjectData, errors?: string[]) {

            try {

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

                    const msg = `SceneMaker: no extension is registered for type "${type}".`;

                    errors.push(msg);

                    console.error(msg);
                }

                return null;

            } catch (e) {

                const msg = (e as Error).message;

                errors.push(msg);

                console.error(msg);

                return null;
            }
        }
    }
}