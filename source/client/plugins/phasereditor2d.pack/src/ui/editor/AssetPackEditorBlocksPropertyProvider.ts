namespace phasereditor2d.pack.ui.editor {

    import controls = colibri.ui.controls;

    export class AssetPackEditorBlocksPropertySectionProvider extends files.ui.views.FilePropertySectionProvider {

        addSections(
            page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(new ImportFileSection(page));

            super.addSections(page, sections);
        }

        protected acceptSection(section: controls.properties.PropertySection<any>) {

            return !(section instanceof ui.properties.AddFileToPackFileSection);
        }
    }
}