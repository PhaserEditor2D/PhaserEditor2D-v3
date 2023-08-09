namespace phasereditor2d.pack.core {
    
    import controls = colibri.ui.controls;

    export class SpineAtlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {
            
            return new parsers.SpineAtlasParser(this);
        }
    }
}