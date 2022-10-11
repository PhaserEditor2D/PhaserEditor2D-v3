/// <reference path="../object/properties/PlainObjectSection.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ColliderSection extends PlainObjectSection<Collider> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ColliderSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, ColliderSection.ID, "Collider", false, false);

        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createDefaultGridElement(parent);

            this.createPropertyBoolean(comp, ColliderComponent.overlapOnly);

            this.createPropertyObjectVar(comp, ColliderComponent.object1);

            this.createPropertyObjectVar(comp, ColliderComponent.object2);

            this.createPropertyString(comp, ColliderComponent.collideCallback);

            this.createPropertyString(comp, ColliderComponent.processCallback);

            this.createPropertyString(comp, ColliderComponent.callbackContext);

        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && obj instanceof Collider;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}