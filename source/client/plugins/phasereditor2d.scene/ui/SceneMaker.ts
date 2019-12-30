
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class SceneMaker {

        private _scene: GameScene;

        constructor(scene: GameScene) {
            this._scene = scene;
        }

        static isValidSceneDataFormat(data: json.SceneData) {
            return "displayList" in data && Array.isArray(data.displayList);
        }

        createScene(data: json.SceneData) {

            this._scene.setSceneType(data.sceneType);

            for (const objData of data.displayList) {

                this.createObject(objData);
            }
        }

        async updateSceneLoader(sceneData: json.SceneData) {

            pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);

            const finder = new pack.core.PackFinder();

            await finder.preload();

            for (const objData of sceneData.displayList) {

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(objData.type);

                if (ext) {

                    const assets = await ext.getAssetsFromObjectData({
                        data: objData,
                        finder: finder,
                        scene: this._scene
                    });

                    for (const asset of assets) {

                        const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                        if (updater) {

                            await updater.updateLoader(this._scene, asset);
                        }
                    }
                }
            }
        }

        createObject(data: json.ObjectData) {

            const type = data.type;

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

            if (ext) {

                const sprite = ext.createSceneObjectWithData({
                    data: data,
                    scene: this._scene
                });

                if (sprite) {

                    sprite.getEditorSupport().readJSON(data);

                }

                return sprite;

            } else {

                console.error(`SceneParser: no extension is registered for type "${type}".`);
            }

            return null;
        }

        createContainerWithObjects(objectList: sceneobjects.SceneObject[]): sceneobjects.Container {

            throw new Error("Not implemented yet. Needs revision!");

            // const container = sceneobjects.Container.add(this._scene, 0, 0, objectList);

            // const name = this._scene.makeNewName("container");

            // container.getEditorSupport().setLabel(name);

            // json.SceneParser.setNewId(container);

            // return container;
        }

        async createWithDropEvent(e: DragEvent, dropAssetArray: any[]) {

            const exts = ScenePlugin.getInstance().getObjectExtensions();

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.SceneObject).getEditorSupport().getLabel();
            });

            this._scene.visit(obj => nameMaker.update([obj]));

            const worldPoint = this._scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
            const x = worldPoint.x;
            const y = worldPoint.y;

            for (const data of dropAssetArray) {

                const ext = ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);

                if (ext) {

                    await ext.updateLoader(this._scene, data);
                }
            }

            const sprites: sceneobjects.SceneObject[] = [];

            for (const data of dropAssetArray) {

                for (const ext of exts) {

                    if (ext.acceptsDropData(data)) {

                        const sprite = ext.createSceneObjectWithAsset({
                            x: x,
                            y: y,
                            asset: data,
                            nameMaker: nameMaker,
                            scene: this._scene
                        });

                        sprites.push(sprite);
                    }
                }
            }

            return sprites;
        }
    }
}