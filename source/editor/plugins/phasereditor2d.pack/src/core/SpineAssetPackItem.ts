namespace phasereditor2d.pack.core {

    export abstract class SpineAssetPackItem extends AssetPackItem {

        getDataFile() {

            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            return file;
        }

        abstract buildSkeleton(atlasAsset: SpineAtlasAssetPackItem): spine.SkeletonData;
    }
}