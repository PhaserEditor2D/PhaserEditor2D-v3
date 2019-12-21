namespace colibri.ui.controls {

    class TooltipManager {

        private _element: HTMLElement;
        private _enterTime: number;
        private _token: number;
        private _html: string;
        private _mousePosition: { x: number, y: number };

        constructor(element: HTMLElement, html: string) {

            this._element = element;
            this._html = html;

            this._token = 0;

            this._element.addEventListener("mouseenter", e => {

                this.start();
            });

            this._element.addEventListener("mouseleave", e => {

                this._enterTime = 0;
                this._token++;

                TooltipManager.closeTooltip();
            });

            this._element.addEventListener("mousemove", (e: MouseEvent) => {

                this._mousePosition = { x: e.clientX, y: e.clientY };

                if (Date.now() - this._enterTime > 500) {

                    this._token++;

                    this.start();
                }
            });
        }

        private start() {

            this._enterTime = Date.now();

            const token = this._token;

            setTimeout(() => {

                if (token !== this._token) {
                    return;
                }

                TooltipManager.showTooltip(this._mousePosition.x, this._mousePosition.y, this._html);

            }, 1000);
        }

        private static _tooltipElement: HTMLElement;

        private static showTooltip(mouseX: number, mouseY: number, html: string) {

            this.closeTooltip();

            this._tooltipElement = document.createElement("div");
            this._tooltipElement.classList.add("Tooltip");
            this._tooltipElement.innerHTML = html;
            document.body.append(this._tooltipElement);

            const bounds = this._tooltipElement.getBoundingClientRect();

            let left = mouseX - bounds.width / 2;
            let top = mouseY - bounds.height - 10;

            if (left < 0) {
                left = 5;
            }

            if (left + bounds.width > window.innerWidth) {
                left = window.innerWidth - bounds.width - 5;
            }

            if (top < 0) {
                top = mouseY + 20;
            }

            this._tooltipElement.style.left = left + "px";
            this._tooltipElement.style.top = top + "px";
        }

        private static closeTooltip() {

            if (this._tooltipElement) {
                this._tooltipElement.remove();
                this._tooltipElement = null;
            }
        }
    }

    export class Tooltip {

        static html(element: HTMLElement, html: string) {

            new TooltipManager(element, html);
        }

    }
}
