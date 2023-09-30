namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PolygonHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.PolygonHitAreaSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, PolygonHitAreaSection.ID, "Hit Area (Polygon)");
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, EditHitAreaTool.ID);

            super.createMenu(menu);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyStringDialogRow(comp, PolygonHitAreaComponent.points, false);
        }

        canEdit(obj: any, n: number): boolean {

            return HitAreaComponent.hasHitAreaShape(obj, HitAreaShape.POLYGON);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}