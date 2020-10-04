namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

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

                    if (asset instanceof pack.core.ImageAssetPackItem) {

                        result.push(asset);
                    }
                }
            }

            return result;
        }

        async collectExtraDataForCreateDefaultObject() {

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

        createDefaultSceneObject(args: ICreateEmptyArgs): IScenePlainObject {

            const item = args.extraData as pack.core.TilemapTiledJSONAssetPackItem;

            return new sceneobjects.Tilemap(args.scene, item.getKey());
        }

        createPlainObjectWithData(args: ICreatePlainObjectWithDataArgs): IScenePlainObject {

            const data = args.data as ITilemapData;

            const key = data.key;

            const tilemap = new sceneobjects.Tilemap(args.scene, key);

            tilemap.getEditorSupport().readJSON(data);

            return tilemap;
        }
    }
}