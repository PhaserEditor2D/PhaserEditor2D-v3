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

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: BuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");

            const obj = args.prefabObj as Image;

            const textureComponent = obj.getEditorSupport().getTextureComponent();

            const key = textureComponent.getKey();

            const frame = textureComponent.getFrame();

            if (typeof key === "string") {

                call.arg("texture || " + code.CodeDOM.quote(key));

                let frameLiteral: string;

                if (typeof frame === "string") {

                    frameLiteral = code.CodeDOM.quote(frame);

                } else if (typeof frame === "number") {

                    frameLiteral = frame.toString();
                }

                if (frameLiteral) {

                    call.arg("frame !== undefined && frame !== null ? frame : " + frameLiteral);
                }

            } else {

                call.arg("texture");
                call.arg("key");
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: BuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.addArg("x", "number");
            ctr.addArg("y", "number");
            ctr.addArg("texture", "string");
            ctr.addArg("frame", "number | string", true);
        }

        buildCreatePrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToCreateMethodDOM(call, args.obj as Image);
        }

        buildCreateObjectWithFactoryCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

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

            } else if (typeof frame === "string") {

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

            support.setLabel(baseLabel);
            support.getTextureComponent().setTexture(key, frame);

            return sprite;
        }

        createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject {

            const sprite = this.createImageObject(args.scene, 0, 0, undefined);

            sprite.getEditorSupport().readJSON(args.data);

            return sprite;
        }

        private createImageObject(scene: Scene, x: number, y: number, key: string, frame?: string | number) {

            const sprite = new sceneobjects.Image(scene, x, y, key, frame);

            sprite.getEditorSupport().setScene(scene);

            scene.sys.displayList.add(sprite);

            return sprite;
        }
    }
}