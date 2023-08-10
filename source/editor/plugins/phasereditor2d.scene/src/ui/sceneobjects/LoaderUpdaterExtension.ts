namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class LoaderUpdaterExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.AssetLoaderExtension";

        constructor() {
            super(LoaderUpdaterExtension.POINT_ID);
        }

        abstract clearCache(scene: BaseScene): void;

        abstract acceptAsset(asset: any): boolean;

        abstract updateLoader(scene: BaseScene, asset: any): Promise<void>;

        abstract updateLoaderWithObjData(scene: BaseScene, data: core.json.IObjectData): Promise<void>;
    }
}