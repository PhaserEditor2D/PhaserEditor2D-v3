namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseImageExtension extends SceneGameObjectExtension {

        abstract getCodeDOMBuilder(): GameObjectCodeDOMBuilder;

        static async getAssetsFromObjectWithTextureData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            const { key } = args.serializer.read(TextureComponent.texture.name, {}) as ITextureKeys;

            const finder = args.finder;

            const item = finder.findAssetPackItem(key);

            if (item) {

                return [item];
            }

            return [];
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            const assets1 = await BaseImageExtension.getAssetsFromObjectWithTextureData(args);

            // Maybe it contains FX objects depending on textures
            const assets2 = await ContainerExtension.getAssetsFromNestedData(args);

            return [...assets1, ...assets2];
        }

        static isImageOrImageFrameAsset(data: any) {

            return data instanceof pack.core.AssetPackImageFrame || data instanceof pack.core.ImageAssetPackItem;
        }

        acceptsDropData(data: any): boolean {

            return ImageExtension.isImageOrImageFrameAsset(data);
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            let key: string;
            let frame: string | number;

            if (args.extraData) {

                const result = this.getKeyFrameFromAsset(args.extraData);
                key = result.key;
                frame = result.frame;
            }

            const obj = this.createImageObject(args.scene, args.x, args.y, key, frame);

            if (key) {

                const textureComponent = (obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent);
                textureComponent.setTextureKeys({ key, frame });
            }

            return [obj];
        }

        private getKeyFrameFromAsset(data: any) {

            let key: string;
            let frame: string | number;
            let baseLabel: string;

            if (data instanceof pack.core.AssetPackImageFrame) {

                const packItem = data.getPackItem();

                key = packItem.getKey();
                frame = data.getName();
                baseLabel = frame.toString();

                if (packItem instanceof pack.core.SpritesheetAssetPackItem) {

                    baseLabel = key + frame.toString();
                }

            } else if (data instanceof pack.core.ImageAssetPackItem) {

                key = data.getKey();
                frame = undefined;
                baseLabel = key;
            }

            return { key, frame, baseLabel };
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneGameObject {

            const { key, frame, baseLabel } = this.getKeyFrameFromAsset(args.asset);

            const obj = this.createImageObject(args.scene, args.x, args.y, key, frame);

            const objES = obj.getEditorSupport();

            objES.setLabel(baseLabel);

            const textureComponent = (objES.getComponent(TextureComponent) as TextureComponent);
            textureComponent.setTextureKeys({ key, frame });

            return obj;
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

        async collectTextureDataCreateDefaultObject(editor: editor.SceneEditor) {

            const selected = await TextureSelectionDialog.selectOneTexture(editor, [], "No Texture");

            const ext = ScenePlugin.getInstance().getLoaderUpdaterForAsset(selected);

            if (ext) {

                await ext.updateLoader(editor.getScene(), selected);
            }

            return {
                data: selected
            };
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