namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageEditorSupport extends EditorSupport {

        private _textureKey: string;
        private _textureFrameKey: string | number;

        constructor(obj: Image) {
            super(obj);
        }

        getTextureKey() {
            return this._textureKey;
        }

        setTextureKey(key: string) {
            this._textureKey = key;
        }

        setTexture(key: string, frame: string | number) {

            this.setTextureKey(key);
            this.setTextureFrame(frame);
        }

        getTexture() {
            return {
                key: this.getTextureKey(),
                frame: this.getTextureFrameKey()
            };
        }

        getTextureFrameKey() {
            return this._textureFrameKey;
        }

        setTextureFrame(frame: string | number) {
            this._textureFrameKey = frame;
        }
    }
}