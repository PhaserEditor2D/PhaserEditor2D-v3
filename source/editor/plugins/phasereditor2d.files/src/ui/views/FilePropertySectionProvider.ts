namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;

    export class FilePropertySectionProvider extends controls.properties.PropertySectionProvider {

        addSections(
            page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            const exts = colibri.Platform
                .getExtensions<FilePropertySectionExtension>(FilePropertySectionExtension.POINT_ID);

            for (const ext of exts) {

                for (const provider of ext.getSectionProviders()) {

                    const section = provider(page);

                    if (this.acceptSection(section)) {

                        sections.push(section);
                    }
                }
            }

           this.sortSections(sections);
        }

        protected acceptSection(section: controls.properties.PropertySection<any>) {
            return true;
        }
    }
}