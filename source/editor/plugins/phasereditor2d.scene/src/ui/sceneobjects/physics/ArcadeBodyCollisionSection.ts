namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeBodyCollisionSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeCollideSection", "Arcade Physics Body Collision");
        }

        protected getSectionHelpPath() {

            return "scene-editor/arcade-physics-properties.html#arcade-physics-body-collision-section";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyBoolean(comp, ArcadeComponent.pushable).checkElement.style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.immovable).checkElement.style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.mass).style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.bounce);

            this.createPropertyXYRow(comp, ArcadeComponent.friction);

            this.createPropertyXYRow(comp, ArcadeComponent.overlap);

            this.createPropertyFloatRow(comp, ArcadeComponent.overlapR).style.gridColumn = "span 4";

            for (const collisionProp of [
                ArcadeComponent.collideWorldBounds,
                ArcadeComponent.onWorldBounds,
                ArcadeComponent.checkCollisionNone,
                ArcadeComponent.checkCollisionUp,
                ArcadeComponent.checkCollisionDown,
                ArcadeComponent.checkCollisionLeft,
                ArcadeComponent.checkCollisionRight,
            ]) {

                this.createPropertyBoolean(comp, collisionProp).checkElement.style.gridColumn = "span 4";
            }
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}