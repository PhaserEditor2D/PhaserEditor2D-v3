namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeBodyMovementSection extends SceneGameObjectSection<ArcadeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeBodyMovementSection", "Arcade Body Movement");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyXYRow(comp, ArcadeComponent.velocity);

            this.createPropertyBoolean(comp, ArcadeComponent.allowGravity).checkElement.style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.gravity);

            this.createPropertyXYRow(comp, ArcadeComponent.acceleration);

            this.createPropertyBoolean(comp, ArcadeComponent.useDamping).checkElement.style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.drag);

            this.createPropertyBoolean(comp, ArcadeComponent.allowRotation).checkElement.style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularVelocity).style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularAcceleration).style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularDrag).style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}