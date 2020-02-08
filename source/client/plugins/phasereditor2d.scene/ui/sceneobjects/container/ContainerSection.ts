/// <reference path="../object/properties/SceneObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ContainerSection extends SceneObjectSection<Container> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ContainerSection", "Container", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createBooleanField(comp, ContainerComponent.allowPickChildren, false);
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof Container;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}