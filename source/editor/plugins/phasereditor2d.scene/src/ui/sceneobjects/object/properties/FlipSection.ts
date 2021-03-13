/// <reference path="./SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class FlipSection extends SceneGameObjectSection<IOriginLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.FlipSection", "Flip", false, true,
                editor.properties.TAB_SECTION_DETAILS);
        }

        getSectionHelpPath() {

            return "scene-editor/flip-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto auto auto auto";

            this.createLock(comp, FlipComponent.flipX, FlipComponent.flipY);

            this.createBooleanField(comp, FlipComponent.flipX);

            this.createBooleanField(comp, FlipComponent.flipY);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.getObjectComponent(obj, FlipComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}