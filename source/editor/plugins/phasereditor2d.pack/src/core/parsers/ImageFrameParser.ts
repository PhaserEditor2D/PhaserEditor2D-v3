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

        abstract addToPhaserCache(game: Phaser.Game, cache: AssetPackCache): void;

        abstract preloadFrames(): Promise<controls.PreloadResult>;

        abstract parseFrames(): AssetPackImageFrame[];
    }
}