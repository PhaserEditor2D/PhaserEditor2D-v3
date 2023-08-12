namespace phasereditor2d.pack.core {
    
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SpineBinaryAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload(): Promise<controls.PreloadResult> {
            
            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            if (file) {

                return await ide.FileUtils.preloadFileBinary(file);
            }

            return controls.PreloadResult.NOTHING_LOADED;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache): void {
            
            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            if (file) {

                const arrayBuffer = ide.FileUtils.getFileBinary(file);

                game.cache.binary.add(this.getKey(), arrayBuffer);
            }

            cache.addAsset(this);
        }
    }
}