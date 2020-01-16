namespace phasereditor2d.scene.ui.editor {

    export interface ICameraState {
        scrollX: number;
        scrollY: number;
        zoom: number;
    }

    export class CameraManager {

        private _editor: SceneEditor;
        private _dragStartPoint: Phaser.Math.Vector2;
        private _dragStartCameraScroll: Phaser.Math.Vector2;
        private _state: ICameraState;

        constructor(editor: SceneEditor) {
            this._editor = editor;
            this._dragStartPoint = null;

            const canvas = this._editor.getOverlayLayer().getCanvas();

            canvas.addEventListener("wheel", e => this.onWheel(e));
            canvas.addEventListener("mousedown", e => this.onMouseDown(e));
            canvas.addEventListener("mousemove", e => this.onMouseMove(e));
            canvas.addEventListener("mouseup", e => this.onMouseUp(e));

            this._state = {
                scrollX: 0,
                scrollY: 0,
                zoom: 1
            };
        }

        private getCamera() {
            return this._editor.getScene().getCamera();
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

            this.updateState();

            this._editor.repaint();

            e.preventDefault();
        }

        private updateState() {

            const camera = this.getCamera();

            this._state.scrollX = camera.scrollX;
            this._state.scrollY = camera.scrollY;
            this._state.zoom = camera.zoom;
        }

        private onMouseUp(e: MouseEvent) {
            this._dragStartPoint = null;
            this._dragStartCameraScroll = null;
        }

        private onWheel(e: WheelEvent): void {

            const scene = this._editor.getScene();

            const camera = scene.getCamera();

            const delta: number = e.deltaY;

            const zoomDelta = (delta > 0 ? 0.9 : 1.1);

            // const pointer = scene.input.activePointer;

            const point1 = camera.getWorldPoint(e.offsetX, e.offsetY);

            camera.zoom *= zoomDelta;

            // update the camera matrix
            (camera as any).preRender(scene.scale.resolution);

            const point2 = camera.getWorldPoint(e.offsetX, e.offsetY);

            const dx = point2.x - point1.x;
            const dy = point2.y - point1.y;

            camera.scrollX += -dx;
            camera.scrollY += -dy;

            this.updateState();

            this._editor.repaint();
        }

        getState() {

            return this._state;
        }

        setState(state: editor.ICameraState) {

            if (state) {

                const camera = this.getCamera();

                camera.scrollX = state.scrollX;
                camera.scrollY = state.scrollY;
                camera.zoom = state.zoom;

                this._state = state;
            }
        }

    }
}