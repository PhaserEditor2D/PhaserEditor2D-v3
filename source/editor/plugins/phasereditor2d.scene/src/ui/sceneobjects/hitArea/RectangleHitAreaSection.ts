namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class RectangleHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.RectangleHitAreaSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, RectangleHitAreaSection.ID, "Hit Area (Rectangle)");
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, EditHitAreaTool.ID);

            super.createMenu(menu);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area-rectangle.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, RectangleHitAreaComponent.position, false);
            this.createPropertyXYRow(comp, RectangleHitAreaComponent.size, false);
        }

        canEdit(obj: any, n: number): boolean {

            return HitAreaComponent.hasHitAreaShape(obj, HitAreaShape.RECTANGLE);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}