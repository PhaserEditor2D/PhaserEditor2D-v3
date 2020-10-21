/// <reference path="CanvasControl.ts" />

namespace colibri.ui.controls {

    export class ImageControl extends CanvasControl {

        private _image: IImage;

        constructor(padding: number = 0, ...classList: string[]) {
            super(padding, "ImageControl", ...classList);
        }

        setImage(image: IImage): void {

            this._image = image;
        }

        getImage() {

            return this._image;
        }

        protected async paint() {

            if (this._image) {

                this.paint2();

                const result = await this._image.preload();

                if (result === PreloadResult.RESOURCES_LOADED) {

                    this.paint2();
                }

            } else {

                this.clear();
            }
        }

        private paint2() {

            this.ensureCanvasSize();

            this.clear();

            this._image.paint(this._context, 0, 0, this._canvas.width, this._canvas.height, true);
        }
    }
}