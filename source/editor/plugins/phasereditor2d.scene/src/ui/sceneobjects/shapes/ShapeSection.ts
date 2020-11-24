namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ShapeSection extends SceneGameObjectSection<IShapeGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ShapeSection", "Shape", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr auto";

            this.createPropertyBoolean(comp, ShapeComponent.isFilled)
                .checkElement.style.gridColumn = "3 / span 2";

            this.createPropertyColorRow(comp, ShapeComponent.fillColor, false);

            this.createPropertyFloatRow(comp, ShapeComponent.fillAlpha);

            this.createPropertyBoolean(comp, ShapeComponent.isStroked)
                .checkElement.style.gridColumn = "3 / span 2";

            this.createPropertyColorRow(comp, ShapeComponent.strokeColor, false);

            this.createPropertyFloatRow(comp, ShapeComponent.strokeAlpha);

            this.createPropertyFloatRow(comp, ShapeComponent.lineWidth);
        }

        canEdit(obj: any, n: number): boolean {

            return ShapeEditorSupport.isShape(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }

    }
}