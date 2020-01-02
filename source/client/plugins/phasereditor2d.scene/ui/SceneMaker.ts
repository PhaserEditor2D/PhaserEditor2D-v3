
namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

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

                const objData2 = objData;

                if (objData2.prefabId) {
                    
                    const ser = this.getSerializer(objData2);
                }

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(objData2.type);

                if (ext) {

                    const assets = await ext.getAssetsFromObjectData({
                        data: objData2,
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