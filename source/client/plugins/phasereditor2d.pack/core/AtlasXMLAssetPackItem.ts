namespace phasereditor2d.pack.core {

    export class AtlasXMLAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {
            return new parsers.AtlasXMLParser(this);
        }

    }

}