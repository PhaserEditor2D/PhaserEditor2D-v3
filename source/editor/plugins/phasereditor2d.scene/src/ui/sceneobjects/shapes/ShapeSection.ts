namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ShapeSection extends SceneGameObjectSection<IShapeGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ShapeSection", "Shape", false, false);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/shape-object.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr auto";

            this.createPropertyBoolean(comp, ShapeComponent.isFilled)
                .checkElement.style.gridColumn = "3 / span 2";

            this.createPropertyColorRow(comp, ShapeComponent.fillColor, false)
                .element.style.gridColumn = "3 / span 2";

            this.createPropertyFloatRow(comp, ShapeComponent.fillAlpha)
                .style.gridColumn = "3 / span 2";

            this.createPropertyBoolean(comp, ShapeComponent.isStroked)
                .checkElement.style.gridColumn = "3 / span 2";

            this.createPropertyColorRow(comp, ShapeComponent.strokeColor, false)
                .element.style.gridColumn = "3 / span 2";

            this.createPropertyFloatRow(comp, ShapeComponent.strokeAlpha)
                .style.gridColumn = "3 / span 2";

            this.createPropertyFloatRow(comp, ShapeComponent.lineWidth)
                .style.gridColumn = "3 / span 2";
        }

        canEdit(obj: any, n: number): boolean {

            return ShapeEditorSupport.isShape(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }

    }
}