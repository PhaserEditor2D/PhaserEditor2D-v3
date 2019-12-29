namespace phasereditor2d.scene.ui.sceneobjects {

    export class ImageEditorSupport extends EditorSupport {

        private _textureSupport: TextureSupport;
        private _transformSupport: TransformSupport;

        constructor(extension: SceneObjectExtension, obj: Image) {
            super(extension, obj);

            this._textureSupport = new TextureSupport(obj);
            this._transformSupport = new TransformSupport(obj);

            this.addSerializer(
                this._transformSupport,
                this._textureSupport
            );
        }

        getTextureSupport() {
            return this._textureSupport;
        }

        getTransformSupport() {
            return this._transformSupport;
        }
    }
}