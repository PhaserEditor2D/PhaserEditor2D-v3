namespace phasereditor2d.pack.core {

    export class ImageAssetPackItem extends ImageFrameContainerAssetPackItem {

        constructor(pack : AssetPack, data : any) {
            super(pack, data)
        }

        protected createParser(): parsers.ImageFrameParser {
            return new parsers.ImageParser(this);
        }

    }

}