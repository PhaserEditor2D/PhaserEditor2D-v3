namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapTextExtension extends SceneGameObjectExtension {

        private static _instance = new BitmapTextExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.BitmapText",
                typeName: "BitmapText",
                category: SCENE_OBJECT_TEXT_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_BITMAP_FONT_TYPE)
            });
        }

        acceptsDropData(data: any): boolean {

            return data instanceof pack.core.BitmapFontAssetPackItem;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            const font = args.asset as pack.core.BitmapFontAssetPackItem;

            return new BitmapText(args.scene, args.x, args.y, font.getKey(), "New BitmapText");
        }

        adaptDataAfterTypeConversion(
            serializer: core.json.Serializer, originalObject: ISceneGameObject, extraData: any) {

            const bitmapFont = extraData as pack.core.BitmapFontAssetPackItem;

            if (bitmapFont && bitmapFont instanceof pack.core.BitmapFontAssetPackItem) {

                let size = 64;

                const newData = serializer.getData();

                if ("height" in originalObject) {

                    size = originalObject["height"] as number;
                }

                if (typeof originalObject["text"] !== "string") {

                    newData["text"] = "New Bitmap Text";
                }

                newData["fontSize"] = size;
                newData["font"] = bitmapFont.getKey();
            }
        }

        async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const dlg = new pack.ui.dialogs.AssetSelectionDialog();

            dlg.create();

            dlg.getViewer().setInput(
                finder.getPacks()
                    .flatMap(pack => pack.getItems())
                    .filter(item => item instanceof pack.core.BitmapFontAssetPackItem));

            dlg.getViewer().setCellSize(128, true);

            dlg.setTitle("Select Bitmap Font");

            const promise = new Promise((resolver, reject) => {

                dlg.setSelectionCallback(async (sel) => {

                    const item = sel[0] as pack.core.BitmapFontAssetPackItem;

                    await item.preload();

                    await item.preloadImages();

                    const result: ICreateExtraDataResult = {
                        data: item
                    };

                    resolver(result);
                });

                dlg.setCancelCallback(() => {

                    const result: ICreateExtraDataResult = {
                        abort: true
                    };

                    resolver(result);
                });
            });

            return promise;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const fontAsset = args.extraData as pack.core.BitmapFontAssetPackItem;

            fontAsset.addToPhaserCache(args.scene.game, args.scene.getPackCache());

            return [new BitmapText(args.scene, args.x, args.y, fontAsset.getKey(), "New BitmapText")];
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const serializer = new core.json.Serializer(args.data);

            const font = serializer.read(BitmapTextComponent.font.name);

            const obj = new BitmapText(args.scene, 0, 0, font, "");

            obj.getEditorSupport().readJSON(args.data);

            return obj;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            let result = [];

            const font = args.serializer.read(BitmapTextComponent.font.name) as string;

            const asset = args.finder.findAssetPackItem(font);

            if (asset instanceof pack.core.BitmapFontAssetPackItem) {

                result = [asset];
            }

            // Maybe it contains FX objects depending on textures
            const childrenAssets = await ContainerExtension.getAssetsFromNestedData(args);

            return [...result, ...childrenAssets];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new BitmapTextCodeDOMBuilder();
        }
    }
}