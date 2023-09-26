namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class CircleHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.CircleHitAreaSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, CircleHitAreaSection.ID, "Hit Area (Circle)");
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, EditHitAreaTool.ID);

            super.createMenu(menu);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area-circle.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, CircleHitAreaComponent.position, false);

            this.createPropertyFloatRow(comp, CircleHitAreaComponent.radius, false)
                .style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return HitAreaComponent.hasHitAreaShape(obj, HitAreaShape.CIRCLE);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}