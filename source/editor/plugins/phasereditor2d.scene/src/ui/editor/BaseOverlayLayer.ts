namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export abstract class BaseOverlayLayer {

        private _canvas: HTMLCanvasElement;
        private _ctx: CanvasRenderingContext2D;
        private _loading: boolean;

        constructor() {

            this._canvas = document.createElement("canvas");
            this._canvas.style.position = "absolute";
        }

        protected abstract renderLayer(): void;

        setLoading(loading: boolean) {

            this._loading = loading;
        }

        isLoading() {

            return this._loading;
        }

        createLoadingMonitor(): controls.IProgressMonitor {

            return new controls.CanvasProgressMonitor(this.getCanvas());
        }

        getCanvas(): HTMLCanvasElement {
            return this._canvas;
        }

        private resetContext() {

            this._ctx = this._canvas.getContext("2d");

            controls.Controls.adjustCanvasDPI(this._canvas);

            this._ctx.imageSmoothingEnabled = false;
            this._ctx.font = "12px Monospace";
        }

        resizeTo() {

            const parent = this._canvas.parentElement;
            this._canvas.width = Math.floor(parent.clientWidth);
            this._canvas.height = Math.floor(parent.clientHeight);
            this._canvas.style.width = this._canvas.width + "px";
            this._canvas.style.height = this._canvas.height + "px";

            this.resetContext();
        }

        render() {

            if (!this._ctx) {

                this.resetContext();
            }

            if (!this._loading) {

                const canvasWidth = this.getCanvas().width;
                const canvasHeight = this.getCanvas().height;

                this._ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                this.renderLayer();
            }
        }

        getContext() {
            return this._ctx;
        }
    }
}