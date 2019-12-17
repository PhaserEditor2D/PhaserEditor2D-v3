namespace colibri.ui.controls {

    export class Menu {

        private _actions: Action[];
        private _element: HTMLUListElement;
        private _bgElement: HTMLDivElement;
        private _menuCloseCallback: () => void;
        private static _activeMenu : Menu = null;

        constructor() {
            this._actions = [];
        }

        setMenuClosedCallback(callback: () => void) {
            this._menuCloseCallback = callback;
        }

        add(action: Action) {
            this._actions.push(action);
        }

        addSeparator() {
            this._actions.push(null);
        }

        isEmpty() {
            return this._actions.length === 0;
        }

        getElement() {
            return this._element;
        }

        static getActiveMenu() {
            return this._activeMenu;
        }

        create(e: MouseEvent) {

            Menu._activeMenu = this;

            this._element = document.createElement("ul");
            this._element.classList.add("Menu");

            let lastIsSeparator = true;

            for (const action of this._actions) {

                if (action === null) {

                    if (!lastIsSeparator) {

                        lastIsSeparator = true;

                        const sepElement = document.createElement("li");
                        sepElement.classList.add("MenuItemSeparator");
                        this._element.appendChild(sepElement);
                    }

                    continue;
                }

                lastIsSeparator = false;

                const item = document.createElement("li");

                item.classList.add("MenuItem");

                item.innerText = action.getText();

                if (action.isEnabled()) {

                    item.addEventListener("click", e => {

                        this.close();

                        action.run();
                    });

                } else {

                    item.classList.add("MenuItemDisabled");
                }

                this._element.appendChild(item);
            }

            this._bgElement = document.createElement("div");

            this._bgElement.classList.add("MenuContainer");

            this._bgElement.addEventListener("mousedown", e => {

                e.preventDefault();
                e.stopImmediatePropagation();

                this.close();
            });

            document.body.appendChild(this._bgElement);

            document.body.appendChild(this._element);

            let x = e.clientX;
            let y = e.clientY;

            const rect = this._element.getClientRects()[0];

            if (y + rect.height > window.innerHeight) {
                y -= rect.height;
            }

            if (x + rect.width > window.innerWidth) {
                x -= rect.width;
            }

            this._element.style.left = x + "px";
            this._element.style.top = y + "px";
        }

        close() {

            Menu._activeMenu = null;

            this._bgElement.remove();
            this._element.remove();

            if (this._menuCloseCallback) {
                this._menuCloseCallback();
            }
        }
    }
}