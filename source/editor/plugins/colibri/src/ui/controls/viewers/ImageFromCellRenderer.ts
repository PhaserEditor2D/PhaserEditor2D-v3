namespace colibri.ui.controls.viewers {

    export class ImageFromCellRenderer implements IImage {

        private _renderer: ICellRenderer;
        private _obj: any;
        private _width: number;
        private _height: number;
        private _dummyViewer: TreeViewer;

        constructor(obj: any, renderer: ICellRenderer, width: number, height: number) {
            this._obj = obj;
            this._renderer = renderer;
            this._width = width;
            this._height = height;
            this._dummyViewer = new TreeViewer("");
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            this._renderer.renderCell(
                new RenderCellArgs(context, 0, 0, this._width, this._height, this._obj, this._dummyViewer, true));
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {
            // nothing
        }

        preload(): Promise<PreloadResult> {

            return this._renderer.preload(new PreloadCellArgs(this._obj, this._dummyViewer));
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