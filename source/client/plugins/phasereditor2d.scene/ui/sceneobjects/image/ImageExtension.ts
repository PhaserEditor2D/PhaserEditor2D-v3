namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ImageExtension extends SceneObjectExtension {

        private static _instance;

        static getInstance() {
            return this._instance ?? (this._instance = new ImageExtension());
        }

        private constructor() {
            super({
                typeName: "Image",
                phaserTypeName: "Phaser.GameObjects.Image"
            });
        }

        buildNewPrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToCreateMethodDOM(call, args.obj as Image);
        }

        buildAddObjectCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("image", args.gameObjectFactoryExpr);

            this.addArgsToCreateMethodDOM(call, args.obj as Image);

            return call;
        }

        private addArgsToCreateMethodDOM(call: code.MethodCallCodeDOM, obj: Image) {

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            const support = obj.getEditorSupport();

            const textureComponent = obj.getEditorSupport().getTextureComponent();

            if (support.isPrefabInstance()) {

                const prefabSerializer = support.getPrefabSerializer();

                if (prefabSerializer) {

                    const key = prefabSerializer.read(TextureComponent.TEXTURE_KEY_NAME);

                    if (key === textureComponent.getKey()) {

                        return call;
                    }

                } else {

                    throw new Error(`Cannot find prefab with id ${support.getPrefabId()}.`);
                }
            }

            call.argLiteral(textureComponent.getKey());

            const frame = textureComponent.getFrame();

            if (typeof frame === "number") {

                call.argInt(frame);

            } else {

                call.argLiteral(frame);
            }

        }

        async getAssetsFromObjectData(args: GetAssetsFromObjectArgs): Promise<any[]> {

            const key = args.serializer.read("textureKey");

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

        createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject {

            let key: string;
            let frame: string | number;
            let baseLabel: string;

            if (args.asset instanceof pack.core.AssetPackImageFrame) {

                key = args.asset.getPackItem().getKey();
                frame = args.asset.getName();
                baseLabel = frame.toString();

            } else if (args.asset instanceof pack.core.ImageAssetPackItem) {

                key = args.asset.getKey();
                frame = null;
                baseLabel = key;
            }

            const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);

            const support = sprite.getEditorSupport();

            support.setLabel(args.nameMaker.makeName(baseLabel));
            support.getTextureComponent().setTexture(key, frame);

            return sprite;
        }

        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject {

            const sprite = this.createImageObject(args.scene, 0, 0, undefined);

            sprite.getEditorSupport().readJSON(args.data);

            return sprite;
        }

        private createImageObject(scene: GameScene, x: number, y: number, key: string, frame?: string | number) {

            const sprite = new sceneobjects.Image(scene, x, y, key, frame);

            sprite.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(sprite);

            return sprite;
        }
    }
}