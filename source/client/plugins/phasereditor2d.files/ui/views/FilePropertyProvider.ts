namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;

    export class FilePropertySectionProvider extends controls.properties.PropertySectionProvider {

        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void {

            sections.push(new FileSection(page));

            sections.push(new ImageFileSection(page));

            sections.push(new ManyImageFileSection(page));

            sections.push(new UploadSection(page));
        }
    }
}