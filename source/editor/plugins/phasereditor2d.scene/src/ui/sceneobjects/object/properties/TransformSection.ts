/// <reference path="../../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./SceneObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TransformSection extends SceneObjectSection<sceneobjects.ITransformLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TransformSection", "Transform", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, TransformComponent.position, false);

            this.createPropertyXYRow(comp, TransformComponent.scale);

            this.createNumberPropertyRow(comp, TransformComponent.angle, false);
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TransformComponent) !== null && n > 0;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}