namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TintSingleSection extends SceneGameObjectSection<IOriginLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TintSingleSection", "Tint", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/tint-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createPropertyBoolean(comp, TintSingleComponent.tintFill);

            this.createPropertyColorRow(comp, TintSingleComponent.tint, false);
        }


        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, TintSingleComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}