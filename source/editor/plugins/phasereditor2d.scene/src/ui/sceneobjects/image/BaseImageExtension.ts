namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseImageExtension extends SceneGameObjectExtension {

        abstract getCodeDOMBuilder(): GameObjectCodeDOMBuilder;

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            const { key, frame } = args.serializer.read(TextureComponent.texture.name, {}) as ITextureKeys;

            const finder = args.finder;

            const item = finder.findAssetPackItem(key);

            if (item) {

                return [item];
            }

            return [];
        }

        static isImageOrImageFrameAsset(data: any) {

            return data instanceof pack.core.AssetPackImageFrame || data instanceof pack.core.ImageAssetPackItem;
        }

        acceptsDropData(data: any): boolean {

            return ImageExtension.isImageOrImageFrameAsset(data);
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            return [this.createImageObject(args.scene, args.x, args.y)];
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneGameObject {

            let key: string;
            let frame: string | number;
            let baseLabel: string;

            if (args.asset instanceof pack.core.AssetPackImageFrame) {

                const packItem = args.asset.getPackItem();

                key = packItem.getKey();
                frame = args.asset.getName();
                baseLabel = frame.toString();

                if (packItem instanceof pack.core.SpritesheetAssetPackItem) {

                    baseLabel = key + frame.toString();
                }

            } else if (args.asset instanceof pack.core.ImageAssetPackItem) {

                key = args.asset.getKey();
                frame = undefined;
                baseLabel = key;
            }

            const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);

            const support = sprite.getEditorSupport();

            support.setLabel(baseLabel);

            const textureComponent = (support.getComponent(TextureComponent) as TextureComponent);
            textureComponent.setTextureKeys({ key, frame });

            return sprite;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneGameObject {

            let key: string;
            let frame: string | number;

            const textureData = args.data as ITextureData;

            if (textureData.texture) {

                key = textureData.texture.key;
                frame = textureData.texture.frame;
            }

            const sprite = this.createImageObject(args.scene, 0, 0, key, frame);

            sprite.getEditorSupport().readJSON(args.data);

            return sprite;
        }

        protected abstract newObject(
            scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject;

        private createImageObject(
            scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            const sprite = this.newObject(scene, x, y, key, frame);

            return sprite;
        }

        adaptDataAfterTypeConversion(serializer: core.json.Serializer, originalObject: ISceneGameObject, extraData: any) {

            const support = originalObject.getEditorSupport();

            if (support.isPrefabInstance()) {

                const textureComponent = support.getComponent(TextureComponent) as TextureComponent;

                if (extraData.keepOriginalTexture) {

                    // create a new serializer with the original prefab
                    // so we can find the real texture, and keep it.

                    const data2 = JSON.parse(JSON.stringify(serializer.getData())) as core.json.IObjectData;
                    data2.prefabId = support.getPrefabId();
                    const serializer2 = serializer.getSerializer(data2);
                    const keys = serializer2.read(TextureComponent.texture.name, {});

                    // we write the texture directly into the data, bypassing unlocking validation of the serializer
                    colibri.core.json.write(serializer.getData(), TextureComponent.texture.name, keys);

                } else {

                    const keys = textureComponent.getTextureKeys();
                    serializer.write(TextureComponent.texture.name, keys, {});
                }
            }

            if (extraData.keepOriginalTexture) {

                serializer.setUnlocked(TextureComponent.texture.name, true);
            }
        }
    }
}