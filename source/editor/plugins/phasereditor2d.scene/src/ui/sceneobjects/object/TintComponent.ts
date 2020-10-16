namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    function TintProperty(
        name: string, label?: string): IProperty<any> {

        return {
            name,
            defValue: "#ffffff",
            label,
            tooltip: "phaser:Phaser.GameObjects.Components.Tint." + name,
            local: false,
            getValue: obj => {

                const val = obj["tint_" + name];

                return val === undefined ? "#ffffff" : val;
            },
            setValue: (obj, value: string) => {

                if (typeof (value) === "string" && value.trim() === "") {

                    value = "#ffffff";
                }

                // update the real object tint property

                try {

                    const rgba = controls.Colors.parseColor(value);

                    const color = Phaser.Display.Color.GetColor(rgba.r, rgba.g, rgba.b);

                    obj[name] = color;

                    // store the original value in the object

                    obj["tint_" + name] = value;

                } catch (e) {

                    // possible color syntax error.

                    console.log(e);
                }
            }
        };
    }

    function TintPropertyCodeDomAdapter(p: IProperty<any>): IProperty<any> {

        const name = p.name;

        return {
            name: name,
            defValue: 0xffffff,
            label: p.label,
            tooltip: p.tooltip,
            local: p.local,
            getValue: obj => {

                const val = obj["tint_" + name];

                if (val === undefined) {

                    return 0xffffff;
                }

                const rgb = controls.Colors.parseColor(val);

                const color = Phaser.Display.Color.GetColor(rgb.r, rgb.g, rgb.b);

                return color;
            },

            setValue: (obj, value) => {

                throw new Error("Unreachable code!");
            }
        }
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
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintPropertyCodeDomAdapter(TintComponent.tintTopLeft));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintPropertyCodeDomAdapter(TintComponent.tintTopRight));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintPropertyCodeDomAdapter(TintComponent.tintBottomLeft));
            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TintPropertyCodeDomAdapter(TintComponent.tintBottomRight));
        }
    }
}