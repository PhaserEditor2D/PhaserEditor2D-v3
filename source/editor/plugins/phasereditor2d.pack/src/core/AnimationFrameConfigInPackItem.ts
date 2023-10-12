namespace phasereditor2d.pack.core {

    export class AnimationFrameConfigInPackItem {

        private _textureKey: string;
        private _frameKey: string | number;
        private _textureFrame: ImageAssetPackItem | AssetPackImageFrame;

        setTextureFrame(textureFrame: ImageAssetPackItem | AssetPackImageFrame) {

            this._textureFrame = textureFrame;
        }

        getImageAsset() {

            if (this._textureFrame) {

                if (this._textureFrame instanceof pack.core.ImageAssetPackItem) {

                    return this._textureFrame.getFrames()[0];

                } else if (this._textureFrame instanceof pack.core.AssetPackImageFrame) {

                    return this._textureFrame;
                }
            }

            return null;
        }

        getTextureFrame() {

            return this._textureFrame;
        }

        getTextureKey() {

            return this._textureKey;
        }

        setTextureKey(textureKey: string) {

            this._textureKey = textureKey;
        }

        getFrameKey() {

            return this._frameKey;
        }

        setFrameKey(frameKey: number | string) {

            this._frameKey = frameKey;
        }
    }
}