namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeBodyMovementSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeBodyMovementSection", "Arcade Physics Body Movement");
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/arcade-physics-properties.html#arcade-physics-body-movement-section";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyBoolean(comp, ArcadeComponent.moves).checkElement.style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.velocity);

            this.createPropertyXYRow(comp, ArcadeComponent.maxVelocity);

            this.createPropertyFloatRow(comp, ArcadeComponent.maxSpeed).style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.allowGravity).checkElement.style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.gravity);

            this.createPropertyXYRow(comp, ArcadeComponent.acceleration);

            this.createPropertyBoolean(comp, ArcadeComponent.useDamping).checkElement.style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.allowDrag).checkElement.style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.drag);

            this.createPropertyBoolean(comp, ArcadeComponent.allowRotation).checkElement.style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularVelocity).style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularAcceleration).style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.angularDrag).style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.maxAngular).style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}