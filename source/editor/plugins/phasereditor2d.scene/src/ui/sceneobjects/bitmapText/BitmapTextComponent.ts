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
            increment: 1,
            incrementMin: 1,
            getValue: obj => obj.fontSize,
            setValue: (obj, value) => obj.setFontSize(value)
        };

        static letterSpacing: IProperty<BitmapText> = {
            name: "letterSpacing",
            label: "Letter Spacing",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.setLetterSpacing",
            defValue: 0,
            increment: 1,
            incrementMin: 1,
            getValue: obj => obj.letterSpacing,
            setValue: (obj, value) => obj.setLetterSpacing(value)
        };

        static maxWidth: IProperty<BitmapText> = {
            name: "maxWidth",
            label: "Max Width",
            tooltip: "phaser:Phaser.GameObjects.BitmapText.maxWidth",
            defValue: 0,
            increment: 1,
            incrementMin: 0,
            getValue: obj => obj.maxWidth,
            setValue: (obj, value) => obj.setMaxWidth(value)
        };

        static dropShadowX = SimpleProperty("dropShadowX", 0, "Drop Shadow X", "phaser:Phaser.GameObjects.BitmapText.dropShadowX", false, null, 1, 0);
        static dropShadowY = SimpleProperty("dropShadowY", 0, "Drop Shadow Y", "phaser:Phaser.GameObjects.BitmapText.dropShadowY", false, null, 1, 0);
        static dropShadowAlpha = SimpleProperty("dropShadowAlpha", 0.5, "Drop Shadow Alpha", "phaser:Phaser.GameObjects.BitmapText.dropShadowAlpha", false, null, 0.05, 0);
        static dropShadowColor = NumberColorProperty("dropShadowColor", "#000000", "Drop Shadow Color", "phaser:Phaser.GameObjects.BitmapText.dropShadowColor");

        constructor(obj: BitmapText) {
            super(obj, [
                BitmapTextComponent.font,
                BitmapTextComponent.align,
                BitmapTextComponent.fontSize,
                BitmapTextComponent.letterSpacing,
                BitmapTextComponent.maxWidth,
                BitmapTextComponent.dropShadowX,
                BitmapTextComponent.dropShadowY,
                BitmapTextComponent.dropShadowAlpha,
                BitmapTextComponent.dropShadowColor
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const support = this.getObject().getEditorSupport();

            if (support.isUnlockedProperty(BitmapTextComponent.font) && support.isNestedPrefabInstance()) {

                const dom = new core.code.MethodCallCodeDOM("setFont", args.objectVarName);
                dom.argLiteral(this.getObject().font);
                args.statements.push(dom);
            }

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args,
                BitmapTextComponent.fontSize,
                BitmapTextComponent.align,
                BitmapTextComponent.letterSpacing,
                BitmapTextComponent.maxWidth,
                BitmapTextComponent.dropShadowX,
                BitmapTextComponent.dropShadowY,
                BitmapTextComponent.dropShadowAlpha,
                NumberColorPropertyCodeDomAdapter2(BitmapTextComponent.dropShadowColor)
            );
        }
    }
}