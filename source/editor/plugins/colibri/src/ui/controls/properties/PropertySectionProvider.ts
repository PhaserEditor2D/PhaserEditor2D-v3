namespace colibri.ui.controls.properties {

    export abstract class PropertySectionProvider {

        private _id: string;

        constructor(id?: string) {

            this._id = id;
        }

        abstract addSections(page: PropertyPage, sections: Array<PropertySection<any>>): void;

        sortSections(sections: controls.properties.PropertySection<any>[]) {

            sections.sort((a, b) => {

                const aa = a.isFillSpace() ? 1 : 0;
                const bb = b.isFillSpace() ? 1 : 0;

                return aa - bb;
            });
        }

        getEmptySelectionObject() {

            return null;
        }

        getEmptySelectionArray() {

            return null;
        }
    }
}