namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class RectangleHitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.RectangleHitAreaSection", "Hit Area (Rectangle)");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, RectangleHitAreaComponent.position, false);
            this.createPropertyXYRow(comp, RectangleHitAreaComponent.size, false);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, HitAreaComponent)
                && GameObjectEditorSupport.hasObjectComponent(obj, RectangleHitAreaComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}