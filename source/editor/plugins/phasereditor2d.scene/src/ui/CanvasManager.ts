namespace phasereditor2d.scene.ui {

    export class CanvasManager {

        private _freeCanvases: HTMLCanvasElement[];
        private _count: number;

        constructor() {

            this._freeCanvases = [];
            this._count = 0;
        }

        takeCanvas() {

            if (this._freeCanvases.length === 0) {

                this._count++;

                console.log("CanvasManager: create new canvas. Count new: " + this._count);

                const canvas = document.createElement("canvas");

                return canvas;

            } else {

                console.log("CanvasManager: reuse canvas. Total available: " + (this._freeCanvases.length - 1));

                return this._freeCanvases.pop();
            }
        }

        releaseCanvas(canvas: HTMLCanvasElement) {

            console.log("CanvasManager: release canvas. Total available: " + (this._freeCanvases.length + 1));

            this._freeCanvases.push(canvas);
        }
    }
}