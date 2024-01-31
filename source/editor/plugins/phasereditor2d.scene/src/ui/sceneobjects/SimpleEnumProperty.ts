namespace phasereditor2d.scene.ui.sceneobjects {

    export function SimpleEnumProperty(
        nameConfig: string | { name: string, codeName: string },
        defValue: any,
        enumValues: any[],
        enumLabels: string[],
        label?: string,
        tooltip?: string,
        local: boolean = false,
        afterSetValue?: (obj: any) => void): IEnumProperty<any, any> {

        let codeName: string;
        let name: string;

        if (typeof nameConfig === "object") {

            codeName = nameConfig.codeName;
            name = nameConfig.name;

        } else {

            name = nameConfig;
        }

        return {
            name,
            codeName,
            defValue,
            label,
            tooltip: tooltip,
            local,
            getValue: obj => obj[name],
            setValue: (obj, value) => {

                obj[name] = value;

                if (afterSetValue) {

                    afterSetValue(obj);
                }
            },
            values: enumValues,

            getEnumValues: (object: any) => enumValues,

            getValueLabel: (value: any) => enumLabels[enumValues.indexOf(value)]
        };
    }
}