namespace phasereditor2d.scene.ui.editor.scripts {

    import controls = colibri.ui.controls;

    export class ObjectScriptEditorPropertySectionProvider extends controls.properties.PropertySectionProvider {

        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(new ObjectScriptPropertiesSection(page));
        }
    }
}