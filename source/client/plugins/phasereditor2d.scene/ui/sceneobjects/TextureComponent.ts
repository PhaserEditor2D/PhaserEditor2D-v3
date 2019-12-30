namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export interface TextureData extends json.ObjectData {
        textureKey: string;
        frameKey: string;
    }

    export class TextureComponent implements json.ObjectSerializer {

        private _textureKey: string;
        private _textureFrameKey: string | number;
        private _obj: Image;

        constructor(obj: Image) {
            this._obj = obj;
        }

        writeJSON(data: TextureData): void {

            write(data, "textureKey", this._textureKey);
            write(data, "frameKey", this._textureFrameKey);
        }

        readJSON(data: TextureData): void {

            const key = read(data, "textureKey");
            const frame = read(data, "frameKey");

            this.setTexture(key, frame);
        }

        getKey() {
            return this._textureKey;
        }

        setKey(key: string) {
            this._textureKey = key;
        }

        setTexture(key: string, frame: string | number) {

            this.setKey(key);
            this.setFrame(frame);

            this._obj.setTexture(key, frame);
            // this should be called each time the texture is changed
            this._obj.setInteractive();
        }

        getTexture() {

            return {
                key: this.getKey(),
                frame: this.getFrame()
            };
        }

        getFrame() {
            return this._textureFrameKey;
        }

        setFrame(frame: string | number) {
            this._textureFrameKey = frame;
        }
    }
}