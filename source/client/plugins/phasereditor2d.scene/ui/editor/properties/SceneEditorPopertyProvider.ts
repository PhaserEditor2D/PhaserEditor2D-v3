namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {

        addSections(
            page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            const exts = colibri.Platform
                .getExtensions<SceneEditorPropertySectionExtension>(SceneEditorPropertySectionExtension.POINT_ID);

            for (const ext of exts) {

                for (const provider of ext.getSectionProviders()) {
                    sections.push(provider(page));
                }
            }
        }
    }
}