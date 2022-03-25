namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

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

            const zoomIcon = new controls.ZoomControl({ showReset: true });

            zoomIcon.setCallback(z => this.controlZoom(z * 100));

            this._editor.getCanvasContainer().appendChild(zoomIcon.getElement());
        }

        private getCamera() {

            return this._editor.getScene().getCamera();
        }

        private onMouseDown(e: MouseEvent): void {

            if (e.button === 1 || e.button === 0 && e.altKey) {

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

            e.preventDefault();

            this.zoom(e.deltaY, e.offsetX, e.offsetY);
        }

        private zoom(deltaY: number, offsetX: number, offsetY: number) {

            const scene = this._editor.getScene();

            const camera = scene.getCamera();

            const point1 = camera.getWorldPoint(offsetX, offsetY);

            const scrollWidth = Math.abs(deltaY) * 2;

            const screenWidth = this._editor.getElement().getBoundingClientRect().width;

            const zoomDelta = scrollWidth / (screenWidth + scrollWidth);

            const zoomFactor = (deltaY > 0 ? 1 - zoomDelta : 1 + zoomDelta);

            camera.zoom = camera.zoom * zoomFactor;

            // update the camera matrix
            (camera as any).preRender();

            const point2 = camera.getWorldPoint(offsetX, offsetY);

            const dx = point2.x - point1.x;
            const dy = point2.y - point1.y;

            camera.scrollX += -dx;
            camera.scrollY += -dy;

            this.updateState();

            this._editor.repaint();
        }

        private controlZoom(z: number) {

            if (z === 0) {

                // reset zoom

                const { borderX, borderY } = this._editor.getScene().getSettings();

                const camera = this.getCamera();
                camera.scrollX = borderX;
                camera.scrollY = borderY;
                camera.zoom = 1;

                this.updateState();

                this._editor.repaint();

            } else {

                const b = this._editor.getCanvasContainer().getBoundingClientRect();

                this.zoom(-z, b.width / 2, b.height / 2);
            }
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