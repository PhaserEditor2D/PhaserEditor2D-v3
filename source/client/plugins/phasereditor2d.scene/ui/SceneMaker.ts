
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;
    import json = core.json;
    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneMaker {

        private _scene: Scene;

        constructor(scene: Scene) {
            this._scene = scene;
        }

        static isValidSceneDataFormat(data: json.SceneData) {
            return "displayList" in data && Array.isArray(data.displayList);
        }

        async preload() {
            // nothing for now
        }

        async buildDependenciesHash() {

            const builder = new phasereditor2d.ide.core.MultiHashBuilder();

            for (const obj of this._scene.getDisplayListChildren()) {

                await obj.getEditorSupport().buildDependencyHash(builder);
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

                const prefabData = JSON.parse(content) as json.SceneData;

                const obj = this.createObject({
                    id: Phaser.Utils.String.UUID(),
                    prefabId: prefabData.id,
                    label: "temporal"
                });

                return obj;

            } catch (e) {

                console.error(e);

                return null;
            }
        }

        getSerializer(data: json.ObjectData) {
            return new json.Serializer(data);
        }

        createScene(sceneData: json.SceneData) {

            if (sceneData.settings) {

                this._scene.getSettings().readJSON(sceneData.settings);
            }

            this._scene.setSceneType(sceneData.sceneType);

            // removes this condition, it is used temporal for compatibility
            this._scene.setId(sceneData.id);

            for (const objData of sceneData.displayList) {

                this.createObject(objData);
            }
        }

        async updateSceneLoader(sceneData: json.SceneData) {

            pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);

            const finder = new pack.core.PackFinder();

            await finder.preload();

            for (const objData of sceneData.displayList) {

                const ser = this.getSerializer(objData);

                const type = ser.getType();

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

                if (ext) {

                    const assets = await ext.getAssetsFromObjectData({
                        serializer: ser,
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