namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super();

            this._editor = editor;
        }

        getEmptySelectionObject() {

            return this._editor.getScene();
        }

        addSections(
            page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(
                new SnappingSection(page),
                new BorderSection(page),
                new CompilerSection(page),
                new SceneCompilerSection(page)
            );

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