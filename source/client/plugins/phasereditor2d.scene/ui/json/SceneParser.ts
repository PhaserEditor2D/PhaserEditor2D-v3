
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

        async createSceneCache_async(data: SceneData) {

            pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);

            for (const objData of data.displayList) {
                await this.updateSceneCacheWithObjectData_async(objData);
            }
        }

        private async updateSceneCacheWithObjectData_async(objData: any) {

            const type = objData.type;

            switch (type) {

                case "Image": {

                    const key = objData[TextureComponent.textureKey];

                    const finder = new pack.core.PackFinder();

                    await finder.preload();

                    const item = finder.findAssetPackItem(key);

                    if (item) {
                        await this.addToCache_async(item);
                    }

                    break;
                }

                case "Container":

                    for (const childData of objData.list) {
                        await this.updateSceneCacheWithObjectData_async(childData);
                    }

                    break;
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

        createObject(data: any) {

            const type = data.type;

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

            if (ext) {

                const sprite = ext.createSceneObjectWithData({
                    data: data,
                    scene: this._scene
                });

                if (sprite) {

                    sprite.getEditorSupport().setScene(this._scene);

                    sprite.readJSON(data);

                    SceneParser.initSprite(sprite);
                }

                return sprite;

            } else {

                console.error(`SceneParser: no extension is registered for type "${type}".`);
            }

            return null;
        }

        static initSprite(sprite: Phaser.GameObjects.GameObject) {

            sprite.setDataEnabled();

            if (sprite instanceof sceneobjects.Image) {
                sprite.setInteractive();
            }

        }

        static setNewId(sprite: sceneobjects.SceneObject) {
            sprite.getEditorSupport().setId(Phaser.Utils.String.UUID());
        }

    }

}