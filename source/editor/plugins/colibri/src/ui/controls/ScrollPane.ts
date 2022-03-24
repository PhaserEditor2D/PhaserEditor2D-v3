namespace colibri.ui.controls {

    export class ScrollPane extends Control {

        private _clientControl: viewers.ViewerContainer;
        private _scrollBar: HTMLDivElement;
        private _scrollHandler: HTMLDivElement;
        private _clientContentHeight: number = 0;

        constructor(clientControl: viewers.ViewerContainer) {
            super("div", "ScrollPane");

            this._clientControl = clientControl;
            this.add(this._clientControl);

            this._scrollBar = document.createElement("div");
            this._scrollBar.classList.add("ScrollBar");
            this.getElement().appendChild(this._scrollBar);

            this._scrollHandler = document.createElement("div");
            this._scrollHandler.classList.add("ScrollHandler");
            this._scrollBar.appendChild(this._scrollHandler);

            const l2 = (e: MouseEvent) => this.onMouseDown(e);
            const l3 = (e: MouseEvent) => this.onMouseUp(e);
            const l4 = (e: MouseEvent) => this.onMouseMove(e);
            const l5 = (e: MouseEvent) => {
                if (!this.getElement().isConnected) {
                    window.removeEventListener("mousedown", l2);
                    window.removeEventListener("mouseup", l3);
                    window.removeEventListener("mousemove", l4);
                    window.removeEventListener("mousemove", l5);
                }
            };

            window.addEventListener("mousedown", l2);
            window.addEventListener("mouseup", l3);
            window.addEventListener("mousemove", l4);
            window.addEventListener("mousemove", l5);

            this.getViewer().getElement().addEventListener("wheel", e => this.onClientWheel(e));
            this._scrollBar.addEventListener("mousedown", e => this.onBarMouseDown(e));
        }

        getViewer() {

            return this._clientControl.getViewer();
        }

        updateScroll(clientContentHeight: number) {

            const scrollY = this.getViewer().getScrollY();

            const b = this.getBounds();

            let newScrollY = scrollY;
            newScrollY = Math.max(-this._clientContentHeight + b.height, newScrollY);
            newScrollY = Math.min(0, newScrollY);

            if (newScrollY !== scrollY) {

                this._clientContentHeight = clientContentHeight;
                this.setClientScrollY(scrollY);

            } else if (clientContentHeight !== this._clientContentHeight) {

                this._clientContentHeight = clientContentHeight;
                //this.getViewer().repaint();
                this.layout(false);
            }
        }

        private onBarMouseDown(e: MouseEvent) {

            if (e.target !== this._scrollBar) {

                return;
            }

            e.stopImmediatePropagation();
            const b = this.getBounds();
            this.setClientScrollY(- e.offsetY / b.height * (this._clientContentHeight - b.height));
        }

        private onClientWheel(e: WheelEvent) {

            if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {

                return;
            }

            let y = this.getViewer().getScrollY();

            y -= e.deltaY;

            this.setClientScrollY(y);
        }

        private setClientScrollY(y: number) {

            const b = this.getBounds();

            y = Math.max(-this._clientContentHeight + b.height, y);
            y = Math.min(0, y);

            this.getViewer().setScrollY(y);

            this.layout();
        }

        private _startDragY = -1;
        private _startScrollY = 0;

        private onMouseDown(e: MouseEvent) {

            if (e.target === this._scrollHandler) {

                e.stopImmediatePropagation();

                this._startDragY = e.y;
                this._startScrollY = this.getViewer().getScrollY();
            }
        }

        private onMouseMove(e: MouseEvent) {

            if (this._startDragY !== -1) {

                let delta = e.y - this._startDragY;
                const b = this.getBounds();
                delta = delta / b.height * this._clientContentHeight;
                this.setClientScrollY(this._startScrollY - delta);
            }
        }

        private onMouseUp(e: MouseEvent) {

            if (this._startDragY !== -1) {

                e.stopImmediatePropagation();
                this._startDragY = -1;
            }
        }

        getBounds() {

            const b = this.getElement().getBoundingClientRect();

            return { x: 0, y: 0, width: b.width, height: b.height };
        }

        layout(forceClientLayout = true) {

            const b = this.getBounds();

            if (b.height < this._clientContentHeight) {

                this._scrollHandler.style.display = "block";
                const h = Math.max(10, b.height / this._clientContentHeight * b.height);
                const y = -(b.height - h) * this.getViewer().getScrollY() / (this._clientContentHeight - b.height);

                controls.setElementBounds(this._scrollHandler, {
                    y: y,
                    height: h
                });

                this.removeClass("hideScrollBar");

            } else {

                this.addClass("hideScrollBar");
            }

            if (forceClientLayout) {

                this._clientControl.layout();

            } else {
                this._clientControl.getViewer().repaint();
            }
        }
    }

}