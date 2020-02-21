namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class LoaderUpdaterExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.AssetLoaderExtension";

        constructor() {
            super(LoaderUpdaterExtension.POINT_ID);
        }

        abstract clearCache(game: Phaser.Game): void;

        abstract acceptAsset(asset: any): boolean;

        abstract async updateLoader(scene: Scene, asset: any);
    }
}