namespace phasereditor2d.scene.ui.sceneobjects {

    export class TextContentComponent extends Component<ITextContentLikeObject> {

        static text = SimpleProperty("text", "", "Text");

        constructor(obj: ITextContentLikeObject) {
            super(obj, [TextContentComponent.text]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}