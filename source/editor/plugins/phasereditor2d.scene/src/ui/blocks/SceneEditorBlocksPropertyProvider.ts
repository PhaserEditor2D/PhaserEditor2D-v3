
namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;

    export class SceneEditorBlocksPropertyProvider extends pack.ui.properties.AssetPackPreviewPropertyProvider {

        addSections(
            page: controls.properties.PropertyPage,
            sections: Array<controls.properties.PropertySection<any>>): void {

            super.addSections(page, sections);

            sections.push(
                new sceneobjects.ObjectTypeDocSection(page),
                new sceneobjects.ObjectListDocSection(page)
            );
        }
    }
}