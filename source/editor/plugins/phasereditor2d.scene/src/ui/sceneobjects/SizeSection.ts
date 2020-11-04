/// <reference path="./object/properties/SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SizeSection extends SceneGameObjectSection<ISizeLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SizeSection", "Size", false, true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, SizeComponent.size);
        }

        canEdit(obj: any, n: number): boolean {

            if (GameObjectEditorSupport.hasEditorSupport(obj)) {

                const support = (obj as ISizeLikeObject).getEditorSupport();

                return support.hasComponent(SizeComponent);
            }

            return false;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}