namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteComponent extends Component<TileSprite> {

        static tilePositionX = SimpleProperty("tilePositionX", 0, "X", "phaser:Phaser.GameObjects.TileSprite.tilePositionX", false, null, 1);
        static tilePositionY = SimpleProperty("tilePositionY", 0, "Y", "phaser:Phaser.GameObjects.TileSprite.tilePositionY", false, null, 1);
        static tileScaleX = SimpleProperty("tileScaleX", 1, "X", "Phaser.GameObjects.TileSprite.tileScaleX", false, null, 0.05, 0.01);
        static tileScaleY = SimpleProperty("tileScaleY", 1, "Y", "Phaser.GameObjects.TileSprite.tileScaleY", false, null, 0.05, 0.01);

        static tilePosition: IPropertyXY = {
            label: "Tile Position",
            tooltip: "phaser:Phaser.GameObjects.TileSprite.setTilePosition",
            x: TileSpriteComponent.tilePositionX,
            y: TileSpriteComponent.tilePositionY
        };

        static tileScale: IPropertyXY = {
            label: "Tile Scale",
            tooltip: "phaser:Phaser.GameObjects.TileSprite.setTileScale",
            x: TileSpriteComponent.tileScaleX,
            y: TileSpriteComponent.tileScaleY
        };

        constructor(obj: TileSprite) {
            super(obj, [
                TileSpriteComponent.tilePositionX,
                TileSpriteComponent.tilePositionY,
                TileSpriteComponent.tileScaleX,
                TileSpriteComponent.tileScaleY
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args,
                TileSpriteComponent.tilePositionX,
                TileSpriteComponent.tilePositionY,
                TileSpriteComponent.tileScaleX,
                TileSpriteComponent.tileScaleY
            );
        }
    }
}