namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TileSpriteSection extends SceneGameObjectSection<TileSprite> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.TileSprite";

        constructor(page: controls.properties.PropertyPage) {
            super(page, TileSpriteSection.SECTION_ID, "Tile Sprite", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/tile-sprite-object.html#tile-sprite-properties";
        }

        createMenu(menu: controls.Menu) {

            this.createToolMenuItem(menu, SizeTool.ID);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

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