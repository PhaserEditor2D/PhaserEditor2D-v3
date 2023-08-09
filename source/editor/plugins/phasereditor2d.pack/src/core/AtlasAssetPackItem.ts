/// <reference path="./BaseAtlasAssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export class AtlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {
            
            return new parsers.AtlasParser(this);
        }
    }

}