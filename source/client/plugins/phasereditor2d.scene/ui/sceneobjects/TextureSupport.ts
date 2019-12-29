namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class TextureSupport implements json.JSONSerializer {

        private _textureKey: string;
        private _textureFrameKey: string | number;
        private _obj: Image;

        static TEXTURE_KEY = "textureKey";
        static FRAME_KEY = "frameKey";

        constructor(obj: Image) {
            this._obj = obj;
        }

        writeJSON(data: any): void {

            write(data, TextureSupport.TEXTURE_KEY, this._textureKey);
            write(data, TextureSupport.FRAME_KEY, this._textureFrameKey);
        }

        readJSON(data: any): void {

            const key = read(data, TextureSupport.TEXTURE_KEY);
            const frame = read(data, TextureSupport.FRAME_KEY);

            this.setTexture(key, frame);
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

            this._obj.setTexture(key, frame);
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