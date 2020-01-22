namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TileSpriteSection extends SceneObjectSection<TileSprite> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TileSprite", "Tile Sprite");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, TileSpriteComponent.size);

            this.createPropertyXYRow(comp, TileSpriteComponent.tilePosition);

            this.createPropertyXYRow(comp, TileSpriteComponent.tileScale);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof TileSprite && n > 0;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}