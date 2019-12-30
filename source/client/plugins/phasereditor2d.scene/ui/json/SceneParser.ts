namespace phasereditor2d.scene.ui.json {

    export class SceneParser {

        private _scene: GameScene;

        constructor(scene: GameScene) {
            this._scene = scene;
        }

        static isValidSceneDataFormat(data: SceneData) {
            return "displayList" in data && Array.isArray(data.displayList);
        }

        createScene(data: SceneData) {

            this._scene.setSceneType(data.sceneType);

            for (const objData of data.displayList) {
                this.createObject(objData);
            }
        }

        async createSceneCache_async(sceneData: SceneData) {

            pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);

            const finder = new pack.core.PackFinder();

            await finder.preload();

            for (const objData of sceneData.displayList) {

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(objData.type);

                if (ext) {

                    await ext.updateLoaderWithObjectData({
                        data: objData,
                        finder: finder,
                        scene: this._scene
                    });
                }
            }
        }

        async addToCache_async(data: pack.core.AssetPackItem | pack.core.AssetPackImageFrame) {

            let imageFrameContainerPackItem: pack.core.ImageFrameContainerAssetPackItem = null;

            if (data instanceof pack.core.AssetPackItem) {

                if (data instanceof pack.core.ImageFrameContainerAssetPackItem) {
                    imageFrameContainerPackItem = data;
                }

            } else if (data instanceof pack.core.AssetPackImageFrame) {

                imageFrameContainerPackItem = (data.getPackItem() as pack.core.ImageFrameContainerAssetPackItem);
            }

            if (imageFrameContainerPackItem !== null) {

                await imageFrameContainerPackItem.preload();

                await imageFrameContainerPackItem.preloadImages();

                imageFrameContainerPackItem.addToPhaserCache(this._scene.game);
            }
        }

        createObject(data: ObjectData) {

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
    }
}