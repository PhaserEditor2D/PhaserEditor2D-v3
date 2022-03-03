namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TintSection extends SceneGameObjectSection<IOriginLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TintSection", "Tint", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/tint-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createPropertyBoolean(comp, TintComponent.tintFill);

            this.createPropertyColorRow(comp, TintComponent.tintTopLeft, false);

            this.createPropertyColorRow(comp, TintComponent.tintTopRight, false);

            this.createPropertyColorRow(comp, TintComponent.tintBottomLeft, false);

            this.createPropertyColorRow(comp, TintComponent.tintBottomRight, false);
        }


        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, TintComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}