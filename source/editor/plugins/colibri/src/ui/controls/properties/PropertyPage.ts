namespace colibri.ui.controls.properties {

    class PropertySectionPane extends Control {

        private _section: PropertySection<any>;
        private _titleArea: HTMLDivElement;
        private _formArea: HTMLDivElement;
        private _page: PropertyPage;
        private _menuIcon: IconControl;
        private _expandIconControl: IconControl;

        constructor(page: PropertyPage, section: PropertySection<any>) {
            super();

            this._page = page;

            this._section = section;

            this.addClass("PropertySectionPane");
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

                const label = document.createElement("label");
                label.innerText = this._section.getTitle();
                this._titleArea.appendChild(label);

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

        private updateExpandIcon() {

            const icon = this.isExpanded() ? colibri.ICON_CONTROL_SECTION_COLLAPSE : colibri.ICON_CONTROL_SECTION_EXPAND;

            const image = ColibriPlugin.getInstance().getIcon(icon);

            this._expandIconControl.setIcon(image);
        }

        getSection() {
            return this._section;
        }

        getFormArea() {
            return this._formArea;
        }
    }

    export class PropertyPage extends Control {
        private _sectionProvider: PropertySectionProvider;
        private _sectionPanes: PropertySectionPane[];
        private _sectionPaneMap: Map<string, PropertySectionPane>;
        private _selection: any[];

        constructor() {
            super("div");

            this.addClass("PropertyPage");

            this._sectionPanes = [];
            this._sectionPaneMap = new Map();
            this._selection = [];
        }

        getSections() {

            return this._sectionPanes.map(pane => pane.getSection());
        }

        getSection(sectionId: string) {

            return this.getSections().find(section => section.getId() === sectionId);
        }

        private build() {

            if (this._sectionProvider) {

                const list: Array<PropertySection<any>> = [];

                this._sectionProvider.addSections(this, list);

                for (const section of list) {

                    if (!this._sectionPaneMap.has(section.getId())) {

                        const pane = new PropertySectionPane(this, section);

                        this.add(pane);

                        this._sectionPaneMap.set(section.getId(), pane);

                        this._sectionPanes.push(pane);
                    }
                }

                const sectionIdList = list.map(section => section.getId());

                for (const pane of this._sectionPanes) {
                    const index = sectionIdList.indexOf(pane.getSection().getId());
                    pane.getElement().style.order = index.toString();
                }

                this.updateWithSelection();

            } else {

                for (const pane of this._sectionPanes) {
                    
                    pane.getElement().style.display = "none";
                }
            }
        }

        public updateWithSelection(): void {

            if (!this._sectionProvider) {

                return;
            }

            const list: Array<PropertySection<any>> = [];

            this._sectionProvider.addSections(this, list);

            const sectionIdSet = new Set<string>();

            for (const section of list) {

                sectionIdSet.add(section.getId());
            }

            let n = this._selection.length;

            let selection = this._selection;

            if (n === 0) {

                const obj = this._sectionProvider.getEmptySelectionObject();

                if (obj) {

                    selection = [obj];
                    n = 1;

                } else {

                    const array = this._sectionProvider.getEmptySelectionArray();

                    if (array) {

                        selection = array;
                        n = selection.length;
                    }
                }
            }

            this._selection = selection;

            for (const pane of this._sectionPanes) {

                const section = pane.getSection();

                let show = section.canEditNumber(n);

                if (show) {

                    for (const obj of selection) {

                        if (!section.canEdit(obj, n)) {

                            show = false;
                            break;
                        }
                    }

                    if (show && !section.canEditAll(selection)) {

                        show = false;
                    }
                }

                show = show && sectionIdSet.has(section.getId());

                if (show) {

                    pane.getElement().style.display = "grid";
                    pane.createSection();
                    section.updateWithSelection();

                } else {

                    pane.getElement().style.display = "none";
                }
            }

            this.updateExpandStatus();
        }

        updateExpandStatus() {

            const list: Array<PropertySection<any>> = [];

            this._sectionProvider.addSections(this, list);

            const sectionIdList = list.map(section => section.getId());

            const sortedPanes = this._sectionPanes
                .map(p => p)
                .sort((a, b) =>
                    sectionIdList.indexOf(a.getSection().getId()) - sectionIdList.indexOf(b.getSection().getId())
                );

            let templateRows = "";

            for (const pane of sortedPanes) {

                if (pane.style.display !== "none") {

                    pane.createSection();

                    if (pane.isExpanded()) {

                        templateRows += " " + (pane.getSection().isFillSpace() ? "1fr" : "min-content");

                    } else {

                        templateRows += " min-content";
                    }
                }

            }

            this.getElement().style.gridTemplateRows = templateRows + " ";
        }

        getSelection() {

            return this._selection;
        }

        setSelection(sel: any[], update = true): any {

            this._selection = sel;

            if (update) {

                this.updateWithSelection();
            }
        }

        setSectionProvider(provider: PropertySectionProvider): void {

            this._sectionProvider = provider;

            this.build();
        }

        getSectionProvider() {
            return this._sectionProvider;
        }
    }

}