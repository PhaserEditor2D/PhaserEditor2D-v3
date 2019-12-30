namespace colibri.ui.ide {

    export class FileImage extends controls.DefaultImage {

        private _file: core.io.FilePath;

        constructor(file: core.io.FilePath) {
            super(new Image(), file.getUrl());

            this._file = file;
        }

        getFile() {
            return this._file;
        }

        preload() {
            return super.preload();
        }

        getWidth() {

            const size = FileUtils.getImageSize(this._file);

            return size ? size.width : super.getWidth();
        }

        getHeight() {

            const size = FileUtils.getImageSize(this._file);

            return size ? size.height : super.getHeight();
        }

        preloadSize() {

            const result = FileUtils.preloadImageSize(this._file);

            return result;
        }
    }
}