namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentsEditorPropertySectionProvider extends controls.properties.PropertySectionProvider {

        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(new UserComponentPropertiesSection(page));
        }
    }
}