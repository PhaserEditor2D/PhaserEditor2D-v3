/// <reference path="./BaseAtlasAssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    interface IAsepriteData {
        meta: {
            frameTags: {
                name: string,
                from: number,
                to: number
            }[]
        }
    }

    export class AsepriteAssetPackItem extends BaseAnimationsAssetPackItem {

        private _atlasItem: AtlasAssetPackItem;

        constructor(pack: AssetPack, data: any) {
            super(pack, data);

            this._atlasItem = new AtlasAssetPackItem(this.getPack(), this.getData());
        }

        override getAnimationsFile() {

            const url = this.getData()["atlasURL"];
            
            return this.getFileFromAssetUrl(url);
        }

        getAtlasFile() {

            return this.getAnimationsFile();
        }

        getTextureFile() {

            const url = this.getData()["textureURL"];
            
            return this.getFileFromAssetUrl(url);
        }

        preloadImages(): Promise<controls.PreloadResult> {

            return this._atlasItem.preloadImages();
        }

        async preload(): Promise<colibri.ui.controls.PreloadResult> {
            
            await this._atlasItem.preload();

            return super.preload();
        }

        findFrame(frameName: string | number) {

            return this._atlasItem.findFrame(frameName);
        }

        getFrames() {

            return this._atlasItem.getFrames();
        }

        protected async parseAnimations(animations: AnimationConfigInPackItem[]): Promise<void> {

            const atlasURL = this.getData().atlasURL;

            const file = this.getFileFromAssetUrl(atlasURL);

            if (file) {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                const data = JSON.parse(content) as IAsepriteData;

                for (const animData of data.meta.frameTags) {

                    const animConfig = new AnimationConfigInPackItem(this);

                    animConfig.setKey(animData.name);

                    for(let i = animData.from; i<= animData.to; i++) {

                        const frameKey = i.toString();

                        const frameConfig = new AnimationFrameConfigInPackItem();

                        frameConfig.setTextureKey(this.getKey());
                        frameConfig.setFrameKey(frameKey);

                        animConfig.getFrames().push(frameConfig);
                    }

                    animations.push(animConfig);
                }
            }
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache): void {
            
            const parser = new parsers.AtlasParser(this._atlasItem);

            parser.addToPhaserCache(game, cache);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "atlasURL", "textureURL", "normalMap");
        }
    }
}