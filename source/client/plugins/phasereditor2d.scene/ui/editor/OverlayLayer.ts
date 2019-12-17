namespace phasereditor2d.scene.ui.editor {

    export class OverlayLayer {

        private _editor: SceneEditor;
        private _canvas: HTMLCanvasElement;
        private _ctx: CanvasRenderingContext2D;

        constructor(editor: SceneEditor) {
            this._editor = editor;
            this._canvas = document.createElement("canvas");
            this._canvas.style.position = "absolute";
        }

        getCanvas(): HTMLCanvasElement {
            return this._canvas;
        }

        private resetContext() {
            this._ctx = this._canvas.getContext("2d");
            this._ctx.imageSmoothingEnabled = false;
            this._ctx.font = "12px Monospace";
        }

        resizeTo() {
            const parent = this._canvas.parentElement;
            this._canvas.width = parent.clientWidth | 0;
            this._canvas.height = parent.clientHeight | 0;
            this._canvas.style.width = this._canvas.width + "px";
            this._canvas.style.height = this._canvas.height + "px";
            this.resetContext();
        }

        render() {
            if (!this._ctx) {
                this.resetContext();
            }

            this.renderGrid();
            this.renderSelection();
        }

        private renderSelection() {

            const ctx = this._ctx;

            ctx.save();

            const camera = this._editor.getGameScene().getCamera();

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    const sprite = obj as gameobjects.EditorObject;

                    const points = sprite.getScreenBounds(camera);

                    if (points.length === 4) {

                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 4;

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        ctx.lineTo(points[1].x, points[1].y);
                        ctx.lineTo(points[2].x, points[2].y);
                        ctx.lineTo(points[3].x, points[3].y);
                        ctx.closePath();
                        ctx.stroke();

                        ctx.strokeStyle = "#00ff00";
                        ctx.lineWidth = 2;

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        ctx.lineTo(points[1].x, points[1].y);
                        ctx.lineTo(points[2].x, points[2].y);
                        ctx.lineTo(points[3].x, points[3].y);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }

            ctx.restore();
        }

        private renderGrid() {
            const camera = this._editor.getGameScene().getCamera();

            // parameters from settings

            const snapEnabled = false;
            const snapX = 10;
            const snapY = 10;

            const borderX = 0;
            const borderY = 0
            const borderWidth = 800;
            const borderHeight = 600;

            const ctx = this._ctx;
            const canvasWidth = this._canvas.width;
            const canvasHeight = this._canvas.height;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // render grid

            ctx.strokeStyle = "#aeaeae";
            ctx.lineWidth = 1;

            let gapX = 4;
            let gapY = 4;

            if (snapEnabled) {
                gapX = snapX;
                gapY = snapY;
            }

            {
                for (let i = 1; true; i++) {
                    const delta = camera.getScreenPoint(gapX * i, gapY * i).subtract(camera.getScreenPoint(0, 0));
                    if (delta.x > 64 && delta.y > 64) {
                        gapX = gapX * i;
                        gapY = gapY * i;
                        break;
                    }
                }
            }

            const worldStartPoint = camera.getWorldPoint(0, 0);

            worldStartPoint.x = Phaser.Math.Snap.Floor(worldStartPoint.x, gapX);
            worldStartPoint.y = Phaser.Math.Snap.Floor(worldStartPoint.y, gapY);


            const worldEndPoint = camera.getWorldPoint(canvasWidth, canvasHeight);

            const grid = (
                render: {
                    horizontal: (worldX: number, screenX: number) => void,
                    vertical: (worldY: number, screenY: number) => void
                }
            ) => {

                let worldY = worldStartPoint.y;
                while (worldY < worldEndPoint.y) {
                    let point = camera.getScreenPoint(0, worldY);
                    render.horizontal(worldY, point.y | 0);
                    worldY += gapY;
                }

                let worldX = worldStartPoint.x;
                while (worldX < worldEndPoint.x) {
                    let point = camera.getScreenPoint(worldX, 0);
                    render.vertical(worldX, point.x | 0);
                    worldX += gapX;
                }
            }

            let labelWidth = 0;

            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;

            // labels

            grid({
                horizontal: (worldY, screenY) => {
                    const w = ctx.measureText(worldY.toString()).width;
                    labelWidth = Math.max(labelWidth, w + 2);
                    ctx.save();
                    ctx.fillStyle = "#000000";
                    ctx.fillText(worldY.toString(), 0 + 1, screenY + 4 + 1);
                    ctx.restore();
                    ctx.fillText(worldY.toString(), 0, screenY + 4);
                },
                vertical: (worldX, screenX) => {
                    if (screenX < labelWidth) {
                        return;
                    }
                    const w = ctx.measureText(worldX.toString()).width;
                    ctx.save();
                    ctx.fillStyle = "#000000";
                    ctx.fillText(worldX.toString(), screenX - w / 2 + 1, 15 + 1);
                    ctx.restore();
                    ctx.fillText(worldX.toString(), screenX - w / 2, 15);
                }
            });


            // lines 

            grid({
                horizontal: (worldY, screenY) => {
                    if (screenY < 20) {
                        return;
                    }
                    ctx.beginPath();
                    ctx.moveTo(labelWidth, screenY);
                    ctx.lineTo(canvasWidth, screenY);
                    ctx.stroke();
                },
                vertical: (worldX, screenX) => {
                    if (screenX < labelWidth) {
                        return;
                    }
                    ctx.beginPath();
                    ctx.moveTo(screenX, 20);
                    ctx.lineTo(screenX, canvasHeight);
                    ctx.stroke();
                }
            });

            ctx.restore();

            {
                ctx.save();
                ctx.lineWidth = 2;
                const a = camera.getScreenPoint(borderX, borderY);
                const b = camera.getScreenPoint(borderX + borderWidth, borderY + borderHeight);
                ctx.save();
                ctx.strokeStyle = "#404040";
                ctx.strokeRect(a.x + 2, a.y + 2, b.x - a.x, b.y - a.y);
                ctx.restore();

                ctx.lineWidth = 1;
                ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
                ctx.restore();
            }
        }
    }

}