namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;

    export abstract class ImageFrameContainerAssetPackItem extends AssetPackItem {

        private _frames: AssetPackImageFrame[];

        constructor(pack: AssetPack, data: any) {
            super(pack, data);

            this._frames = null;
        }

        async preload(): Promise<controls.PreloadResult> {

            if (this._frames) {
                return controls.Controls.resolveNothingLoaded();
            }

            const parser = this.createParser();

            return parser.preloadFrames();
        }

        async preloadImages() {

            const frames = this.getFrames();

            for(const frame of frames) {

                const img = frame.getImage();

                if (img) {
                    await img.preload();
                }
            }
        }

        resetCache() {
            this._frames = null;
        }

        protected abstract createParser(): parsers.ImageFrameParser;

        findFrame(frameName : any) {
            return this.getFrames().find(f => f.getName() === frameName);
        }

        getFrames(): AssetPackImageFrame[] {

            if (this._frames === null) {

                const parser = this.createParser();
                this._frames = parser.parseFrames();
            }

            return this._frames;
        }

        addToPhaserCache(game : Phaser.Game) {
            const parser = this.createParser();
            parser.addToPhaserCache(game);
        }

    }

}