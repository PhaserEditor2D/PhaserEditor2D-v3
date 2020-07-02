namespace phasereditor2d.scene.ui.sceneobjects {

    export class VisibleSection extends SceneObjectSection<sceneobjects.IVisibleLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.VisibleSection", "Visible", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/visible-property.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createBooleanProperty(comp, VisibleComponent.visible);
        }

        canEdit(obj: any, n: number): boolean {

            return EditorSupport.getObjectComponent(obj, VisibleComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}