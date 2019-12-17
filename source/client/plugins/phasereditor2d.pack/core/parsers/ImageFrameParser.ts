namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;

    export abstract class ImageFrameParser {

        private _packItem: AssetPackItem;

        constructor(packItem: AssetPackItem) {
            this._packItem = packItem;
        }

        getPackItem() {
            return this._packItem;
        }

        static initSourceImageMap(game: Phaser.Game) {
            game["_sourceImageFrame_map"] = {};
        }

        static clearSourceImageMap(game: Phaser.Game) {
            delete game["_sourceImageFrame_map"];
        }

        static setSourceImageFrame(game: Phaser.Game, image: controls.IImage, key: string, frame?: string | number) {

            let imageMap = game["_sourceImageFrame_map"];

            imageMap["__frame__" + key + "$" + (frame ? frame : "")] = image;
        }

        static getSourceImageFrame(game: Phaser.Game, key: string, frame?: string | number) {
            
            let imageMap = game["_sourceImageFrame_map"];

            return imageMap["__frame__" + key + "$" + (frame ? frame : "")];
        }

        abstract addToPhaserCache(game: Phaser.Game): void;

        abstract async preloadFrames(): Promise<controls.PreloadResult>;

        abstract parseFrames(): AssetPackImageFrame[];
    }

}