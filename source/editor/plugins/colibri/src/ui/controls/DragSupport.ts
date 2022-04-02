namespace colibri.ui.controls {

    export class DragSupport {

        private static _canvas: HTMLCanvasElement;
        private static _dragging = false;

        static start() {

            this._canvas = document.createElement("canvas");
            this._canvas.setAttribute("id", "__drag__canvas");
            this._canvas.style.imageRendering = "crisp-edges";
            this._canvas.width = 64;
            this._canvas.height = 64;
            this._canvas.style.width = this._canvas.width + "px";
            this._canvas.style.height = this._canvas.height + "px";
            this._canvas.style.position = "fixed";
            this._canvas.style.left = "0px";
            this._canvas.style.zIndex = "90000";

            document.body.appendChild(this._canvas);

            window.addEventListener("dragend", () => {

                console.log("dragend");

                this._canvas.style.left = "0px";
                this._dragging = false;
            });

            window.addEventListener("drag", e => this.positionCanvas(e))
        }

        private static positionCanvas(e: DragEvent) {

            if (!this._dragging) {

                return;
            }

            console.log("postion drag canvas " + e.clientX + " " + e.clientY);

            this._canvas.style.left = e.clientX + "px";
            this._canvas.style.top = e.clientY + "px";
        }

        static setDragEventImage(e: DragEvent, render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {

            try {

                console.log("start dragging");

                this._dragging = true;

                // const ctx = this._canvas.getContext("2d");

                // ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

                // render(ctx, this._canvas.width, this._canvas.height);

                // this.positionCanvas(e);

            } catch (e) {

                console.log(e);

                alert(e.message);
            }
        }
    }
}