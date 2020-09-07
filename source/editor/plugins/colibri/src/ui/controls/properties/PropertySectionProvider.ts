namespace colibri.ui.controls.properties {

    export abstract class PropertySectionProvider {

        abstract addSections(page: PropertyPage, sections: Array<PropertySection<any>>): void;

        getEmptySelectionObject() {

            return null;
        }

        getEmptySelectionArray() {

            return null;
        }
    }
}