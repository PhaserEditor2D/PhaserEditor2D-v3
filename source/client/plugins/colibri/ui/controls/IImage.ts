namespace colibri.ui.controls {

    export interface IImage {

        paint(
            context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void;

        paintFrame(
            context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number,
            dstX: number, dstY: number, dstW: number, dstH: number): void;

        preload(): Promise<PreloadResult>;

        getWidth(): number;

        getHeight(): number;

        preloadSize(): Promise<PreloadResult>;
    }
}