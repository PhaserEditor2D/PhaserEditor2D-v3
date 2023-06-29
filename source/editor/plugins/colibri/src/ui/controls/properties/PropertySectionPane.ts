namespace colibri.ui.controls.properties {

    export class PropertySectionPane extends Control {

        private _section: PropertySection<any>;
        private _titleArea: HTMLDivElement;
        private _formArea: HTMLDivElement;
        private _page: PropertyPage;
        private _menuIcon: IconControl;
        private _expandIconControl: IconControl;
        private _titleLabel: HTMLLabelElement;

        constructor(page: PropertyPage, section: PropertySection<any>) {
            super();

            this._page = page;

            this._section = section;

            this.addClass("PropertySectionPane");

            const hashType = section.getTypeHash();

            if (hashType) {

                this.getElement().setAttribute("type-hash", section.getTypeHash());
            }
        }

        createSection() {

            if (!this._formArea) {

                this._titleArea = document.createElement("div");
                this._titleArea.classList.add("PropertyTitleArea");
                this._titleArea.addEventListener("click", () => this.toggleSection());

                this._expandIconControl = new IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_TREE_COLLAPSE));

                this._expandIconControl.getCanvas().classList.add("expanded");

                this._expandIconControl.getCanvas().addEventListener("click", e => {

                    e.stopImmediatePropagation();

                    this.toggleSection()
                });

                this._titleArea.appendChild(this._expandIconControl.getCanvas());

                const icon = this._section.getIcon();

                if (icon) {

                    const iconControl = new IconControl(icon);
                    iconControl.getCanvas().classList.add("PropertySectionIcon");
                    this._titleArea.appendChild(iconControl.getCanvas());
                    this._titleArea.classList.add("PropertyTitleAreaWithIcon");
                }

                this._titleLabel = document.createElement("label");
                this._titleLabel.classList.add("TitleLabel");
                this.updateTitle();
                this._titleArea.appendChild(this._titleLabel);

                this._menuIcon = new IconControl(ColibriPlugin.getInstance().getIcon(ICON_SMALL_MENU));
                this._menuIcon.getCanvas().classList.add("IconButton");
                this._menuIcon.getCanvas().style.visibility = this._section.hasMenu() ? "visible" : "hidden";
                this._menuIcon.getCanvas().addEventListener("click", e => {

                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    if (this._section.hasMenu()) {

                        const menu = new Menu();
                        this._section.createMenu(menu);
                        menu.createWithEvent(e);
                    }
                });
                this._titleArea.appendChild(this._menuIcon.getCanvas());

                this._formArea = document.createElement("div");
                this._formArea.classList.add("PropertyFormArea");
                this._section.create(this._formArea);

                this.getElement().appendChild(this._titleArea);
                this.getElement().appendChild(this._formArea);

                this.updateExpandIcon();

                let collapsed = this.getCollapsedStateInStorage();

                if (collapsed === undefined) {

                    this.setCollapsedStateInStorage(this._section.isCollapsedByDefault());

                    collapsed = this.getCollapsedStateInStorage();
                }

                if (collapsed === "true") {

                    this.toggleSection();
                }
            }
        }

        private getCollapsedStateInStorage() {

            return window.localStorage[this.getLocalStorageKey() + ".collapsed"];
        }

        private setCollapsedStateInStorage(collapsed: boolean) {

            return window.localStorage[this.getLocalStorageKey() + ".collapsed"] = collapsed ? "true" : "false";
        }

        private getLocalStorageKey() {

            return `colibri.ui.controls.properties.PropertySection[${this._section.getId()}]`;
        }


        isExpanded() {

            return this._expandIconControl.getCanvas().classList.contains("expanded");
        }

        private toggleSection(): void {

            if (this.isExpanded()) {

                this._formArea.style.display = "none";
                this._expandIconControl.getCanvas().classList.remove("expanded");

            } else {

                this._formArea.style.display = "grid";
                this._expandIconControl.getCanvas().classList.add("expanded");
            }

            this._page.updateExpandStatus();

            this.getContainer().dispatchLayoutEvent();

            this.updateExpandIcon();

            this.setCollapsedStateInStorage(!this.isExpanded());
        }

        updateTitle() {

            if (this._titleLabel) {

                this._titleLabel.innerHTML = this._section.getTitle();
            }
        }

        private updateExpandIcon() {

            const icon = this.isExpanded() ? colibri.ICON_CONTROL_SECTION_COLLAPSE : colibri.ICON_CONTROL_SECTION_EXPAND;

            const image = ColibriPlugin.getInstance().getIcon(icon);

            this._expandIconControl.setIcon(image);
        }

        getSection() {

            return this._section;
        }
    }
}