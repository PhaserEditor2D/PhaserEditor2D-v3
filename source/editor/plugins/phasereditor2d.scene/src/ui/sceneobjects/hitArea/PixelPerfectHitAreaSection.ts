namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PixelPerfectHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.PixelPerfectHitAreaSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, PixelPerfectHitAreaSection.ID, "Hit Area (Pixel Perfect)");
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, EditHitAreaTool.ID);

            super.createMenu(menu);
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/input-hit-area-pixel-perfect.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyFloatRow(comp, PixelPerfectHitAreaComponent.alphaTolerance, false);
        }

        canEdit(obj: any, n: number): boolean {

            return HitAreaComponent.hasHitAreaShape(obj, HitAreaShape.PIXEL_PERFECT);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}