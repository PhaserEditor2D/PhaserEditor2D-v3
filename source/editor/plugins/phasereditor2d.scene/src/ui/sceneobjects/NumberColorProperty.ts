namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    function parseColor(color: string) {

        const rgba = controls.Colors.parseColor(color);

        const result = Phaser.Display.Color.GetColor(rgba.r, rgba.g, rgba.b);

        return result;
    }

    export function NumberColorProperty(
        name: string,  defValue: string, label: string, tooltip: string): IProperty<any> {

        return {
            name,
            defValue: defValue,
            label,
            tooltip,
            local: false,
            getValue: obj => {

                const val = obj["color__" + name];

                return val === undefined ? defValue : val;
            },
            setValue: (obj, value: string) => {

                if (typeof (value) === "string" && value.trim() === "") {

                    value = defValue;
                }

                // update the real object color property

                try {

                    const color = parseColor(value);

                    obj[name] = color;

                    // store the original value in the object

                    obj["color__" + name] = value;

                } catch (e) {

                    // possible color syntax error.

                    console.log(e);
                }
            }
        };
    }

    export function NumberColorPropertyCodeDomAdapter(p: IProperty<any>): IProperty<any> {

        const name = p.name;

        const defValue = parseColor(p.defValue);

        return {
            name: name,
            defValue,
            label: p.label,
            tooltip: p.tooltip,
            local: p.local,
            getValue: obj => {

                const val = obj["color__" + name];

                if (val === undefined) {

                    return defValue;
                }

                const color = parseColor(val);

                return color;
            },

            setValue: (obj, value) => {

                throw new Error("Unreachable code!");
            }
        }
    }
}