namespace colibri.ui.controls {

    export class CanvasProgressMonitor implements controls.IProgressMonitor {

        private _canvas: HTMLCanvasElement;
        private _total: number;
        private _progress: number;
        private _ctx: CanvasRenderingContext2D;

        constructor(canvas: HTMLCanvasElement) {

            this._canvas = canvas;
            this._progress = 0;
            this._total = 0;

            this._ctx = this._canvas.getContext("2d");
        }

        addTotal(total: number) {

            this._total = total;

            this.render();
        }

        step() {

            this._progress += 1;

            this.render();
        }

        private render() {

            const ctx = this._ctx;
            const w = this._canvas.width / (window.devicePixelRatio || 1);
            const h = this._canvas.height / (window.devicePixelRatio || 1);
            const margin = w * 0.4;
            const y = h * 0.5;
            const f = Math.min(1, this._progress / this._total);
            const len = f * (w - margin * 2);

            ctx.clearRect(0, 0, w, h);

            ctx.save();

            ctx.fillStyle = "#ffffff44";
            ctx.fillRect(margin, y - 1, w - margin * 2, 2);

            ctx.fillStyle = "#fff";
            ctx.fillRect(margin, y - 1, len, 2);

            ctx.fillStyle = "#ffffffaa";
            ctx.fillText("loading", margin, y - 10);

            ctx.restore();
        }
    }
}