namespace colibri.ui.controls {

    export class IconControl {

        private _icon: IImage;
        _context: CanvasRenderingContext2D;
        private _canvas: HTMLCanvasElement;
        private static _themeListenerRegistered = false;

        constructor(icon?: IImage, isButtonStyle = false) {

            const size = RENDER_ICON_SIZE;

            this._canvas = document.createElement("canvas");
            this._canvas["__IconControl"] = this;

            this._canvas.classList.add("IconControlCanvas");
            this._canvas.width = this._canvas.height = size;
            this._canvas.style.width = this._canvas.style.height = size + "px";

            this._context = this._canvas.getContext("2d");

            this._context.imageSmoothingEnabled = false;

            Controls.adjustCanvasDPI(this._canvas, size, size);

            this.setIcon(icon);

            if (isButtonStyle) {

                this._canvas.classList.add("IconButton");
            }

            if (!IconControl._themeListenerRegistered) {

                IconControl._themeListenerRegistered = true;

                colibri.Platform.getWorkbench().eventThemeChanged.addListener(() => {

                    const result = document.getElementsByClassName("IconControlCanvas");

                    for (let i = 0; i < result.length; i++) {

                        const elem = result.item(i);

                        const control = IconControl.getIconControlOf(elem as HTMLElement);

                        control.repaint();
                    }
                });
            }
        }

        static getIconControlOf(element: HTMLElement) {

            return element["__IconControl"] as IconControl;
        }

        repaint() {

            if (this._icon) {

                const size = RENDER_ICON_SIZE;

                this._context.clearRect(0, 0, size, size);

                this._icon.paint(this._context, 0, 0, size, size, true);
            }
        }

        getCanvas() {

            return this._canvas;
        }

        getIcon() {

            return this._icon;
        }

        setIcon(icon: IImage, repaint = true) {
            this._icon = icon;

            if (repaint) {

                this.repaint();
            }
        }
    }
}