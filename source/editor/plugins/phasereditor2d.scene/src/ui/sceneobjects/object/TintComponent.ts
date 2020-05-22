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
            setValue: (obj, value) => {

                obj["tint_" + name] = value;

                // update the real object tint property

                const rgba = controls.Colors.parseColor(value);

                const color = Phaser.Display.Color.GetColor(rgba.r, rgba.g, rgba.b);

                obj[name] = color;
            }
        };
    }


    export class TintComponent extends Component<ISceneObject> {

        static tintFill = SimpleProperty("tintFill", false, "Tint Fill", "phaser:Phaser.GameObjects.Components.Tint.tintFill");
        static tintTopLeft = TintProperty("tintTopLeft", "Tint Top Left");
        static tintTopRight = TintProperty("tintTopRight", "Tint Top Right");
        static tintBottomLeft = TintProperty("tintBottomLeft", "Tint Bottom Left");
        static tintBottomRight = TintProperty("tintBottomRight", "Tint Bottom Right");

        constructor(obj: ISceneObject) {
            super(obj, [
                TintComponent.tintFill,
                TintComponent.tintTopLeft,
                TintComponent.tintTopRight,
                TintComponent.tintBottomLeft,
                TintComponent.tintBottomRight
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...this.getProperties());
        }
    }
}