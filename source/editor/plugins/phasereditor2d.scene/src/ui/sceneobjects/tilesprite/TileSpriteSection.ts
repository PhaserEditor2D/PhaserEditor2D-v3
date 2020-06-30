namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TileSpriteSection extends SceneObjectSection<TileSprite> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TileSprite", "Tile Sprite", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/tile-sprite-object.html#tile-sprite-properties";
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, TileSpriteSizeTool.ID);

            menu.addSeparator();

            super.createMenu(menu);
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