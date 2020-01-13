/// <reference path="../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./ObjectSceneSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TransformSection extends ObjectSceneSection<sceneobjects.ITransformLike> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "SceneEditor.TransformSection", "Transform", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";

            // Position

            {
                // this.createLock(comp);
                this.createLabel(comp, "Position").style.gridColumn = "2";

                // x

                {
                    this.createLabel(comp, "X");
                    this.createFloatField(comp, TransformComponent.x);
                }

                // y

                {
                    this.createLabel(comp, "Y");
                    this.createFloatField(comp, TransformComponent.y);
                }
            }

            // Scale

            {
                this.createLock(comp, TransformComponent.scaleX, TransformComponent.scaleY);
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
                this.createLock(comp, TransformComponent.angle);
                this.createLabel(comp, "Angle").style.gridColumn = "2 / span 2";
                this.createFloatField(comp, TransformComponent.angle);
                this.createLabel(comp, "").style.gridColumn = "4 / span 2";
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