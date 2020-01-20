namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseImageExtension extends SceneObjectExtension {

        abstract getCodeDOMBuilder(): ObjectCodeDOMBuilder;

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

        createEmptySceneObject(args: ICreateEmptyArgs) {

            return this.createImageObject(args.scene, args.x, args.y);
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneObject {

            let key: string;
            let frame: string | number;
            let baseLabel: string;

            if (args.asset instanceof pack.core.AssetPackImageFrame) {

                key = args.asset.getPackItem().getKey();
                frame = args.asset.getName();
                baseLabel = frame.toString();

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

        createSceneObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneObject {

            const sprite = this.createImageObject(args.scene, 0, 0, undefined);

            sprite.getEditorSupport().readJSON(args.data);

            return sprite;
        }

        protected abstract newObject(scene: Scene, key?: string, frame?: string | number): ISceneObject;

        private createImageObject(
            scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneObject {

            const sprite = this.newObject(scene, key, frame);

            const transformObj = sprite as unknown as ITransformLikeObject;
            transformObj.x = x;
            transformObj.y = y;

            sprite.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(sprite);

            return sprite;
        }
    }
}