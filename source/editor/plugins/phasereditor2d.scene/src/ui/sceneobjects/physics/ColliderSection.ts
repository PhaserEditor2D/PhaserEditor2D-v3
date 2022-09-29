/// <reference path="../../editor/properties/PlainObjectSection.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ColliderSection extends editor.properties.PlainObjectSection<Collider> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ColliderSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, ColliderSection.ID, "Collider", false, false);

        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createPropertyString(comp, ColliderComponent.object1);

            this.createPropertyString(comp, ColliderComponent.object2);
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && obj instanceof Collider;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}