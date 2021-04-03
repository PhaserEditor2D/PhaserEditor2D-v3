/// <reference path="./AssetPackItem.ts" />

namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;

    export class AnimationsAssetPackItem extends AssetPackItem {

        private _animations: AnimationConfigInPackItem[];

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        getUrl() {

            return this.getData()["url"];
        }

        getAnimations() {

            return this._animations || [];
        }

        async preload() {

            if (this._animations) {

                return controls.PreloadResult.NOTHING_LOADED;
            }

            this._animations = [];

            try {

                const file = this.getFileFromAssetUrl(this.getUrl());

                if (file) {

                    const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                    const data = JSON.parse(content) as Phaser.Types.Animations.JSONAnimations;

                    for (const animData of data.anims) {

                        const animConfig = new AnimationConfigInPackItem();

                        animConfig.setKey(animData.key);

                        for (const frameData of animData.frames) {

                            const frameConfig = new AnimationFrameConfigInPackItem();

                            frameConfig.setTextureKey(frameData.key);
                            frameConfig.setFrameKey(frameData.frame);

                            animConfig.getFrames().push(frameConfig);
                        }

                        this._animations.push(animConfig);
                    }
                }

            } catch (e) {

                console.error(e);
            }

            return controls.PreloadResult.RESOURCES_LOADED;
        }
    }
}