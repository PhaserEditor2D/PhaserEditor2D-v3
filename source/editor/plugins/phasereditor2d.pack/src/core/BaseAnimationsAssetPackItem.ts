/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class BaseAnimationsAssetPackItem extends AssetPackItem {

        private _animations: AnimationConfigInPackItem[];

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        abstract getAnimationsFile(): io.FilePath;

        getAnimations() {

            return this._animations || [];
        }

        async preload(): Promise<controls.PreloadResult> {

                if (this._animations) {
    
                    return controls.PreloadResult.NOTHING_LOADED;
                }
    
                this._animations = [];
    
                try {
    
                    await this.parseAnimations(this._animations);
    
                } catch (e) {
    
                    console.error(e);
                }
    
                return controls.PreloadResult.RESOURCES_LOADED;
        }

        protected abstract parseAnimations(animations: AnimationConfigInPackItem[]): Promise<void>;

        async build(finder: PackFinder) {

            for (const anim of this._animations) {

                for (const frameConfig of anim.getFrames()) {

                    const textureKey = frameConfig.getTextureKey();
                    const frameKey = frameConfig.getFrameKey();
                    
                    const textureFrame = finder.getAssetPackItemOrFrame(textureKey, frameKey);

                    frameConfig.setTextureFrame(textureFrame);
                }
            }
        }
    }
}