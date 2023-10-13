/// <reference path="./BaseAnimationsAssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    export class AnimationsAssetPackItem extends BaseAnimationsAssetPackItem {

        override getAnimationsFile() {

            const url = this.getData()["url"];
            
            return this.getFileFromAssetUrl(url);
        }

        protected override async parseAnimations(animations: AnimationConfigInPackItem[]): Promise<void> {

            const file = this.getAnimationsFile();

            if (file) {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                const data = JSON.parse(content) as Phaser.Types.Animations.JSONAnimations;

                for (const animData of data.anims) {

                    const animConfig = new AnimationConfigInPackItem(this);

                    animConfig.setKey(animData.key);

                    for (const frameData of animData.frames) {

                        const frameConfig = new AnimationFrameConfigInPackItem();

                        frameConfig.setTextureKey(frameData.key);
                        frameConfig.setFrameKey(frameData.frame);

                        animConfig.getFrames().push(frameConfig);
                    }

                    animations.push(animConfig);
                }
            }
        }
    }
}