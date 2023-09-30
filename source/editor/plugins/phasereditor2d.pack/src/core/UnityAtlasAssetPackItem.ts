namespace phasereditor2d.pack.core {

    export class UnityAtlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {
            
            return new parsers.UnityAtlasParser(this);
        }
    }
}