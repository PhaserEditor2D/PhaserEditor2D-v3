namespace colibri.ui.controls {

    export class SplitPanel extends Control {
        private _leftControl: Control;
        private _rightControl: Control;
        private _horizontal: boolean;
        private _splitPosition: number;
        private _splitFactor: number;
        private _splitWidth: number;
        private _startDrag: number = -1;
        private _startPos: number;

        constructor(left?: Control, right?: Control, horizontal = true) {
            super("div", "split");

            this._horizontal = horizontal;
            this._splitPosition = 50;
            this._splitFactor = 0.5;
            this._splitWidth = 2;

            const l0 = (e: DragEvent) => this.onDragStart(e);
            const l1 = (e: MouseEvent) => this.onMouseLeave(e);
            const l2 = (e: MouseEvent) => this.onMouseDown(e);
            const l3 = (e: MouseEvent) => this.onMouseUp(e);
            const l4 = (e: MouseEvent) => this.onMouseMove(e);
            const l5 = (e: MouseEvent) => {
                if (!this.getElement().isConnected) {
                    window.removeEventListener("dragstart", l0);
                    window.removeEventListener("mouseleave", l1);
                    window.removeEventListener("mousedown", l2);
                    window.removeEventListener("mouseup", l3);
                    window.removeEventListener("mousemove", l4);
                    window.removeEventListener("mousemove", l5);
                }
            };

            window.addEventListener("dragstart", l0);
            window.addEventListener("mouseleave", l1);
            window.addEventListener("mousedown", l2);
            window.addEventListener("mouseup", l3);
            window.addEventListener("mousemove", l4);
            window.addEventListener("mousemove", l5);

            if (left) {
                this.setLeftControl(left);
            }

            if (right) {
                this.setRightControl(right);
            }
        }

        private onDragStart(e: DragEvent) {

            if (this._startDrag !== -1) {

                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }

        private onMouseDown(e: MouseEvent) {

            const pos = this.getControlPosition(e.x, e.y);
            const offset = this._horizontal ? pos.x : pos.y;

            const inside = Math.abs(offset - this._splitPosition)
                <= SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);

            if (inside) {
                e.stopImmediatePropagation();
                this._startDrag = this._horizontal ? e.x : e.y;
                this._startPos = this._splitPosition;
            }
        }

        private onMouseUp(e: MouseEvent) {
            if (this._startDrag !== -1) {
                e.stopImmediatePropagation();
            }

            this._startDrag = -1;
        }

        private onMouseMove(e: MouseEvent) {
            const pos = this.getControlPosition(e.x, e.y);
            const offset = this._horizontal ? pos.x : pos.y;
            const screen = this._horizontal ? e.x : e.y;
            const boundsSize = this._horizontal ? this.getBounds().width : this.getBounds().height;
            const cursorResize = this._horizontal ? "ew-resize" : "ns-resize";

            const inside = Math.abs(offset - this._splitPosition)
                <= SPLIT_OVER_ZONE_WIDTH && this.containsLocalPoint(pos.x, pos.y);

            if (inside) {
                if (e.buttons === 0 || this._startDrag !== -1) {
                    e.preventDefault();
                    this.getElement().style.cursor = cursorResize;
                }
            } else {
                this.getElement().style.cursor = "inherit";
            }

            if (this._startDrag !== -1) {
                this.getElement().style.cursor = cursorResize;
                const newPos = this._startPos + screen - this._startDrag;
                if (newPos > 100 && boundsSize - newPos > 100) {
                    this._splitPosition = newPos;
                    this._splitFactor = this._splitPosition / boundsSize;
                    this.layout();
                }
            }
        }

        private onMouseLeave(e: MouseEvent) {
            this.getElement().style.cursor = "inherit";
            this._startDrag = -1;
        }

        setHorizontal(horizontal: boolean = true) {
            this._horizontal = horizontal;
        }

        setVertical(vertical: boolean = true) {
            this._horizontal = !vertical;
        }

        getSplitFactor() {
            return this._splitFactor;
        }

        private getSize() {
            const b = this.getBounds();
            return this._horizontal ? b.width : b.height;
        }

        setSplitFactor(factor: number) {
            this._splitFactor = Math.min(Math.max(0, factor), 1);
            this._splitPosition = this.getSize() * this._splitFactor;
        }

        setLeftControl(control: Control) {
            this._leftControl = control;
            this.add(control);
        }

        getLeftControl() {
            return this._leftControl;
        }

        setRightControl(control: Control) {
            this._rightControl = control;
            this.add(control);
        }

        getRightControl() {
            return this._rightControl;
        }

        layout() {

            setElementBounds(this.getElement(), this.getBounds());

            if (!this._leftControl || !this._rightControl) {
                return;
            }

            this.setSplitFactor(this._splitFactor);

            const pos = this._splitPosition;
            const sw = this._splitWidth;
            const b = this.getBounds();

            if (this._horizontal) {
                this._leftControl.setBoundsValues(0, 0, pos - sw, b.height);
                this._rightControl.setBoundsValues(pos + sw, 0, b.width - pos - sw, b.height);
            } else {
                this._leftControl.setBoundsValues(0, 0, b.width, pos - sw);
                this._rightControl.setBoundsValues(0, pos + sw, b.width, b.height - pos - sw);
            }
        }
    }
}