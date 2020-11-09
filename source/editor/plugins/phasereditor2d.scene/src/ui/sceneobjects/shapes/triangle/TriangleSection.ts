namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TriangleSection extends SceneGameObjectSection<Triangle> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TriangleSection", "Triangle", false, true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, TriangleComponent.p1);
            this.createPropertyXYRow(comp, TriangleComponent.p2);
            this.createPropertyXYRow(comp, TriangleComponent.p3);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Triangle;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}