namespace colibri.ui.controls {

    export class ImageFrame implements IImage {

        private _name: string | number;
        private _image: controls.DefaultImage;
        private _frameData: FrameData;

        constructor(name: string | number, image: controls.DefaultImage, frameData: FrameData) {
            this._name = name;
            this._image = image;
            this._frameData = frameData;
        }

        preloadSize(): Promise<PreloadResult> {

            return this.preload();
        }

        getName() {
            return this._name;
        }

        getImage() {

            return this._image;
        }

        getFrameData() {

            return this._frameData;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            const img = this._image;

            if (!img) {
                
                return;
            }

            const fd = this._frameData;

            const renderWidth = w;
            const renderHeight = h;

            let imgW = fd.src.w;
            let imgH = fd.src.h;

            // compute the right width
            imgW = imgW * (renderHeight / imgH);
            imgH = renderHeight;

            // fix width if it goes beyond the area
            if (imgW > renderWidth) {

                imgH = imgH * (renderWidth / imgW);
                imgW = renderWidth;
            }

            const scale = imgW / fd.src.w;
            const imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
            const imgY = y + renderHeight / 2 - imgH / 2;

            // here we use the trimmed version of the image, maybe this should be parametrized
            const imgDstW = fd.src.w * scale;
            const imgDstH = fd.src.h * scale;

            if (imgDstW > 0 && imgDstH > 0) {

                img.paintFrame(context,
                    fd.src.x, fd.src.y, fd.src.w, fd.src.h,
                    imgX, imgY, imgDstW, imgDstH
                );
            }
        }

        paintFrame(context: CanvasRenderingContext2D,

            srcX: number, srcY: number, scrW: number, srcH: number,

            dstX: number, dstY: number, dstW: number, dstH: number): void {

            // not implemented fow now
        }

        preload(): Promise<PreloadResult> {

            if (this._image === null) {

                return controls.Controls.resolveNothingLoaded();
            }

            return this._image.preload();
        }

        getWidth(): number {
            return this._frameData.srcSize.x;
        }

        getHeight(): number {
            return this._frameData.srcSize.y;
        }
    }
}