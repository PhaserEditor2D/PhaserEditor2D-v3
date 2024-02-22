namespace phasereditor2d.scene.ui.sceneobjects {

    interface ISpineExtraData {
        dataAsset: pack.core.SpineAssetPackItem,
        atlasAsset: pack.core.SpineAtlasAssetPackItem,
        skinName: string;
    }

    export class SpineExtension extends SceneGameObjectExtension {

        private static _instance: SpineExtension;

        static getInstance() {

            if (!this._instance) {

                this._instance = new SpineExtension();
            }

            return this._instance;
        }

        constructor() {
            super({
                typeName: "SpineGameObject",
                phaserTypeName: "SpineGameObject",
                phaserTypeThirdPartyLib: "spine",
                phaserTypeThirdPartyLibModule: "@esotericsoftware/spine-phaser",
                category: SCENE_OBJECT_SPINE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_SPINE)
            });
        }

        override async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const promise = new Promise((resolve, reject) => {

                const dlg = new SpineConfigWizard(finder);

                dlg.setFinishCallback(async () => {

                    const { dataAsset, atlasAsset, skinName } = dlg.getSelection();

                    const scene = editor.getScene();

                    for (const asset of [dataAsset, atlasAsset]) {

                        const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                        await updater.updateLoader(scene, asset);
                    }

                    const result: ICreateExtraDataResult = {
                        data: ({ dataAsset, atlasAsset, skinName } as ISpineExtraData)
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

        adaptDataAfterTypeConversion(
            serializer: core.json.Serializer, originalObject: ISceneGameObject, extraData: ISpineExtraData) {

            if (extraData && extraData.dataAsset) {

                serializer.write("dataKey", extraData.dataAsset.getKey());
                serializer.write("atlasKey", extraData.atlasAsset.getKey());
                serializer.write("skinName", extraData.skinName);
            }
        }

        acceptsDropData(data: any): boolean {

            return data instanceof pack.core.SpineAssetPackItem || data instanceof pack.core.SpineSkinItem;
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const { dataAsset, atlasAsset, skinName } = args.extraData as ISpineExtraData;

            const obj = new SpineObject(args.scene, args.x, args.y, dataAsset.getKey(), atlasAsset.getKey());

            SpineComponent.skin.setValue(obj, skinName);

            return [obj];
        }

        async createSceneObjectWithAsset(args: ICreateWithAssetArgs): Promise<ISceneGameObject> {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            if (args.asset instanceof pack.core.SpineSkinItem) {

                const { spineAsset, spineAtlasAsset, skinName } = args.asset;

                const obj = await this.newSpineObject(args, spineAsset, spineAtlasAsset, skinName);

                return obj;
            }

            const asset: pack.core.SpineAssetPackItem = args.asset;

            return new Promise((resolve, reject) => {

                const dlg = new SpineConfigWizard(finder, asset);

                dlg.setFinishCallback(async () => {

                    const { dataAsset, atlasAsset, skinName } = dlg.getSelection();

                    const obj = await this.newSpineObject(args, dataAsset, atlasAsset, skinName);

                    resolve(obj);
                });

                dlg.setCancelCallback(() => {

                    resolve(undefined);
                });

                dlg.create();
            });
        }

        private async newSpineObject(args: ICreateWithAssetArgs, dataAsset: pack.core.SpineAssetPackItem, atlasAsset: pack.core.SpineAtlasAssetPackItem, skinName: string) {

            for (const asset of [dataAsset, atlasAsset]) {

                const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                await updater.updateLoader(args.scene, asset);
            }

            const obj = new SpineObject(args.scene, args.x, args.y, dataAsset.getKey(), atlasAsset.getKey());

            const objES = obj.getEditorSupport();

            if (skinName && skinName !== "default") {

                objES.setLabel(skinName);

            } else {

                objES.setLabel(dataAsset.getKey());
            }

            // select a skin
            SpineComponent.skin.setValue(obj, skinName);

            // select bounds provider
            if (obj.skeleton.skin) {

                obj.bpType = BoundsProviderType.SKINS_AND_ANIMATION_TYPE;
                obj.bpSkin = BoundsProviderSkin.CURRENT_SKIN;

            } else if (obj.skeleton.data.defaultSkin) {

                obj.bpType = BoundsProviderType.SETUP_TYPE;

            } else {

                obj.bpType = BoundsProviderType.SKINS_AND_ANIMATION_TYPE;
                obj.bpAnimation = null;
                obj.bpSkin = BoundsProviderSkin.ALL_SKINS;
            }

            obj.updateBoundsProvider();

            return obj;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            const objData = args.data;

            const serializer = args.scene.getMaker().getSerializer(objData);

            const dataKey = serializer.read("dataKey");
            const atlasKey = serializer.read("atlasKey");

            const obj = new SpineObject(args.scene, 0, 0, dataKey, atlasKey);

            obj.getEditorSupport().readJSON(objData);

            return obj;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            const dataKey = args.serializer.read("dataKey");
            const atlasKey = args.serializer.read("atlasKey");

            const dataAsset = args.finder.findAssetPackItem(dataKey);
            const atlasAsset = args.finder.findAssetPackItem(atlasKey);

            // Maybe it contains FX objects depending on textures
            const childrenAssets = await ContainerExtension.getAssetsFromNestedData(args);

            return [dataAsset, atlasAsset, ...childrenAssets];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new SpineCodeDOMBuilder();
        }

        override createInitObjectDataFromChild(childData: core.json.IObjectData): core.json.IObjectData {

            const data = super.createInitObjectDataFromChild(childData);

            data["dataKey"] = childData["dataKey"];
            data["atlasKey"] = childData["atlasKey"];

            return data;
        }
    }
}