namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineUtils {
        
        static getSpineSkinItemImage(skinItem: pack.core.SpineSkinItem) {

            const img = ScenePlugin.getInstance().getSpineThumbnailCache().getContent(skinItem);

            return img;
        }

        static async getSpineSkinItems() {

            const result: pack.core.SpineSkinItem[] = [];

            const packs = await pack.core.AssetPackUtils.getAllPacks();

            for(const thePack of packs) {

                for(const item of thePack.getItems()) {

                    if (item instanceof pack.core.SpineAssetPackItem) {

                        await item.preload();

                        const skins = item.getGuessSkinItems();

                        result.push(...skins);
                    }
                }
            }

            return result;
        }
    }
}