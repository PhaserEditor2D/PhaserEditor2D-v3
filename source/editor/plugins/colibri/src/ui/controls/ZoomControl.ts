namespace colibri.ui.controls {

    export class ZoomControl {

        private _element: HTMLDivElement;
        private _callback: (zoom: number) => void;

        constructor(args: { showReset: boolean }) {

            this._element = document.createElement("div");
            this._element.classList.add("ZoomControl");


            // zoom in

            const zoomIn = new IconControl(ColibriPlugin.getInstance().getIcon(ICON_ZOOM_IN), true);

            this._element.appendChild(zoomIn.getCanvas());

            zoomIn.getCanvas().addEventListener("click", e => {

                if (this._callback) {

                    this._callback(1);
                }
            });

            // zoom out

            const zoomOut = new IconControl(ColibriPlugin.getInstance().getIcon(ICON_ZOOM_OUT), true);
            this._element.appendChild(zoomOut.getCanvas());

            zoomOut.getCanvas().addEventListener("click", e => {

                if (this._callback) {

                    this._callback(-1);
                }
            });

            // reset

            if (args.showReset) {

                const zoomReset = new IconControl(ColibriPlugin.getInstance().getIcon(ICON_ZOOM_RESET), true);

                this._element.appendChild(zoomReset.getCanvas());

                zoomReset.getCanvas().addEventListener("click", e => {

                    if (this._callback) {

                        this._callback(0);
                    }
                });
            }
        }

        setCallback(callback: (zoom: number) => void) {

            this._callback = callback;
        }

        getElement() {

            return this._element;
        }
    }
}