namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseComponent extends Component<Ellipse> {

        static smoothness = SimpleProperty("smoothness", 64, "Smoothness", "Smoothness tip");


        constructor(obj: Ellipse) {
            super(obj, [
                EllipseComponent.smoothness
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, EllipseComponent.smoothness);
        }

    }
}