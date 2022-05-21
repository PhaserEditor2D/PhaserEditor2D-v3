namespace colibri.ui.controls {

    export class DefaultImage implements IImage {

        private _ready: boolean;
        private _error: boolean;
        private _url: string;
        private _imageElement: HTMLImageElement;
        private _requestPromise: Promise<PreloadResult>;

        constructor(img: HTMLImageElement, url: string) {

            this._imageElement = img;
            this._url = url;
            this._ready = false;
            this._error = false;
        }

        preloadSize(): Promise<PreloadResult> {
            return this.preload();
        }

        getImageElement() {
            return this._imageElement;
        }

        getURL() {
            return this._url;
        }

        preload(): Promise<PreloadResult> {

            if (this._ready || this._error) {
                return Controls.resolveNothingLoaded();
            }

            if (this._requestPromise) {
                return this._requestPromise;
            }

            this._requestPromise = new Promise((resolve, reject) => {

                this._imageElement.src = this._url;

                this._imageElement.addEventListener("load", e => {

                    this._requestPromise = null;
                    this._ready = true;

                    resolve(PreloadResult.RESOURCES_LOADED);
                });

                this._imageElement.addEventListener("error", e => {

                    console.error("ERROR: Loading image " + this._url);

                    this._requestPromise = null;
                    this._error = true;

                    resolve(PreloadResult.NOTHING_LOADED);
                });
            });

            return this._requestPromise;

            /*
            return this._img.decode().then(_ => {
                this._ready = true;
                return Controls.resolveResourceLoaded();
            }).catch(e => {
                this._ready = true;
                console.error("ERROR: Cannot decode " + this._url);
                console.error(e);
                return Controls.resolveNothingLoaded();
            });
            */
        }

        getWidth() {
            return this._ready ? this._imageElement.naturalWidth : 16;
        }

        getHeight() {
            return this._ready ? this._imageElement.naturalHeight : 16;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            if (this._ready) {

                DefaultImage.paintImageElement(context, this._imageElement, x, y, w, h, center);

            } else {

                DefaultImage.paintEmpty(context, x, y, w, h);
            }
        }

        static paintImageElement(
            context: CanvasRenderingContext2D, image: IImageOrCanvas,
            x: number, y: number, w: number, h: number, center: boolean) {

            const naturalWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
            const naturalHeight = image instanceof HTMLImageElement ? image.naturalHeight : image.height;

            const renderHeight = h;
            const renderWidth = w;

            let imgW = naturalWidth;
            let imgH = naturalHeight;

            // compute the right width
            imgW = imgW * (renderHeight / imgH);
            imgH = renderHeight;

            // fix width if it goes beyond the area
            if (imgW > renderWidth) {
                imgH = imgH * (renderWidth / imgW);
                imgW = renderWidth;
            }

            const scale = imgW / naturalWidth;

            const imgX = x + (center ? renderWidth / 2 - imgW / 2 : 0);
            const imgY = y + renderHeight / 2 - imgH / 2;

            const imgDstW = naturalWidth * scale;
            const imgDstH = naturalHeight * scale;

            if (imgDstW > 0 && imgDstH > 0) {

                context.drawImage(image, imgX, imgY, imgDstW, imgDstH);
            }
        }

        static paintEmpty(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
            if (w > 10 && h > 10) {
                context.save();
                context.strokeStyle = Controls.getTheme().viewerForeground;
                const cx = x + w / 2;
                const cy = y + h / 2;
                context.strokeRect(cx, cy - 1, 2, 2);
                context.strokeRect(cx - 5, cy - 1, 2, 2);
                context.strokeRect(cx + 5, cy - 1, 2, 2);
                context.restore();
            }
        }

        static paintImageElementFrame(
            context: CanvasRenderingContext2D, image: CanvasImageSource,
            srcX: number, srcY: number, scrW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void {

            context.drawImage(image, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
        }

        paintFrame(
            context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void {

            if (this._ready) {

                DefaultImage.paintImageElementFrame(
                    context, this._imageElement, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);

            } else {

                DefaultImage.paintEmpty(context, dstX, dstY, dstW, dstH);
            }
        }
    }
}