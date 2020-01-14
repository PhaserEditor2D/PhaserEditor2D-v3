/// <reference path="../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./ObjectSceneSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TransformSection extends ObjectSceneSection<sceneobjects.ITransformLike> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "SceneEditor.TransformSection", "Transform", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, TransformComponent.position, false);

            this.createPropertyXYRow(comp, TransformComponent.scale);

            this.createNumberPropertyRow(comp, TransformComponent.angle, false);
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TransformComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}