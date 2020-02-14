namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapTextExtension extends SceneObjectExtension {

        private static _instance = new BitmapTextExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.BitmapText",
                typeName: "BitmapText"
            });
        }

        acceptsDropData(data: any): boolean {

            return data instanceof pack.core.BitmapFontAssetPackItem;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneObject {

            const font = args.asset as pack.core.BitmapFontAssetPackItem;

            return new BitmapText(args.scene, args.x, args.y, font.getKey(), "New BitmapText");
        }

        createEmptySceneObject(args: ICreateEmptyArgs): ISceneObject {

            return new BitmapText(args.scene, args.x, args.y, null, "New BitmapText");
        }

        createSceneObjectWithData(args: ICreateWithDataArgs): ISceneObject {

            const serializer = new core.json.Serializer(args.data);

            const font = serializer.read(BitmapTextComponent.font.name);

            const obj = new BitmapText(args.scene, 0, 0, font, "");

            obj.getEditorSupport().readJSON(args.data);

            return obj;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            const font = args.serializer.read(BitmapTextComponent.font.name) as string;

            const asset = args.finder.findAssetPackItem(font);

            if (asset instanceof pack.core.BitmapFontAssetPackItem) {

                return [asset];
            }

            return [];
        }

        getCodeDOMBuilder(): ObjectCodeDOMBuilder {

            return new BitmapTextCodeDOMBuilder();
        }
    }
}