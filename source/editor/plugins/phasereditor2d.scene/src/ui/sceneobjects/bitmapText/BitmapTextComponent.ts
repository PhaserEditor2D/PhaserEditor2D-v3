namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapTextComponent extends Component<BitmapText> {

        static font: IProperty<BitmapText> = {
            name: "font",
            label: "Font",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.setFont",
            defValue: undefined,
            getValue: obj => obj.font,
            setValue: (obj, value) => obj.setFont(value)
        };

        static align: IEnumProperty<BitmapText, number> = {
            name: "align",
            label: "Align",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.align",
            defValue: Phaser.GameObjects.BitmapText.ALIGN_LEFT,
            getValue: obj => obj.align,
            setValue: (obj, value) => obj.align = value,
            getValueLabel: value => {
                return {
                    [Phaser.GameObjects.BitmapText.ALIGN_LEFT]: "LEFT",
                    [Phaser.GameObjects.BitmapText.ALIGN_CENTER]: "CENTER",
                    [Phaser.GameObjects.BitmapText.ALIGN_RIGHT]: "RIGHT"
                }[value];
            },
            values: [
                Phaser.GameObjects.BitmapText.ALIGN_LEFT,
                Phaser.GameObjects.BitmapText.ALIGN_CENTER,
                Phaser.GameObjects.BitmapText.ALIGN_RIGHT
            ]
        };

        static fontSize: IProperty<BitmapText> = {
            name: "fontSize",
            label: "Font Size",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.setFontSize",
            defValue: 0,
            getValue: obj => obj.fontSize,
            setValue: (obj, value) => obj.setFontSize(value)
        };

        static letterSpacing: IProperty<BitmapText> = {
            name: "letterSpacing",
            label: "Letter Spacing",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.setLetterSpacing",
            defValue: 0,
            getValue: obj => obj.letterSpacing,
            setValue: (obj, value) => obj.setLetterSpacing(value)
        };

        static dropShadowX = SimpleProperty("dropShadowX", 0, "Drop Shadow X", "phaser:Phaser.GameObjects.BitmapText.dropShadowX");
        static dropShadowY = SimpleProperty("dropShadowY", 0, "Drop Shadow Y", "phaser:Phaser.GameObjects.BitmapText.dropShadowY");
        static dropShadowAlpha = SimpleProperty("dropShadowAlpha", 0.5, "Drop Shadow Alpha", "phaser:Phaser.GameObjects.BitmapText.dropShadowAlpha");
        static dropShadowColor = NumberColorProperty("dropShadowColor", "#000000", "Drop Shadow Color", "phaser:Phaser.GameObjects.BitmapText.dropShadowColor");

        constructor(obj: BitmapText) {
            super(obj, [
                BitmapTextComponent.font,
                BitmapTextComponent.align,
                BitmapTextComponent.fontSize,
                BitmapTextComponent.letterSpacing,
                BitmapTextComponent.dropShadowX,
                BitmapTextComponent.dropShadowY,
                BitmapTextComponent.dropShadowAlpha,
                BitmapTextComponent.dropShadowColor
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args,
                BitmapTextComponent.fontSize,
                BitmapTextComponent.align,
                BitmapTextComponent.letterSpacing,
                BitmapTextComponent.dropShadowX,
                BitmapTextComponent.dropShadowY,
                BitmapTextComponent.dropShadowAlpha,
                NumberColorPropertyCodeDomAdapter(BitmapTextComponent.dropShadowColor)
            );
        }
    }
}