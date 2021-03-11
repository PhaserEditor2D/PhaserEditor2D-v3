namespace colibri.ui.controls.properties {

    export abstract class PropertySectionProvider {

        private _selectedTabSection: string;
        private _id: string;

        constructor(id?: string) {

            this._id = id;

            if (this._id) {

                this._selectedTabSection = localStorage.getItem(this.localStorageKey("selectedTabSection"));
            }
        }

        abstract addSections(page: PropertyPage, sections: Array<PropertySection<any>>): void;

        getSelectedTabSection() {

            return this._selectedTabSection;
        }

        private localStorageKey(prop: string) {

            return `PropertySectionProvider[${this._id}].${prop}`;
        }

        setSelectedTabSection(tabSection: string) {

            this._selectedTabSection = tabSection;

            if (this._id) {

                if (tabSection) {

                    localStorage.setItem(this.localStorageKey("selectedTabSection"), tabSection);

                } else {

                    localStorage.removeItem(this.localStorageKey("selectedTabSection"));
                }
            }
        }

        getTabSections(): string[] {

            return [];
        }

        getEmptySelectionObject() {

            return null;
        }

        getEmptySelectionArray() {

            return null;
        }
    }
}