namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    interface ITilemapExtraData {
        tilemap: pack.core.TilemapTiledJSONAssetPackItem,
        tilesetsImages: Map<string, pack.core.ImageAssetPackItem | pack.core.SpritesheetAssetPackItem>;
        tilemapLayerName: string;
    }

    export class TilemapExtension extends ScenePlainObjectExtension {

        private static _instance: TilemapExtension;

        static getInstance(): ScenePlainObjectExtension {

            return this._instance ?? (this._instance = new TilemapExtension());
        }

        private constructor() {
            super({
                category: SCENE_OBJECT_TILEMAP_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_TILEMAP),
                phaserTypeName: "Phaser.Tilemaps.Tilemap",
                typeName: "Tilemap"
            });
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildPlainObjectFactoryCodeDOMArgs):
            IBuildPlainObjectFactoryCodeDOMResult {

            const statements: code.MethodCallCodeDOM[] = [];

            const tilemap = args.obj as Tilemap;

            const addTilemapDom = new code.MethodCallCodeDOM("tilemap", args.gameObjectFactoryExpr + ".add");

            addTilemapDom.argLiteral(tilemap.getTilemapAssetKey());

            statements.push(addTilemapDom);

            for (const tileset of tilemap.tilesets) {

                const addTilesetImageDom = new code.MethodCallCodeDOM("addTilesetImage", args.varname);
                addTilesetImageDom.argLiteral(tileset.name);

                addTilemapDom.setDeclareReturnToVar(true);

                if (tileset.image) {

                    addTilesetImageDom.argLiteral(tileset.image.key);
                }

                statements.push(addTilesetImageDom);
            }

            return {
                firstStatements: statements,
                objectFactoryMethodCall: addTilemapDom
            };
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

            const promise = new Promise((resolve, reject) => {

                const dlg = new TilemapConfigWizard(finder);

                dlg.setFinishCallback(async () => {

                    const tilemap = dlg.getTilemapKeyPage().getTilemapAsset();

                    const tilesetsImages = dlg.getTilesetsPage().getImageMap();

                    const tilemapLayerName = dlg.getTilemapLayerNamePage().getTilemapLayerName();

                    const scene = editor.getScene();

                    let updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(tilemap);

                    await updater.updateLoader(scene, tilemap);

                    for (const [name, image] of tilesetsImages.entries()) {

                        updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(image);

                        await updater.updateLoader(scene, image);
                    }

                    const result: ICreateExtraDataResult = {
                        data: {
                            tilemap,
                            tilesetsImages,
                            tilemapLayerName
                        }
                    };

                    resolve(result);
                });

                dlg.setCancelCallback(() => {

                    const result: ICreateExtraDataResult = {
                        abort: true
                    };

                    resolve(result);
                });

                dlg.create();
            });

            return promise;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const extraData = args.extraData as ITilemapExtraData;

            const tilesetsImages = extraData.tilesetsImages;

            const tilemap = new sceneobjects.Tilemap(args.scene, extraData.tilemap.getKey());

            for (const [name, image] of tilesetsImages.entries()) {

                tilemap.addTilesetImage(name, image.getKey());
            }

            if (extraData.tilemapLayerName) {

                const layer = new TilemapLayer(args.scene, tilemap, extraData.tilemapLayerName);

                return [tilemap, layer];
            }

            return [tilemap];
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