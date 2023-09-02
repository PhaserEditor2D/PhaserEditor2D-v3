namespace phasereditor2d.pack.core {

    export class SpineSkinItem {

        constructor(
            public spineAsset: SpineAssetPackItem,
            public spineAtlasAsset: SpineAtlasAssetPackItem,
            public skinName: string) {
        }

        computeHash() {
            
            const hash1 = this.spineAsset ? this.spineAsset.computeHash() : "?";
            const hash2 = this.spineAtlasAsset? this.spineAtlasAsset.computeHash() : "?";
            const hash3 = this.skinName;

            return `${hash1}+${hash2}+${hash3}`;
        }
    }
}