namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapFontLoaderUpdater extends LoaderUpdaterExtension {

        acceptAsset(asset: any): boolean {

            return asset instanceof pack.core.BitmapFontAssetPackItem;
        }

        async updateLoader(scene: Scene, asset: any) {

            const font = asset as pack.core.BitmapFontAssetPackItem;

            await font.preload();

            await font.preloadImages();

            font.addToPhaserCache(scene.game, scene.getPackCache());
        }
    }
}