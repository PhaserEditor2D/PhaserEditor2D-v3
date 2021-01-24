/// <reference path="./BaseSceneMaker.ts" />
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneMaker extends BaseSceneMaker {

        private _editorScene: Scene;

        constructor(scene: Scene) {
            super(scene);

            this._editorScene = scene;
        }

        afterDropObjects(prefabObj: sceneobjects.ISceneGameObject, sprites: sceneobjects.ISceneGameObject[]) {

            let container: sceneobjects.Container;
            let layer: sceneobjects.Layer;

            for (const sprite of this._editorScene.getEditor().getSelectedGameObjects()) {

                let sprite2 = sprite;

                if (sprite2.getEditorSupport().isPrefabInstance()) {

                    sprite2 = sceneobjects.getObjectParent(sprite2.getEditorSupport().getOwnerPrefabInstance());
                }

                if (sprite2) {

                    if (sprite2 instanceof sceneobjects.Container) {

                        container = sprite2;

                    } else if (sprite2.parentContainer) {

                        container = sprite2.parentContainer as sceneobjects.Container;

                    } else if (sprite2 instanceof sceneobjects.Layer) {

                        layer = sprite2;

                    } else if (sprite2.displayList instanceof sceneobjects.Layer) {

                        layer = sprite2.displayList;
                    }
                }
            }

            if (container) {

                for (const obj of sprites) {

                    if (obj instanceof sceneobjects.Layer) {

                        continue;
                    }

                    const sprite = obj as sceneobjects.Sprite;
                    const p = new Phaser.Math.Vector2();
                    sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                    this._editorScene.sys.displayList.remove(sprite);
                    container.add(sprite);

                    container.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
                    sprite.x = p.x;
                    sprite.y = p.y;
                }

            } else if (layer) {

                for (const obj of sprites) {

                    layer.add(obj);
                }

            } else {

                this.afterDropObjectsInPrefabScene(prefabObj, sprites);
            }
        }

        private afterDropObjectsInPrefabScene(prefabObj: sceneobjects.ISceneGameObject, sprites: sceneobjects.ISceneGameObject[]) {

            if (!prefabObj) {

                return;
            }

            const scene = prefabObj.getEditorSupport().getScene();

            if (!scene.isPrefabSceneType()) {

                return;
            }

            let parent: sceneobjects.Container | sceneobjects.Layer;

            if (scene.isPrefabSceneType()) {

                if (sprites.length > 0) {

                    if (prefabObj instanceof sceneobjects.Container || prefabObj instanceof sceneobjects.Layer) {

                        parent = prefabObj;

                    } else {

                        [parent] = sceneobjects.ContainerExtension.getInstance().createDefaultSceneObject({
                            scene: scene,
                            x: 0,
                            y: 0
                        });

                        parent.getEditorSupport().setLabel(scene.makeNewName("container"));

                        scene.sys.displayList.remove(prefabObj);
                        parent.add(prefabObj);
                    }

                    if (parent) {

                        for (const sprite of sprites) {

                            if (parent instanceof sceneobjects.Container) {

                                if (sprite.getEditorSupport().hasComponent(sceneobjects.TransformComponent)) {

                                    (sprite as sceneobjects.Sprite).x -= parent.x;
                                    (sprite as sceneobjects.Sprite).y -= parent.y;
                                }
                            }

                            scene.sys.displayList.remove(sprite);

                            parent.add(sprite);
                        }

                        if (parent !== prefabObj && parent instanceof sceneobjects.Container) {

                            parent.getEditorSupport().trim();
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

        async buildDependenciesHash() {

            const builder = new phasereditor2d.ide.core.MultiHashBuilder();

            for (const obj of this._editorScene.getDisplayListChildren()) {

                await obj.getEditorSupport().buildDependencyHash({ builder });
            }

            this._editorScene.getPackCache().buildAssetsDependenciesHash(builder);

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

                this._editorScene.getSettings().readJSON(sceneData.settings);
            }

            if (sceneData.lists) {

                this._editorScene.getObjectLists().readJSON(sceneData);
            }

            if (sceneData.plainObjects) {

                this._editorScene.readPlainObjects(sceneData.plainObjects);
            }

            if (sceneData.prefabProperties) {

                this._editorScene.getPrefabUserProperties().readJSON(sceneData.prefabProperties);
            }

            this._editorScene.setSceneType(sceneData.sceneType || core.json.SceneType.SCENE);

            // removes this condition, it is used temporal for compatibility
            this._editorScene.setId(sceneData.id);

            for (const objData of sceneData.displayList) {

                this.createObject(objData, errors);
            }
        }

        async updateSceneLoader(sceneData: json.ISceneData, monitor?: controls.IProgressMonitor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            await this.updateSceneLoaderWithGameObjectDataList(finder, sceneData.displayList, monitor);

            await this.updateSceneLoaderWithPlainObjDataList(finder, sceneData.plainObjects, monitor);
        }

        async updateSceneLoaderWithPlainObjDataList(finder: pack.core.PackFinder, list: json.IScenePlainObjectData[], monitor?: controls.IProgressMonitor) {

            if (!list) {

                return;
            }

            const assets = [];

            for (const data of list) {

                try {

                    const type = data.type;

                    const ext = ScenePlugin.getInstance().getPlainObjectExtensionByObjectType(type);

                    if (ext) {

                        const result = await ext.getAssetsFromObjectData({
                            scene: this._editorScene,
                            finder,
                            data
                        });

                        assets.push(...result);
                    }

                } catch (e) {

                    console.error(e);
                }
            }

            await this.updateSceneLoaderWithAssets(assets, monitor);
        }

        async updateSceneLoaderWithGameObjectDataList(finder: pack.core.PackFinder, list: json.IObjectData[], monitor?: controls.IProgressMonitor) {

            const assets = [];

            for (const objData of list) {

                try {

                    const ser = this.getSerializer(objData);

                    const type = ser.getType();

                    const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                    if (ext) {

                        const objAssets = await ext.getAssetsFromObjectData({
                            serializer: ser,
                            finder: finder,
                            scene: this._editorScene
                        });

                        assets.push(...objAssets);
                    }

                } catch (e) {

                    console.error(e);
                }
            }

            await this.updateSceneLoaderWithAssets(assets, monitor);
        }

        async updateSceneLoaderWithAssets(assets: any[], monitor?: controls.IProgressMonitor) {

            if (monitor) {

                monitor.addTotal(assets.length);
            }

            for (const asset of assets) {

                const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                if (updater) {

                    await updater.updateLoader(this._editorScene, asset);

                    if (monitor) {

                        monitor.step();
                    }
                }
            }
        }

        getCanvasCenterPoint() {

            const canvas = this._editorScene.game.canvas;

            let x = canvas.width / 2;
            let y = canvas.height / 2;

            const worldPoint = this._editorScene.getCamera().getWorldPoint(x, y);

            x = Math.floor(worldPoint.x);
            y = Math.floor(worldPoint.y);

            return { x, y };
        }

        createDefaultObject(ext: sceneobjects.SceneObjectExtension, extraData?: any, x?: number, y?: number) {

            if (x === undefined) {

                const point = this.getCanvasCenterPoint();

                x = point.x;
                y = point.y;
            }

            const newObjects = ext.createDefaultSceneObject({
                scene: this._editorScene,
                x,
                y,
                extraData
            });

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.ISceneGameObject).getEditorSupport().getLabel();
            });

            for (const newObject of newObjects) {

                this._editorScene.visit(obj => {

                    if (obj !== newObject) {

                        nameMaker.update([obj]);
                    }
                });

                const oldLabel = newObject.getEditorSupport().getLabel();

                const newLabel = nameMaker.makeName(oldLabel);

                newObject.getEditorSupport().setLabel(newLabel);
            }

            return newObjects;
        }

        createObject(data: json.IObjectData, errors?: string[]) {

            try {

                const ser = this.getSerializer(data);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                if (ext) {

                    const sprite = ext.createGameObjectWithData({
                        data: data,
                        scene: this._editorScene
                    });

                    return sprite;

                } else {

                    const msg = `SceneMaker: no extension is registered for type "${type}".`;

                    if (errors) {

                        errors.push(msg);
                    }

                    console.error(msg);
                }

                return null;

            } catch (e) {

                const msg = (e as Error).message;

                if (errors) {

                    errors.push(msg);
                }

                console.error(e);

                return null;
            }
        }
    }
}