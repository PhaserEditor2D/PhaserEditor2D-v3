namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TextComponent extends Component<Text> {

        static fixedWidth: IProperty<Text> = {
            name: "fixedWidth",
            label: "Width",
            defValue: 0,
            getValue: obj => obj.style.fixedWidth,
            setValue: (obj, value) => obj.setFixedSize(value, obj.style.fixedHeight)
        };

        static fixedHeight: IProperty<Text> = {
            name: "fixedHeight",
            label: "Height",
            defValue: 0,
            getValue: obj => obj.style.fixedHeight,
            setValue: (obj, value) => obj.setFixedSize(obj.style.fixedWidth, value)
        };

        static fixedSize: IPropertyXY = {
            label: "Fixed Size",
            x: TextComponent.fixedWidth,
            y: TextComponent.fixedHeight
        };

        static paddingLeft: IProperty<Text> = {
            name: "paddingLeft",
            label: "Padding Left",
            defValue: 0,
            getValue: obj => obj.padding["left"],
            setValue: (obj, value) => { obj.padding["left"] = value; obj.updateText(); }
        };

        static paddingTop: IProperty<Text> = {
            name: "paddingTop",
            label: "Padding Top",
            defValue: 0,
            getValue: obj => obj.padding["top"],
            setValue: (obj, value) => { obj.padding["top"] = value; obj.updateText(); }
        };

        static paddingRight: IProperty<Text> = {
            name: "paddingRight",
            label: "Padding Right",
            defValue: 0,
            getValue: obj => obj.padding["right"],
            setValue: (obj, value) => { obj.padding["right"] = value; obj.updateText(); }
        };

        static paddingBottom: IProperty<Text> = {
            name: "paddingBottom",
            label: "Padding Bottom",
            defValue: 0,
            getValue: obj => obj.padding["bottom"],
            setValue: (obj, value) => { obj.padding["bottom"] = value; obj.updateText(); }
        };

        static lineSpacing: IProperty<Text> = {
            name: "lineSpacing",
            label: "Line Spacing",
            defValue: 0,
            getValue: obj => obj.lineSpacing,
            setValue: (obj, value) => obj.setLineSpacing(value)
        };

        static align: IEnumProperty<Text, string> = {
            name: "align",
            label: "Align",
            defValue: "left",
            getValue: obj => obj.style.align,
            setValue: (obj, value) => obj.setAlign(value),
            values: ["left", "right", "center", "justify"],
            getValueLabel: value => value.toUpperCase()
        };

        static fontFamily: IProperty<Text> = {
            name: "fontFamily",
            label: "Font Family",
            defValue: "Courier",
            getValue: obj => obj.style.fontFamily,
            setValue: (obj, value) => obj.setFontFamily(value)
        };

        static fontSize: IProperty<Text> = {
            name: "fontSize",
            label: "Font Size",
            defValue: "16px",
            getValue: obj => obj.style.fontSize,
            setValue: (obj, value) => obj.setFontSize(value)
        };

        static fontStyle: IEnumProperty<Text, string> = {
            name: "fontStyle",
            label: "Font Style",
            defValue: "",
            getValue: obj => obj.style.fontStyle,
            setValue: (obj, value) => obj.setFontStyle(value),
            values: ["", "italic", "bold", "bold italic"],
            getValueLabel: value => value === "" ? "(Default)" : value.toUpperCase()
        };

        static color: IProperty<Text> = {
            name: "color",
            label: "Color",
            defValue: "#fff",
            getValue: obj => obj.style.color,
            setValue: (obj, value) => obj.setColor(value)
        };

        static stroke: IProperty<Text> = {
            name: "stroke",
            label: "Stroke",
            defValue: "#fff",
            getValue: obj => obj.style.stroke,
            setValue: (obj, value) => obj.setStroke(value, obj.style.strokeThickness)
        };

        static strokeThickness: IProperty<Text> = {
            name: "strokeThickness",
            label: "Stroke Thickness",
            defValue: 0,
            getValue: obj => obj.style.strokeThickness,
            setValue: (obj, value) => obj.setStroke(obj.style.stroke, value)
        };

        static backgroundColor: IProperty<Text> = {
            name: "backgroundColor",
            label: "Background Color",
            defValue: null,
            getValue: obj => obj.style.backgroundColor,
            setValue: (obj, value) => obj.setBackgroundColor(value)
        };

        static shadowOffsetX: IProperty<Text> = {
            name: "shadow.offsetX",
            label: "X",
            defValue: 0,
            getValue: obj => obj.style.shadowOffsetX,
            setValue: (obj, value) => obj.setShadowOffset(value, obj.style.shadowOffsetY)
        };

        static shadowOffsetY: IProperty<Text> = {
            name: "shadow.offsetY",
            label: "Y",
            defValue: 0,
            getValue: obj => obj.style.shadowOffsetY,
            setValue: (obj, value) => obj.setShadowOffset(obj.style.shadowOffsetX, value)
        };

        static shadowOffset: IPropertyXY = {
            label: "Shadow Offset",
            x: TextComponent.shadowOffsetX,
            y: TextComponent.shadowOffsetY
        };

        static shadowStroke: IProperty<Text> = {
            name: "shadow.stroke",
            label: "Stroke",
            defValue: false,
            getValue: obj => obj.style.shadowStroke,
            setValue: (obj, value) => obj.setShadowStroke(value)
        };

        static shadowFill: IProperty<Text> = {
            name: "shadow.fill",
            label: "Fill",
            defValue: false,
            getValue: obj => obj.style.shadowFill,
            setValue: (obj, value) => obj.setShadowFill(value)
        };

        static shadow: IPropertyXY = {
            label: "Shadow",
            x: TextComponent.shadowStroke,
            y: TextComponent.shadowFill
        };

        static shadowColor: IProperty<Text> = {
            name: "shadow.color",
            label: "Shadow Color",
            defValue: "#000",
            getValue: obj => obj.style.shadowColor,
            setValue: (obj, value) => obj.setShadowColor(value)
        };

        static shadowBlur: IProperty<Text> = {
            name: "shadow.blur",
            label: "Shadow Blur",
            defValue: 0,
            getValue: obj => obj.style.shadowBlur,
            setValue: (obj, value) => obj.setShadowBlur(value)
        };

        static baselineX: IProperty<Text> = {
            name: "baselineX",
            label: "X",
            defValue: 1.2,
            getValue: obj => obj.style.baselineX,
            setValue: (obj, value) => obj.style.baselineX = value
        };

        static baselineY: IProperty<Text> = {
            name: "baselineY",
            label: "Y",
            defValue: 1.4,
            getValue: obj => obj.style.baselineY,
            setValue: (obj, value) => obj.style.baselineY = value
        };

        static baseline: IPropertyXY = {
            label: "Baseline",
            x: TextComponent.baselineX,
            y: TextComponent.baselineY
        };

        static maxLines: IProperty<Text> = {
            name: "maxLines",
            label: "Max Lines",
            defValue: 0,
            getValue: obj => obj.style.maxLines,
            setValue: (obj, value) => obj.setMaxLines(value)
        };

        constructor(obj: Text) {
            super(obj, [
                TextComponent.fixedWidth,
                TextComponent.fixedHeight,
                TextComponent.paddingLeft,
                TextComponent.paddingTop,
                TextComponent.paddingRight,
                TextComponent.paddingBottom,
                TextComponent.lineSpacing,
                TextComponent.align,
                TextComponent.fontFamily,
                TextComponent.fontSize,
                TextComponent.fontStyle,
                TextComponent.color,
                TextComponent.stroke,
                TextComponent.strokeThickness,
                TextComponent.backgroundColor,
                TextComponent.shadowOffsetX,
                TextComponent.shadowOffsetY,
                TextComponent.shadowStroke,
                TextComponent.shadowFill,
                TextComponent.shadowColor,
                TextComponent.shadowBlur,
                TextComponent.baselineX,
                TextComponent.baselineY,
                TextComponent.maxLines
            ]);
        }

        styleToJson() {

            const comp = TextComponent;

            const obj = this.getObject();
            const support = obj.getEditorSupport();

            const data = {} as any;

            const simpleProps = [
                comp.align,
                comp.backgroundColor,
                comp.baselineX,
                comp.baselineY,
                comp.color,
                comp.fixedWidth,
                comp.fixedHeight,
                comp.fontFamily,
                comp.fontSize,
                comp.fontStyle,
                comp.maxLines,
                comp.stroke,
                comp.strokeThickness,
                comp.shadowOffsetX,
                comp.shadowOffsetY,
                comp.shadowColor,
                comp.shadowBlur,
                comp.shadowStroke,
                comp.shadowFill
            ];

            if (support.isPrefabInstance()) {

                for (const prop of simpleProps) {

                    if (support.isUnlockedProperty(prop)) {

                        data[prop.name] = prop.getValue(obj);
                    }
                }

            } else {

                for (const prop of simpleProps) {

                    const value = prop.getValue(obj);

                    if (value !== prop.defValue) {

                        data[prop.name] = value;
                    }
                }
            }

            return data;
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();
            const support = obj.getEditorSupport();

            {
                // style

                const style = this.styleToJson();

                const literal = JSON.stringify(style);

                if (literal !== "{}") {

                    const dom = new code.MethodCallCodeDOM("setStyle", args.objectVarName);

                    dom.arg(literal);

                    args.result.push(dom);
                }
            }

            {
                // padding

                const comp = TextComponent;
                const padding = {} as any;
                const map = {
                    left: comp.paddingLeft,
                    top: comp.paddingTop,
                    right: comp.paddingRight,
                    bottom: comp.paddingBottom
                };

                if (support.isPrefabInstance()) {

                    // tslint:disable-next-line:forin
                    for (const key in map) {

                        const prop = map[key] as IProperty<any>;

                        if (support.isUnlockedProperty(prop)) {

                            padding[key] = prop.getValue(obj);
                        }
                    }

                } else {

                    // tslint:disable-next-line:forin
                    for (const key in map) {

                        const prop = map[key] as IProperty<any>;
                        const value = prop.getValue(obj);

                        if (value !== prop.defValue) {

                            padding[key] = value;
                        }
                    }
                }

                const literal = JSON.stringify(padding);

                if (literal !== "{}") {

                    const dom = new code.MethodCallCodeDOM("setPadding", args.objectVarName);

                    dom.arg(literal);

                    args.result.push(dom);
                }
            }
        }
    }
}