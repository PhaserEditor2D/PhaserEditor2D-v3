namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteComponent extends Component<TileSprite> {

        static width = SimpleProperty("width", undefined, "Width");
        static height = SimpleProperty("height", undefined, "Height");
        static tilePositionX = SimpleProperty("tilePositionX", 0, "X");
        static tilePositionY = SimpleProperty("tilePositionY", 0, "Y");
        static tileScaleX = SimpleProperty("tileScaleX", 1, "X");
        static tileScaleY = SimpleProperty("tileScaleY", 1, "Y");

        static size: IPropertyXY = {
            label: "Size",
            x: TileSpriteComponent.width,
            y: TileSpriteComponent.height
        };

        static tilePosition: IPropertyXY = {
            label: "Tile Position",
            x: TileSpriteComponent.tilePositionX,
            y: TileSpriteComponent.tilePositionY
        };

        static tileScale: IPropertyXY = {
            label: "Tile Scale",
            x: TileSpriteComponent.tileScaleX,
            y: TileSpriteComponent.tileScaleY
        };

        constructor(obj: TileSprite) {
            super(obj, [
                TileSpriteComponent.width,
                TileSpriteComponent.height,
                TileSpriteComponent.tilePositionX,
                TileSpriteComponent.tilePositionY,
                TileSpriteComponent.tileScaleX,
                TileSpriteComponent.tileScaleY
            ]);
        }

        adjustAfterTypeChange(originalObject: ISceneObject) {

            const obj = this.getObject();
            const sprite = originalObject as unknown as Phaser.GameObjects.Image;

            obj.setSize(
                obj.width === undefined ? sprite.width : obj.width,
                obj.height === undefined ? sprite.width : obj.height
            );
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