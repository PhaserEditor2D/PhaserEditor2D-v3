namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class EllipseHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.EllipseHitAreaSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, EllipseHitAreaSection.ID, "Hit Area (Ellipse)");
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, EditHitAreaTool.ID);

            super.createMenu(menu);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area-ellipse.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, EllipseHitAreaComponent.position, false);
            this.createPropertyXYRow(comp, EllipseHitAreaComponent.size, false);
        }

        canEdit(obj: any, n: number): boolean {

            return HitAreaComponent.hasHitAreaShape(obj, HitAreaShape.ELLIPSE);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}