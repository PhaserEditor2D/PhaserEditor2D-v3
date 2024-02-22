/// <reference path="./BaseSceneMaker.ts" />
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneMaker extends BaseSceneMaker {

        private _editorScene: Scene;

        constructor(scene: Scene) {
            super(scene);

            this._editorScene = scene;
        }

        private findDropScriptTargetParent(obj: sceneobjects.ISceneGameObject) {

            // if (obj instanceof sceneobjects.ScriptNode) {

            //     return obj;
            // }

            // const parent = obj.getEditorSupport().getObjectParent();

            // const objES = obj.getEditorSupport();

            // if (objES.isPrefabInstanceElement() && !objES.isMutableNestedPrefabInstance()) {

            //     if (parent) {

            //         return this.findDropTargetParent(parent);
            //     }

            //     return undefined;
            // }

            return obj;
        }

        private findDropTargetParent(obj: sceneobjects.ISceneGameObject) {

            const parent = obj.getEditorSupport().getObjectParent();

            if (obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer) {

                const objES = obj.getEditorSupport();

                if (objES.isPrefabInstanceElement() || objES.isPrefabInstance()) {

                    if (!objES.isAllowAppendChildren() || objES.isPrefabInstanceElement() && !objES.isMutableNestedPrefabInstance()) {

                        if (parent) {

                            return this.findDropTargetParent(parent);
                        }

                        return undefined;
                    }
                }

                return obj;
            }

            if (parent) {

                return this.findDropTargetParent(parent);
            }

            return undefined;
        }

        afterDropObjects(prefabObj: sceneobjects.ISceneGameObject, dropObjects: sceneobjects.ISceneGameObject[], alternativeSelection?: sceneobjects.ISceneGameObject[]) {

            let dropInContainer: sceneobjects.Container;
            let dropInObj: sceneobjects.ISceneGameObject;

            const selection = alternativeSelection
                || this._editorScene.getEditor().getSelectedGameObjects();

            const areDroppingScriptNodes = dropObjects.filter(obj => obj instanceof sceneobjects.ScriptNode).length === dropObjects.length;

            for (const sprite of selection) {

                const dropTarget = areDroppingScriptNodes ? this.findDropScriptTargetParent(sprite) : this.findDropTargetParent(sprite);

                if (dropTarget) {

                    if (areDroppingScriptNodes) {

                        dropInObj = dropTarget;

                    } else if (dropTarget instanceof sceneobjects.Container) {

                        dropInContainer = dropTarget;

                    } else if (dropTarget instanceof sceneobjects.Layer) {

                        dropInObj = dropTarget;

                    } else if (dropTarget.displayList instanceof sceneobjects.Layer) {

                        dropInObj = dropTarget.displayList;
                    }
                }
            }

            if (dropInContainer) {

                for (const dropObj of dropObjects) {

                    if (dropObj instanceof sceneobjects.Layer) {

                        continue;
                    }

                    if (dropObj.getEditorSupport().isDisplayObject()) {

                        const sprite = dropObj as sceneobjects.Sprite;
                        const p = new Phaser.Math.Vector2();
                        sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                        this._editorScene.removeGameObject(sprite);
                        dropInContainer.getEditorSupport().addObjectChild(sprite);

                        dropInContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
                        sprite.x = p.x;
                        sprite.y = p.y;

                    } else {

                        dropInContainer.getEditorSupport().addObjectChild(dropObj);
                    }
                }

            } else if (dropInObj) {

                for (const obj of dropObjects) {

                    dropInObj.getEditorSupport().addObjectChild(obj);
                }

            } else {

                this.afterDropObjectsInPrefabScene(prefabObj, dropObjects);
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

            const dropOnlyScripts = sprites
                .filter(obj => obj instanceof sceneobjects.ScriptNode).length === sprites.length;

            let parent: sceneobjects.Container | sceneobjects.Layer | sceneobjects.ScriptNode;

            if (scene.isPrefabSceneType()) {

                if (sprites.length > 0) {

                    const prefabObjES = prefabObj.getEditorSupport();

                    if ((!prefabObjES.isPrefabInstance() || prefabObjES.isAllowAppendChildren())
                        && (prefabObj instanceof sceneobjects.Container
                            || prefabObj instanceof sceneobjects.Layer
                            || (dropOnlyScripts && prefabObj instanceof sceneobjects.ScriptNode))) {

                        parent = prefabObj;

                    } else {

                        [parent] = sceneobjects.ContainerExtension.getInstance().createDefaultSceneObject({
                            scene: scene,
                            x: 0,
                            y: 0
                        });

                        parent.getEditorSupport().setLabel(scene.makeNewName("container"));

                        scene.removeGameObject(prefabObj);
                        parent.getEditorSupport().addObjectChild(prefabObj);
                    }

                    if (parent) {

                        for (const sprite of sprites) {

                            if (parent instanceof sceneobjects.Container) {

                                if (sprite.getEditorSupport().hasComponent(sceneobjects.TransformComponent)) {

                                    (sprite as sceneobjects.Sprite).x -= parent.x;
                                    (sprite as sceneobjects.Sprite).y -= parent.y;
                                }
                            }

                            scene.removeGameObject(sprite);

                            const parentES: sceneobjects.GameObjectEditorSupport<any> = parent.getEditorSupport();

                            parentES.addObjectChild(sprite);
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

            for (const obj of this._editorScene.getGameObjects()) {

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

                const objES = obj.getEditorSupport();

                if (objES.isUnlockedProperty(sceneobjects.TransformComponent.x)) {

                    const { x, y } = this.getCanvasCenterPoint();

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

            const version = sceneData.meta.version ?? 1;

            this._editorScene.setVersion(version);

            // if (version === 1) {
            //     // old version, perform unlock x & y migration
            //     new json.Version1ToVersion2Migration().migrate(sceneData);
            // }

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

            if (sceneData.codeSnippets) {

                this._editorScene.getCodeSnippets().readJSON(sceneData.codeSnippets);
            }

            this._editorScene.setSceneType(sceneData.sceneType || core.json.SceneType.SCENE);

            // removes this condition, it is used temporal for compatibility
            this._editorScene.setId(sceneData.id);

            for (const objData of sceneData.displayList) {

                this.createObject(objData, errors);
            }
        }

        async updateSceneLoader(sceneData: json.ISceneData, monitor?: controls.IProgressMonitor) {

            await this.updateLoaderWithData(sceneData.plainObjects, sceneData.displayList, monitor);
        }

        async updateLoaderWithData(plainObjects: json.IScenePlainObjectData[], displayObjects: json.IObjectData[], monitor?: controls.IProgressMonitor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            await this.updateSceneLoaderWithGameObjectDataList(finder, displayObjects, monitor);

            await this.updateSceneLoaderWithPlainObjDataList(finder, plainObjects, monitor);
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

            const nameMaker = this._editorScene.createNameMaker();

            for (const newObject of newObjects) {

                const oldLabel = newObject.getEditorSupport().getLabel();

                const newLabel = nameMaker.makeName(oldLabel);

                newObject.getEditorSupport().setLabel(newLabel);
            }

            return newObjects;
        }

        createObject(data: json.IObjectData, errors?: string[], parent?: sceneobjects.ISceneGameObject) {

            try {

                const ser = this.getSerializer(data);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                if (ext) {

                    const sprite = ext.createGameObjectWithData({
                        data: data,
                        parent,
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