namespace phasereditor2d.pack.core {

    export class AnimationFrameConfigInPackItem {

        private _textureKey: string;
        private _frameKey: string | number;
        private _textureFrame: ImageAssetPackItem | AssetPackImageFrame;

        setTextureFrame(textureFrame: ImageAssetPackItem | AssetPackImageFrame) {

            this._textureFrame = textureFrame;
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