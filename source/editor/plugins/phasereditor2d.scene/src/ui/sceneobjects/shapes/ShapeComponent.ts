namespace phasereditor2d.scene.ui.sceneobjects {

    export class ShapeComponent extends Component<IShapeGameObject> {

        static fillColor = NumberColorProperty("fillColor", "#fff", "Fill Color", "phaser:Phaser.GameObjects.Shape.fillColor");
        static isFilled = SimpleProperty("isFilled", false, "Is Filled", "phaser:Phaser.GameObjects.Shape.isFilled");
        static fillAlpha = SimpleProperty("fillAlpha", 1, "Fill Alpha", "phaser:Phaser.GameObjects.Shape.fillAlpha", false, undefined, 0.01, 0, 1);
        static isStroked = SimpleProperty("isStroked", false, "Is Stroked", "phaser:Phaser.GameObjects.Shape.isStroked");
        static strokeColor = NumberColorProperty("strokeColor", "#fff", "Stroke Color", "phaser:Phaser.GameObjects.Shape.strokeColor");
        static strokeAlpha = SimpleProperty("strokeAlpha", 1, "Stroke Alpha", "phaser:Phaser.GameObjects.Shape.strokeAlpha", false, undefined, 0.01, 0, 1);
        static lineWidth = SimpleProperty("lineWidth", 1, "Line Width", "phaser:Phaser.GameObjects.Shape.lineWidth", false, undefined, 0.05, 0);

        constructor(obj: IShapeGameObject) {
            super(obj, [
                ShapeComponent.isFilled,
                ShapeComponent.fillColor,
                ShapeComponent.fillAlpha,
                ShapeComponent.strokeColor,
                ShapeComponent.strokeAlpha,
                ShapeComponent.lineWidth,
                ShapeComponent.isStroked
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ShapeComponent.isFilled);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, NumberColorPropertyCodeDomAdapter2(ShapeComponent.fillColor));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.fillAlpha);

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ShapeComponent.isStroked);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, NumberColorPropertyCodeDomAdapter2(ShapeComponent.strokeColor));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.strokeAlpha);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.lineWidth);
        }
    }
}