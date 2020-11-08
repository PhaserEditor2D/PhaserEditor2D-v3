namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IAlphaSingleLikeObject extends ISceneGameObject {

        alpha: number;
    }

    export class AlphaSingleComponent extends Component<IAlphaSingleLikeObject> {

        static alpha = SimpleProperty("alpha", 1, "Alpha", "phaser:Phaser.GameObjects.Components.Alpha.alpha");

        constructor(obj: IAlphaSingleLikeObject) {
            super(obj, [
                AlphaSingleComponent.alpha,
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, AlphaSingleComponent.alpha);
        }
    }
}