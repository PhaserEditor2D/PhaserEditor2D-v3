namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TilemapExtension extends ScenePlainObjectExtension {

        static CATEGORY = "Tilemap";
        private static _instance: TilemapExtension;

        static getInstance(): ScenePlainObjectExtension {

            return this._instance ?? (this._instance = new TilemapExtension());
        }

        private constructor() {
            super({
                category: TilemapExtension.CATEGORY,
                iconName: ICON_GROUP,
                phaserTypeName: "Phaser.Tilemaps.Tilemap",
                typeName: "Tilemap"
            });
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildPlainObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM[] {

            const result: code.MethodCallCodeDOM[] = [];

            const tilemap = args.obj as Tilemap;

            const addTilemapDom = new code.MethodCallCodeDOM("tilemap", args.gameObjectFactoryExpr + ".add");

            addTilemapDom.argLiteral(tilemap.getTilemapAssetKey());

            result.push(addTilemapDom);

            for (const tileset of tilemap.tilesets) {

                const addTilesetImageDom = new code.MethodCallCodeDOM("addTilesetImage", args.varname);
                addTilesetImageDom.argLiteral(tileset.name);

                if (tileset.image) {

                    addTilesetImageDom.argLiteral(tileset.image.key);
                }

                result.push(addTilesetImageDom);
            }

            return result;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromPlainObjectArgs): Promise<any[]> {

            const result = [];

            const finder = args.finder;

            const data = args.data as ITilemapData;

            const key = data.key;

            const item = args.finder.findAssetPackItem(key);

            if (item instanceof pack.core.TilemapTiledJSONAssetPackItem) {

                result.push(item);
            }

            for (const tileset of data.tilesets) {

                if (tileset.imageKey) {

                    const asset = finder.findAssetPackItem(tileset.imageKey);

                    if (asset instanceof pack.core.ImageAssetPackItem
                        || asset instanceof pack.core.SpritesheetAssetPackItem) {

                        result.push(asset);
                    }
                }
            }

            return result;
        }

        async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");

            dlg.create();

            dlg.getViewer().setInput(
                finder.getPacks()
                    .flatMap(pack => pack.getItems())
                    .filter(item => item instanceof pack.core.TilemapTiledJSONAssetPackItem));

            dlg.setTitle("Select Tilemap Key");

            const promise = new Promise((resolver, reject) => {

                dlg.setSelectionCallback(async (sel) => {

                    const item = sel[0] as pack.core.TilemapTiledJSONAssetPackItem;

                    await item.preload();

                    const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(item);

                    await updater.updateLoader(editor.getScene(), item);

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

        createDefaultSceneObject(args: ICreateDefaultArgs): IScenePlainObject {

            const item = args.extraData as pack.core.TilemapTiledJSONAssetPackItem;

            const tilemap = new sceneobjects.Tilemap(args.scene, item.getKey());

            console.log(tilemap.tilesets);

            return tilemap;
        }

        createPlainObjectWithData(args: ICreatePlainObjectWithDataArgs): IScenePlainObject {

            const data = args.data as ITilemapData;

            const key = data.key;

            const tilemap = new sceneobjects.Tilemap(args.scene, key);

            tilemap.getEditorSupport().readJSON(data);

            return tilemap;
        }

        isAvailableAsPrefabElement() {

            return false;
        }
    }
}