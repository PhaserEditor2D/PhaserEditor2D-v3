namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeBodyCollisionSection extends SceneGameObjectSection<ArcadeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ArcadeCollideSection", "Arcade Body Collision");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyBoolean(comp, ArcadeComponent.pushable).checkElement.style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.immovable).checkElement.style.gridColumn = "span 4";

            this.createPropertyBoolean(comp, ArcadeComponent.collideWorldBounds).checkElement.style.gridColumn = "span 4";

            this.createPropertyFloatRow(comp, ArcadeComponent.mass).style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.bounce);

            this.createPropertyXYRow(comp, ArcadeComponent.friction);

            this.createPropertyXYRow(comp, ArcadeComponent.overlap);

            this.createPropertyFloatRow(comp, ArcadeComponent.overlapR).style.gridColumn = "span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}