namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IFlipLikeObject extends ISceneObject {

        flipX: boolean;
        flipY: boolean;
    }

    export class FlipComponent extends Component<IFlipLikeObject> {

        static flipX = SimpleProperty("flipX", false, "Flip X");
        static flipY = SimpleProperty("flipY", false, "Flip Y");

        constructor(obj: IFlipLikeObject) {
            super(obj, [FlipComponent.flipX, FlipComponent.flipY]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...this.getProperties());
        }
    }
}