namespace phasereditor2d.pack.core {

    export class AnimationFrameConfigInPackItem {

        private _textureKey: string;
        private _frameKey: string | number;

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