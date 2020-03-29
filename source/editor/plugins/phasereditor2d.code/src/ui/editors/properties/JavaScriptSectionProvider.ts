namespace phasereditor2d.code.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class JavaScriptSectionProvider extends controls.properties.PropertySectionProvider {

        addSections(
            page: controls.properties.PropertyPage,
            sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(new DocumentationSection(page));

            new pack.ui.properties.AssetPackPreviewPropertyProvider()
                .addSections(page, sections);
        }
    }
}