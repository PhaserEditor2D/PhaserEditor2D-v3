namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export function colorStringToColorNumberConverter(value: string) {

        if (typeof (value) === "string" && value.trim() === "") {

            value = "#ffffff";
        }

        // update the real object tint property

        try {

            const rgba = controls.Colors.parseColor(value);

            const color = Phaser.Display.Color.GetColor(rgba.r, rgba.g, rgba.b);

            return color;

        } catch (e) {

            // possible color syntax error.

            console.log(e);
        }

        return 0;
    }

    export function TintProperty(
        name: string, label?: string, tooltip?: string): IProperty<any> {

        return {
            name,
            defValue: "#ffffff",
            label,
            tooltip: tooltip ?? "phaser:Phaser.GameObjects.Components.Tint." + name,
            local: false,
            getValue: obj => {

                const val = obj["tint_" + name];

                return val === undefined ? "#ffffff" : val;
            },
            setValue: (obj, value: string) => {

                const validColor = colorStringToColorNumberConverter(value);

                obj[name] = validColor;

                // store the original, string color value in the object

                obj["tint_" + name] = value;
            },
            valueToCodeConverter: colorStringToColorNumberConverter
        };
    }

    export class TintComponent extends Component<ISceneGameObject> {

        static tintFill = SimpleProperty("tintFill", false, "Tint Fill", "phaser:Phaser.GameObjects.Components.Tint.tintFill");
        static tintTopLeft = TintProperty("tintTopLeft", "Tint Top Left");
        static tintTopRight = TintProperty("tintTopRight", "Tint Top Right");
        static tintBottomLeft = TintProperty("tintBottomLeft", "Tint Bottom Left");
        static tintBottomRight = TintProperty("tintBottomRight", "Tint Bottom Right");

        constructor(obj: ISceneGameObject) {
            super(obj, [
                TintComponent.tintTopLeft,
                TintComponent.tintTopRight,
                TintComponent.tintBottomLeft,
                TintComponent.tintBottomRight,
                TintComponent.tintFill
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, TintComponent.tintFill);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintComponent.tintTopLeft);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintComponent.tintTopRight);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintComponent.tintBottomLeft);
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintComponent.tintBottomRight);
        }
    }
}