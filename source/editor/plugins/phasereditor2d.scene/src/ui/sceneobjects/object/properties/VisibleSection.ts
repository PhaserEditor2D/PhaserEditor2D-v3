namespace phasereditor2d.scene.ui.sceneobjects {

    export class VisibleSection extends SceneGameObjectSection<sceneobjects.IVisibleLikeObject> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.VisibleSection";

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, VisibleSection.SECTION_ID, "Visible", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/visible-property.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createPropertyBoolean(comp, VisibleComponent.visible);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, VisibleComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}