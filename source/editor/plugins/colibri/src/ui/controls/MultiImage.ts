namespace colibri.ui.controls {

    export class MultiImage implements IImage {

        private _width: number;
        private _height: number;
        private _images: IImage[];

        constructor(images: IImage[], width: number, height: number) {
            this._images = images;
            this._width = width;
            this._height = height;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            const imageCount = this._images.length;

            if (imageCount === 1) {

                const img = this._images[0];

                img.paint(context, x, y, w, h, center);

                return;
            }

            let size = Math.floor(Math.sqrt(w * h / imageCount) * 0.7) + 1;

            if (imageCount === 1) {

                size = Math.min(w, h);
            }

            const cols = Math.floor(w / size);
            const rows = imageCount / cols + (imageCount % cols === 0 ? 0 : 1);
            const marginX = Math.floor(Math.max(0, (w - cols * size) / 2));
            const marginY = Math.floor(Math.max(0, (h - rows * size) / 2));

            let x2 = x + marginX;
            let y2 = y + marginY;

            for (const img of this._images) {

                img.paint(context, x2, y2, size, size, true);

                x2 += size;

                if (x2 + size >= w) {
                    x2 = x + marginX;
                    y2 += size + 1;
                }
            }
        }

        paintFrame(
            context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void {
            // nothing
        }

        async preload(): Promise<PreloadResult> {

            let result = PreloadResult.NOTHING_LOADED;

            for (const image of this._images) {
                result = Math.max(result, await image.preload());
            }

            return result;
        }

        resize(width: number, height: number) {
            this._width = width;
            this._height = height;
        }

        getWidth(): number {
            return this._width;
        }

        getHeight(): number {
            return this._height;
        }

        async preloadSize(): Promise<PreloadResult> {
            return PreloadResult.NOTHING_LOADED;
        }
    }
}