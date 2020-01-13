/// <reference path="../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./ObjectSceneSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TransformSection extends ObjectSceneSection<sceneobjects.ITransformLike> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "SceneEditor.TransformSection", "Transform", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 5);

            // Position

            {
                this.createLabel(comp, "Position");

                // x

                {
                    this.createLabel(comp, "X");
                    this.createFloatField(comp, TransformComponent.x);
                }

                // x

                {
                    this.createLabel(comp, "Y");
                    this.createFloatField(comp, TransformComponent.y);
                }
            }

            // Scale

            {
                this.createLabel(comp, "Scale");

                // scaleX

                {
                    this.createLabel(comp, "X");
                    this.createFloatField(comp, TransformComponent.scaleX);
                }

                // scaleY

                {
                    this.createLabel(comp, "Y");
                    this.createFloatField(comp, TransformComponent.scaleY);
                }
            }

            // angle

            {
                this.createLabel(comp, "Angle").style.gridColumn = "1 / span 2";
                this.createFloatField(comp, TransformComponent.angle);
                this.createLabel(comp, "").style.gridColumn = "3 / span 2";
            }
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TransformComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}