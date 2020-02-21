namespace colibri.ui.controls {

    export class MutableIcon {

        private _element: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        private _icon: IImage;

        constructor() {

            this._element = document.createElement("canvas");
            this._element.classList.add("MutableIcon");
            this._element.width = ICON_SIZE;
            this._element.height = ICON_SIZE;
            this._element.style.width = ICON_SIZE + "px";
            this._element.style.height = ICON_SIZE + "px";

            this._context = this._element.getContext("2d");
            this._context.imageSmoothingEnabled = false;
        }

        getElement() {
            return this._element;
        }

        setIcon(icon: IImage) {
            this._icon = icon;
        }

        getIcon() {
            return this._icon;
        }

        repaint() {

            this._context.clearRect(0, 0, ICON_SIZE, ICON_SIZE);

            if (this._icon) {

                this._icon.paint(this._context, 0, 0, ICON_SIZE, ICON_SIZE, true);
            }
        }
    }
}