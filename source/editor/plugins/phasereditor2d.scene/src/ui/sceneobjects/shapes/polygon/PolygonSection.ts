namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PolygonSection extends SceneGameObjectSection<Triangle> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.PolygonSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, PolygonSection.SECTION_ID, "Polygon", false, true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyStringDialogRow(comp, PolygonComponent.points);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Polygon;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}