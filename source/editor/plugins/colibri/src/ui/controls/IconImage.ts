namespace colibri.ui.controls {

    export class IconImage implements IImage {

        private _darkImage: IImage;
        private _lightImage: IImage;

        constructor(lightImage: IImage, darkImage: IImage) {

            this._lightImage = lightImage;
            this._darkImage = darkImage;
        }

        getNegativeThemeImage() {

            const img = this.getThemeImage();

            if (img === this._lightImage) {

                return this._darkImage;
            }

            return this._lightImage;
        }

        getLightImage() {

            return this._lightImage;
        }

        getDarkImage() {

            return this._darkImage;
        }

        getThemeImage() {

            if (controls.Controls.getTheme().dark) {

                return this._darkImage;
            }

            return this._lightImage;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            this.getThemeImage().paint(context, x, y, w, h, center);
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {

            this.getThemeImage().paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
        }

        async preload(): Promise<PreloadResult> {

            await this._darkImage.preload();

            return await this._lightImage.preload();
        }

        getWidth(): number {

            return this.getThemeImage().getWidth();
        }

        getHeight(): number {

            return this.getThemeImage().getHeight();
        }

        async preloadSize(): Promise<PreloadResult> {

            await this._darkImage.preloadSize();

            return await this._lightImage.preloadSize();
        }
    }
}