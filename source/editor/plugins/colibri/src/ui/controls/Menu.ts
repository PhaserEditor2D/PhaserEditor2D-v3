namespace colibri.ui.controls {

    export class Menu {

        private _text: string;
        private _items: (Action | Menu)[];
        private _element: HTMLDivElement;
        private _bgElement: HTMLDivElement;
        private _menuCloseCallback: () => void;
        private static _activeMenu: Menu = null;
        private _subMenu: Menu;
        private _parentMenu: Menu;
        private _lastItemElementSelected: HTMLDivElement;
        private _icon: IImage;

        constructor(text?: string, icon?: IImage) {

            this._items = [];
            this._text = text;
            this._icon = icon;
        }

        getIcon() {

            return this._icon;
        }

        setIcon(icon: IImage) {

            this._icon = icon;
        }

        setMenuClosedCallback(callback: () => void) {

            this._menuCloseCallback = callback;
        }

        add(action: Action) {

            this._items.push(action);
        }

        addAction(actionConfig: IActionConfig) {

            this.add(new Action(actionConfig));
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

        static closeAll() {

            if (this._activeMenu) {

                this._activeMenu.closeAll();
            }
        }

        static getActiveMenu() {

            if (this._activeMenu && !this._activeMenu._element.isConnected) {

                this._activeMenu = undefined;
            }

            return this._activeMenu;
        }

        create(x: number, y: number, modal?: boolean, openLeft?: boolean) {

            if (this._items.length === 0) {

                return;
            }

            Menu._activeMenu = this;

            this._element = document.createElement("div");
            this._element.classList.add("Menu");

            let lastIsSeparator = true;

            let hasIcon = false;

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

                const icon = item.getIcon();

                if (item instanceof Action) {

                    if (item.isSelected()) {

                        const checkElement = document.createElement("span");
                        checkElement.innerHTML = "&check;";
                        checkElement.classList.add("MenuItemCheckedIcon");
                        itemElement.appendChild(checkElement)
                    }

                    if (icon) {

                        this.createIconPart(icon, itemElement);

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

                            this.closeAll();

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

                    if (icon) {

                        this.createIconPart(subMenu.getIcon(), itemElement);

                        hasIcon = true;
                    }

                    const labelElement = document.createElement("label");
                    labelElement.classList.add("MenuItemText");
                    labelElement.innerText = subMenu.getText();
                    itemElement.appendChild(labelElement);

                    itemElement.addEventListener("mouseenter", e => {

                        this.closeSubMenu();

                        itemElement.classList.add("MenuItemSelected");

                        const menuRect = this._element.getClientRects().item(0);

                        const subMenuX = menuRect.right;
                        const subMenuY = menuRect.top;

                        subMenu.create(subMenuX - 5, subMenuY + itemElement.offsetTop, false);

                        if (subMenu._element) {

                            const subMenuRect = subMenu._element.getClientRects()[0];

                            if (Math.floor(subMenuRect.left) < Math.floor(menuRect.right) - 5) {

                                subMenu._element.style.left = menuRect.left - subMenuRect.width + 5 + "px";
                            }
                        }

                        this._subMenu = subMenu;
                        this._lastItemElementSelected = itemElement;
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

                const stop = (e: MouseEvent) => {

                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                this._bgElement.addEventListener("contextmenu", stop);

                this._bgElement.addEventListener("mouseup", stop);

                this._bgElement.addEventListener("mousedown", (ev: MouseEvent) => {

                    stop(ev);

                    this.closeAll();
                });

                document.body.appendChild(this._bgElement);
            }

            document.body.appendChild(this._element);

            const rect = this._element.getClientRects()[0];

            if (y + rect.height > window.innerHeight) {

                y = window.innerHeight - rect.height - 10;
            }

            if (x + rect.width > window.innerWidth || openLeft) {

                x -= rect.width;
            }

            this._element.style.left = x + "px";
            this._element.style.top = y + "px";
        }

        private createIconPart(icon: IImage, itemElement: HTMLDivElement) {
            {
                const iconControl = new controls.IconControl(icon);
                iconControl.getCanvas().classList.add("MenuItemIcon", "ThemeMenuItemIcon");
                itemElement.appendChild(iconControl.getCanvas());
            }

            {
                if (icon instanceof IconImage) {

                    icon = icon.getNegativeThemeImage();
                }

                const iconControl = new controls.IconControl(icon);
                iconControl.getCanvas().classList.add("MenuItemIcon", "NegativeMenuItemIcon");
                itemElement.appendChild(iconControl.getCanvas());
            }
        }

        private closeSubMenu() {

            if (this._lastItemElementSelected) {

                this._lastItemElementSelected.classList.remove("MenuItemSelected");
            }

            if (this._subMenu) {

                this._subMenu.close();
                this._subMenu = null;
            }
        }

        createWithEvent(e: MouseEvent, openLeft = false, alignToElement = false) {

            e.preventDefault();

            if (Menu._activeMenu) {

                Menu._activeMenu.closeAll();
            }

            let x = e.clientX;
            let y = e.clientY;

            let element = e.target as HTMLElement;

            const isToolbarItem = ToolbarManager.isToolbarItem(element);

            if (isToolbarItem) {

                element = ToolbarManager.findToolbarItem(element);
            }

            alignToElement = element instanceof HTMLButtonElement
                || isToolbarItem
                || element.classList.contains("IconButton")
                || alignToElement;


            const targetRect = element.getBoundingClientRect();

            if (alignToElement) {

                x = targetRect.x;
                y = targetRect.bottom + 2;
            }

            this.create(x, y, true, openLeft);

            if (alignToElement && this._element) {

                const menuRect = this._element.getBoundingClientRect();

                if (menuRect.width < targetRect.width) {

                    this._element.style.width = targetRect.width + "px";
                }

                if (menuRect.width > window.innerWidth - x || openLeft) {

                    this._element.style.left = Math.max(0, targetRect.right - menuRect.width) + "px";
                }

                if (menuRect.height > window.innerHeight - y) {

                    y = targetRect.top - menuRect.height;

                    if (y < 0) {

                        y = 10;
                        this._element.style.maxHeight = targetRect.top - y - 4 + "px";
                        this._element.style.overflowY = "auto";

                    }

                    this._element.style.top = y - 2 + "px";
                }
            }
        }

        getText() {
            return this._text;
        }

        close() {

            Menu._activeMenu = this._parentMenu;

            if (this._bgElement) {
                this._bgElement.remove();
            }

            if (this._element) {

                this._element.remove();
            }

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
                this._parentMenu = undefined;
            }

            this.close();
        }
    }
}