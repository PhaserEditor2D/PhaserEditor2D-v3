namespace phasereditor2d.scene.ui.sceneobjects {

    export class ShapeComponent extends Component<IShapeGameObject> {

        static fillColor = NumberColorProperty("fillColor", "#fff", "Fill Color", "Fill color");
        static isFilled = SimpleProperty("isFilled", false, "Is Filled", "Is filled");
        static fillAlpha = SimpleProperty("fillAlpha", 1, "Fill Alpha", "Fill alpha");
        static strokeColor = NumberColorProperty("strokeColor", "#fff", "Stroke Color", "Stroke color");
        static strokeAlpha = SimpleProperty("strokeAlpha", 1, "Stroke Alpha", "Stroke alpha");
        static lineWidth = SimpleProperty("lineWidth", 1, "Line Width", "Line width");
        static isStroked = SimpleProperty("isStroked", false, "Is Stroke", "Is stroke");

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
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, NumberColorPropertyCodeDomAdapter(ShapeComponent.fillColor));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.fillAlpha);

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ShapeComponent.isStroked);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, NumberColorPropertyCodeDomAdapter(ShapeComponent.strokeColor));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.strokeAlpha);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ShapeComponent.lineWidth);
        }
    }
}