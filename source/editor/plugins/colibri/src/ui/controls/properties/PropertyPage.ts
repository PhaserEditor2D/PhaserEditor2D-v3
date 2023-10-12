namespace colibri.ui.controls.properties {

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

                        if (section.getTypeHash()) {

                            this.removePanesWithSameTypeHash(section.getTypeHash());
                        }
                        
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

        private removePanesWithSameTypeHash(typeHash: string) {

            for (const pane of this._sectionPanes) {

                const section = pane.getSection();

                if (section.getTypeHash() === typeHash) {

                    this.remove(pane);
                }
            }

            this._sectionPanes = this._sectionPanes
                .filter(pane => pane.getSection().getTypeHash() !== typeHash);
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

                    if (section.isDynamicTitle()) {

                        pane.updateTitle();
                    }

                } else {

                    section.onSectionHidden();

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