namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IFlipLikeObject extends ISceneGameObject {

        flipX: boolean;
        flipY: boolean;
    }

    export class FlipComponent extends Component<IFlipLikeObject> {

        static flipX = SimpleProperty("flipX", false, "Flip X", "phaser:Phaser.GameObjects.Components.Flip.flipX");
        static flipY = SimpleProperty("flipY", false, "Flip Y", "phaser:Phaser.GameObjects.Components.Flip.flipY");

        constructor(obj: IFlipLikeObject) {
            super(obj, [FlipComponent.flipX, FlipComponent.flipY]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...this.getProperties());
        }
    }
}