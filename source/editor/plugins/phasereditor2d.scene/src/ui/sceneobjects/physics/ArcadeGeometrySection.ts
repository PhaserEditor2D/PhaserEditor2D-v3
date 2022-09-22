namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeGeometrySection extends SceneGameObjectSection<ArcadeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeGeometrySection", "Arcade Body Geometry");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyEnumRow(comp, ArcadeComponent.geometry, false).style.gridColumn = "span 4";

            {
                const row = this.createPropertyFloatRow(comp, ArcadeComponent.radius, false);
                row.style.gridColumn = "span 4";
                this.addUpdater(() => {

                    const isCircle = this.flatValues_BooleanAnd(
                        this.getSelection().map(obj => obj.body.isCircle));

                    row.disabled = row.disabled || !isCircle;
                });
            }

            {
                const elements = this.createPropertyXYRow(comp, ArcadeComponent.size, false);

                this.addUpdater(() => {

                    const isCircle = this.flatValues_BooleanAnd(
                        this.getSelection().map(obj => ArcadeComponent.isCircleBody(obj)));

                    for (const elem of elements) {

                        elem.disabled = elem.disabled || isCircle;
                    }
                });
            }

            this.createPropertyXYRow(comp, ArcadeComponent.offset);
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}