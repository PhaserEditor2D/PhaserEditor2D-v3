namespace colibri.ui.controls {

    export class Menu {

        private _text: string;
        private _items: unknown[];
        private _element: HTMLDivElement;
        private _bgElement: HTMLDivElement;
        private _menuCloseCallback: () => void;
        private static _activeMenu: Menu = null;
        private _subMenu: Menu;
        private _parentMenu: Menu;

        constructor(text?: string) {

            this._items = [];
            this._text = text;
        }

        setMenuClosedCallback(callback: () => void) {
            this._menuCloseCallback = callback;
        }

        add(action: Action) {
            this._items.push(action);
        }

        addMenu(subMenu: Menu) {

            subMenu._parentMenu = this;

            this._items.push(subMenu);
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

                if (ext.getMenuId() === menuId) {

                    ext.fillMenu(this);
                }
            }
        }

        addSeparator() {
            this._items.push(null);
        }

        isEmpty() {
            return this._items.length === 0;
        }

        getElement() {
            return this._element;
        }

        static getActiveMenu() {
            return this._activeMenu;
        }

        create(x: number, y: number, modal?: boolean) {

            Menu._activeMenu = this;

            let hasIcon = false;

            this._element = document.createElement("div");
            this._element.classList.add("Menu");

            let lastIsSeparator = true;

            for (const item of this._items) {

                if (item === null) {

                    if (!lastIsSeparator) {

                        lastIsSeparator = true;

                        const sepElement = document.createElement("div");
                        sepElement.classList.add("MenuItemSeparator");
                        this._element.appendChild(sepElement);
                    }

                    continue;
                }

                lastIsSeparator = false;

                const itemElement = document.createElement("div");
                itemElement.classList.add("MenuItem");

                if (item instanceof Action) {

                    if (item.isSelected()) {

                        const checkedElement = Controls.createIconElement(
                            Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_CHECKED));
                        checkedElement.classList.add("MenuItemCheckedIcon");

                        itemElement.appendChild(checkedElement);
                    }

                    if (item.getIcon()) {

                        const iconElement = Controls.createIconElement(item.getIcon());
                        iconElement.classList.add("MenuItemIcon");
                        itemElement.appendChild(iconElement);

                        hasIcon = true;
                    }

                    const labelElement = document.createElement("label");
                    labelElement.classList.add("MenuItemText");
                    labelElement.innerText = item.getText();
                    itemElement.appendChild(labelElement);

                    const keyString = item.getCommandKeyString();

                    if (keyString) {

                        const keyElement = document.createElement("span");
                        keyElement.innerText = keyString;
                        keyElement.classList.add("MenuItemKeyString");
                        itemElement.appendChild(keyElement);
                    }

                    if (item.isEnabled()) {

                        itemElement.addEventListener("click", ev => {

                            if (this._parentMenu) {
                                this._parentMenu.close();
                            }

                            this.close();

                            item.run();
                        });

                    } else {

                        itemElement.classList.add("MenuItemDisabled");
                    }

                    itemElement.addEventListener("mouseenter", e => {

                        this.closeSubMenu();
                    });

                } else {

                    const subMenu = item as Menu;

                    const labelElement = document.createElement("label");
                    labelElement.classList.add("MenuItemText");
                    labelElement.innerText = subMenu.getText();
                    itemElement.appendChild(labelElement);

                    itemElement.addEventListener("mouseenter", e => {

                        this.closeSubMenu();

                        const menuRect = this._element.getClientRects().item(0);
                        const subMenuX = menuRect.right;
                        const subMenuY = menuRect.top;

                        subMenu.create(subMenuX - 5, subMenuY + itemElement.offsetTop, false);

                        this._subMenu = subMenu;
                    });

                    const keyElement = document.createElement("span");
                    keyElement.innerHTML = "&RightTriangle;";
                    keyElement.classList.add("MenuItemKeyString");
                    itemElement.appendChild(keyElement);
                }

                this._element.appendChild(itemElement);
            }

            if (!hasIcon) {

                this._element.classList.add("MenuNoIcon");
            }

            if (modal) {

                this._bgElement = document.createElement("div");

                this._bgElement.classList.add("MenuContainer");

                this._bgElement.addEventListener("mousedown", (ev: MouseEvent) => {

                    ev.preventDefault();
                    ev.stopImmediatePropagation();

                    this.close();
                });

                document.body.appendChild(this._bgElement);
            }

            document.body.appendChild(this._element);

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

        private closeSubMenu() {

            if (this._subMenu) {

                this._subMenu.close();
                this._subMenu = null;
            }
        }

        createWithEvent(e: MouseEvent) {

            this.create(e.clientX, e.clientY, true);
        }

        getText() {
            return this._text;
        }

        close() {

            Menu._activeMenu = this._parentMenu;

            if (this._bgElement) {
                this._bgElement.remove();
            }

            this._element.remove();

            if (this._menuCloseCallback) {
                this._menuCloseCallback();
            }

            if (this._subMenu) {

                this._subMenu.close();
            }
        }

        closeAll() {

            if (this._parentMenu) {

                this._parentMenu.closeAll();
            }

            this.close();
        }
    }
}