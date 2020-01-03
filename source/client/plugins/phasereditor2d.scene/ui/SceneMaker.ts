
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;
    import FileUtils = colibri.ui.ide.FileUtils;

    export class SceneMaker {

        private _scene: GameScene;
        private _sceneDataTable: json.SceneDataTable;

        constructor(scene: GameScene) {
            this._scene = scene;
            this._sceneDataTable = new json.SceneDataTable();
        }

        static isValidSceneDataFormat(data: json.SceneData) {
            return "displayList" in data && Array.isArray(data.displayList);
        }

        async preload() {
            await this._sceneDataTable.preload();
        }

        isPrefabFile(file: io.FilePath) {

            const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            // TODO: missing to check if it is a scene of type prefab.

            return ct === core.CONTENT_TYPE_SCENE;
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
                    prefabId: prefabData.id
                });

                return obj;

            } catch (e) {

                console.error(e);

                return null;
            }
        }

        getSceneDataTable() {
            return this._sceneDataTable;
        }

        getSerializer(data: json.ObjectData) {
            return new json.Serializer(data, this._sceneDataTable);
        }

        createScene(data: json.SceneData) {

            this._scene.setSceneType(data.sceneType);

            // removes this condition, it is used temporal for compatibility
            if (data.id) {
                this._scene.setId(data.id);
            }

            for (const objData of data.displayList) {

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

                if (sprite) {

                    sprite.getEditorSupport().readJSON(this.getSerializer(data));

                }

                return sprite;

            } else {

                console.error(`SceneMaker: no extension is registered for type "${type}".`);
            }

            return null;
        }
    }
}