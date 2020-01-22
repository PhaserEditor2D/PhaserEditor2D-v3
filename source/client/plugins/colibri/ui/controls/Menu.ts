namespace colibri.ui.controls {

    export class Menu {

        private _actions: Action[];
        private _element: HTMLDivElement;
        private _bgElement: HTMLDivElement;
        private _menuCloseCallback: () => void;
        private static _activeMenu: Menu = null;

        constructor() {
            this._actions = [];
        }

        setMenuClosedCallback(callback: () => void) {
            this._menuCloseCallback = callback;
        }

        add(action: Action) {
            this._actions.push(action);
        }

        addCommand(commandId: string, config?: IActionConfig) {

            if (!config) {

                config = {};
            }

            config.commandId = commandId;

            this.add(new Action(config));
        }

        addExtension(menuId: string) {

            const exts = Platform.getExtensions<MenuExtension>(MenuExtension.POINT_ID);

            for (const ext of exts) {

                ext.fillMenu(this);
            }
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

            this._element = document.createElement("div");
            this._element.classList.add("Menu");

            let lastIsSeparator = true;

            for (const action of this._actions) {

                if (action === null) {

                    if (!lastIsSeparator) {

                        lastIsSeparator = true;

                        const sepElement = document.createElement("div");
                        sepElement.classList.add("MenuItemSeparator");
                        this._element.appendChild(sepElement);
                    }

                    continue;
                }

                lastIsSeparator = false;

                const item = document.createElement("div");
                item.classList.add("MenuItem");

                const keyString = action.getCommandKeyString();

                if (action.getIcon()) {

                    const iconElement = Controls.createIconElement(action.getIcon());
                    iconElement.classList.add("MenuItemIcon");
                    item.appendChild(iconElement);
                }

                const labelElement = document.createElement("label");
                labelElement.classList.add("MenuItemText");
                labelElement.innerText = action.getText();
                item.appendChild(labelElement);

                if (keyString) {

                    const keyElement = document.createElement("span");
                    keyElement.innerText = keyString;
                    keyElement.classList.add("MenuItemKeyString");
                    item.appendChild(keyElement);
                }

                if (action.isEnabled()) {

                    item.addEventListener("click", ev => {

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

            this._bgElement.addEventListener("mousedown", (ev: MouseEvent) => {

                ev.preventDefault();
                ev.stopImmediatePropagation();

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