namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class AssetPackEditorPropertyProvider extends controls.properties.PropertySectionProvider {

        constructor(private editor: AssetPackEditor) {
            super("phasereditor2d.pack.ui.editor.properties.AssetPackEditorPropertyProvider");
        }

        addSections(page: controls.properties.PropertyPage,
            sections: Array<controls.properties.PropertySection<any>>): void {

            const list = AssetPackPlugin.getInstance().getExtensions()
                .flatMap(ext => ext.createEditorPropertySections(page));

            sections.push(...list);

            this.sortSections(sections);
        }

        getEmptySelectionObject() {

            return this.editor.getPack();
        }

    }
}