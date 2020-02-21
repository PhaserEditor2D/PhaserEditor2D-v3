namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;

    export class FilePropertySectionProvider extends controls.properties.PropertySectionProvider {

        addSections(
            page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            const exts = colibri.Platform
                .getExtensions<FilePropertySectionExtension>(FilePropertySectionExtension.POINT_ID);

            for (const ext of exts) {

                for (const provider of ext.getSectionProviders()) {

                    sections.push(provider(page));
                }
            }

            sections.sort((a, b) => {

                const aa = a.isFillSpace() ? 1 : 0;
                const bb = b.isFillSpace() ? 1 : 0;

                return aa - bb;
            });
        }
    }
}