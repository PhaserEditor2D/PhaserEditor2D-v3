namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {

        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void {

            sections.push(new VariableSection(page));

            sections.push(new TransformSection(page));

            sections.push(new OriginSection(page));

            sections.push(new TextureSection(page));
        }
    }
}