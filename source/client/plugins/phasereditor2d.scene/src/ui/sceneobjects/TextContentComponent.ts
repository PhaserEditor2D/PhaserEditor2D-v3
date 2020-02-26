namespace phasereditor2d.scene.ui.sceneobjects {

    export class TextContentComponent extends Component<ITextContentLikeObject> {

        static text = SimpleProperty("text", "", "Text", "The text content.");

        constructor(obj: ITextContentLikeObject) {
            super(obj, [TextContentComponent.text]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_StringProperty(args, TextContentComponent.text);
        }
    }
}