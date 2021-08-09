/// <reference path="./object/properties/SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ChildrenSection extends SceneGameObjectSection<Container> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ChildrenSection", "Children", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/container-object.html#container-properties";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createBooleanField(comp, ChildrenComponent.allowPickChildren, false);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, ChildrenComponent);
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}