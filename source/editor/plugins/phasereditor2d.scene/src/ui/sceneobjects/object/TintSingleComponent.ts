namespace phasereditor2d.scene.ui.sceneobjects {

    export class TintSingleComponent extends Component<ISceneGameObject> {

        static tintFill = SimpleProperty("tintFill", false, "Tint Fill", "Fill the tint?");
        static tint = TintProperty("tint", "Tint", "The tint.");

        constructor(obj: ISceneGameObject) {
            super(obj, [
                TintSingleComponent.tintFill,
                TintSingleComponent.tint,
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, TintSingleComponent.tintFill);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintSingleComponent.tint);
        }
    }
}