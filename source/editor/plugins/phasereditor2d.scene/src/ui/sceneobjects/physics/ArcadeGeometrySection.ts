namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeGeometrySection extends SceneGameObjectSection<ArcadeObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ArcadeGeometrySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, ArcadeGeometrySection.ID, "Arcade Body Geometry");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyEnumRow(comp, ArcadeComponent.geometry, false).style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.offset);

            this.createSeparatorForXYGrid(comp, "Circle");

            {
                const row = this.createPropertyFloatRow(comp, ArcadeComponent.radius, false);
                row.style.gridColumn = "span 4";
                this.addUpdater(() => {

                    const isCircle = this.flatValues_BooleanAnd(
                        this.getSelection().map(obj => obj.body.isCircle));

                    row.disabled = row.disabled || !isCircle;
                });
            }

            this.createSeparatorForXYGrid(comp, "Rectangle");

            {
                const centerElement = this.createPropertyBoolean(comp, ArcadeComponent.center);
                centerElement.checkElement.style.gridColumn = "span 4";

                const elements = this.createPropertyXYRow(comp, ArcadeComponent.size, false);

                elements.push(centerElement.checkElement);

                this.addUpdater(() => {

                    const isCircle = this.flatValues_BooleanAnd(
                        this.getSelection().map(obj => ArcadeComponent.isCircleBody(obj)));

                    for (const elem of elements) {

                        elem.disabled = elem.disabled || isCircle;
                    }
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}