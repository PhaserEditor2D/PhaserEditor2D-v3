namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapTextComponent extends Component<BitmapText> {

        static font: IProperty<BitmapText> = {
            name: "font",
            label: "Font",
            defValue: undefined,
            getValue: obj => obj.font,
            setValue: (obj, value) => obj.setFont(value)
        };

        constructor(obj: BitmapText) {
            super(obj, [
                BitmapTextComponent.font
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}