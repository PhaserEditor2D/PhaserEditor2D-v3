namespace colibri.ui.controls.properties {

    export abstract class PropertySectionProvider {
        
        abstract addSections(page : PropertyPage, sections : PropertySection<any>[]) : void;
    }
}