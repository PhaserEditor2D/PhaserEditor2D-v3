/// <reference path="./Control.ts" />

namespace colibri.ui.controls {

    export class CanvasControl extends Control {

        protected _canvas: HTMLCanvasElement;
        protected _context: CanvasRenderingContext2D;
        private _padding: number;

        constructor(padding: number = 0, ...classList: string[]) {
            super("canvas", "CanvasControl", ...classList);

            this._padding = padding;
            this._canvas = this.getElement() as HTMLCanvasElement;
            this.initContext();
        }

        getCanvas() {

            return this._canvas;
        }

        resizeTo(parent?: HTMLElement): void {

            parent = parent || this.getElement().parentElement;

            const b = parent.getBoundingClientRect();

            this.style.width = Math.floor(b.width - this._padding * 2) + "px";
            this.style.height = Math.floor(b.height - this._padding * 2) + "px";

            this.repaint();
        }

        getPadding() {

            return this._padding;
        }

        protected ensureCanvasSize(): void {

            if (this._canvas.width !== this._canvas.clientWidth || this._canvas.height !== this._canvas.clientHeight) {

                this._canvas.width = this._canvas.clientWidth;
                this._canvas.height = this._canvas.clientHeight;

                this.initContext();
            }
        }

        clear(): void {

            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        repaint(): void {

            this.ensureCanvasSize();

            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this.paint();
        }

        private initContext(): void {

            this._context = this.getCanvas().getContext("2d");
            this._context.imageSmoothingEnabled = false;
            this._context.font = `${controls.getCanvasFontHeight()}px sans-serif`;
        }

        protected paint() {

            // nothing
        };
    }
}