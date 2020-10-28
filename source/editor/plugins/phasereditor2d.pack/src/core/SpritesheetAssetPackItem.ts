namespace phasereditor2d.pack.core {

    export class SpritesheetAssetPackItem extends ImageFrameContainerAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        getUrl() {

            return this.getData().url;
        }

        protected createParser(): parsers.ImageFrameParser {
            return new parsers.SpriteSheetParser(this);
        }
    }

}