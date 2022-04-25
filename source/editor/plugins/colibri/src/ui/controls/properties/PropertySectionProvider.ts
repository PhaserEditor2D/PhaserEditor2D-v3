namespace colibri.ui.controls.properties {

    export abstract class PropertySectionProvider {

        private _id: string;

        constructor(id?: string) {

            this._id = id;
        }

        abstract addSections(page: PropertyPage, sections: Array<PropertySection<any>>): void;

        getEmptySelectionObject() {

            return null;
        }

        getEmptySelectionArray() {

            return null;
        }
    }
}