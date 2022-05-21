namespace colibri.ui.controls {

    export class ImageWrapper implements IImage {

        private _imageElement: IImageOrCanvas;

        constructor(imageElement: IImageOrCanvas) {

            this._imageElement = imageElement;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            if (this._imageElement) {

                DefaultImage.paintImageElement(context, this._imageElement, x, y, w, h, center);

            } else {

                DefaultImage.paintEmpty(context, x, y, w, h);
            }
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, srcW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void {

            if (this._imageElement) {

                DefaultImage.paintImageElementFrame(
                    context, this._imageElement, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);

            } else {

                DefaultImage.paintEmpty(context, dstX, dstY, dstW, dstH);

            }

        }

        preload(): Promise<PreloadResult> {

            return Controls.resolveNothingLoaded();
        }

        preloadSize(): Promise<PreloadResult> {

            return this.preload();
        }

        getWidth(): number {

            if (this._imageElement) {

                if (this._imageElement instanceof HTMLImageElement) {

                    return this._imageElement.naturalWidth;
                }

                return this._imageElement.width;
            }

            return 0;
        }

        getHeight(): number {

            if (this._imageElement) {

                if (this._imageElement instanceof HTMLImageElement) {

                    return this._imageElement.naturalHeight;
                }

                return this._imageElement.height;
            }

            return 0;
        }

        getImageElement() {

            return this._imageElement;
        }
    }

}