/// <reference path="../../editor/properties/BaseSceneSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class TransformSection extends editor.properties.BaseSceneSection<sceneobjects.ITransformLike> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "SceneEditor.TransformSection", "Transform", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 5);

            // Position

            {
                this.createLabel(comp, "Position");

                // X

                {
                    this.createLabel(comp, "X");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.x));
                    });
                }

                // y

                {
                    this.createLabel(comp, "Y");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.y));
                    });
                }
            }

            // Scale

            {
                this.createLabel(comp, "Scale");

                // X

                {
                    this.createLabel(comp, "X");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleX));
                    });
                }

                // y

                {
                    this.createLabel(comp, "Y");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleY));
                    });
                }
            }

            // Angle

            {
                this.createLabel(comp, "Angle").style.gridColumnStart = "span 2";

                const text = this.createText(comp);
                this.addUpdater(() => {
                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.angle));
                });

                this.createLabel(comp, "").style.gridColumnStart = "span 2";
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