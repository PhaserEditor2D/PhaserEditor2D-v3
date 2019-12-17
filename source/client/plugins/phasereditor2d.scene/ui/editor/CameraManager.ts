namespace phasereditor2d.scene.ui.editor {

    export class CameraManager {

        private _editor: SceneEditor;
        private _dragStartPoint: Phaser.Math.Vector2;
        private _dragStartCameraScroll: Phaser.Math.Vector2;

        constructor(editor: SceneEditor) {
            this._editor = editor;
            this._dragStartPoint = null;

            const canvas = this._editor.getOverlayLayer().getCanvas();
            canvas.addEventListener("wheel", e => this.onWheel(e));
            canvas.addEventListener("mousedown", e => this.onMouseDown(e));
            canvas.addEventListener("mousemove", e => this.onMouseMove(e));
            canvas.addEventListener("mouseup", e => this.onMouseUp(e));

        }

        private getCamera() {
            return this._editor.getGameScene().getCamera();
        }

        private onMouseDown(e: MouseEvent): void {
            if (e.button === 1) {
                const camera = this.getCamera();
                this._dragStartPoint = new Phaser.Math.Vector2(e.offsetX, e.offsetY);
                this._dragStartCameraScroll = new Phaser.Math.Vector2(camera.scrollX, camera.scrollY);
                e.preventDefault();
            }

        }

        private onMouseMove(e: MouseEvent): void {
            if (this._dragStartPoint === null) {
                return;
            }

            const dx = this._dragStartPoint.x - e.offsetX;
            const dy = this._dragStartPoint.y - e.offsetY;

            const camera = this.getCamera();
            camera.scrollX = this._dragStartCameraScroll.x + dx / camera.zoom;
            camera.scrollY = this._dragStartCameraScroll.y + dy / camera.zoom;

            this._editor.repaint();

            e.preventDefault();
        }

        private onMouseUp(e: MouseEvent) {
            this._dragStartPoint = null;
            this._dragStartCameraScroll = null;
        }

        private onWheel(e: WheelEvent): void {
            const scene = this._editor.getGameScene();

            const camera = scene.getCamera();

            const delta: number = e.deltaY;

            const zoomDelta = (delta > 0 ? 0.9 : 1.1);

            //const pointer = scene.input.activePointer;

            const point1 = camera.getWorldPoint(e.offsetX, e.offsetY);

            camera.zoom *= zoomDelta;

            // update the camera matrix
            (<any>camera).preRender(scene.scale.resolution);

            const point2 = camera.getWorldPoint(e.offsetX, e.offsetY);

            const dx = point2.x - point1.x;
            const dy = point2.y - point1.y;

            camera.scrollX += -dx;
            camera.scrollY += -dy;

            this._editor.repaint();
        }

    }
}