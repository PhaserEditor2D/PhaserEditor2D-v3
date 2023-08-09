namespace phasereditor2d.pack.core {
    
    import controls = colibri.ui.controls;

    export class SpineBinaryAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload(): Promise<controls.PreloadResult> {
            
            return controls.PreloadResult.RESOURCES_LOADED;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache): void {
            
        }
    }
}