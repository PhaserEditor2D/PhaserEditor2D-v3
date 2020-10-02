/// <reference path="../editor/properties/DocsSection.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectTypeDocSection extends editor.properties.DocsSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ObjectTypeDocSection");
        }

        getHelp() {

            return (this.getSelectionFirstElement() as SceneObjectExtension).getHelp();
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof SceneObjectExtension;
        }
    }
}