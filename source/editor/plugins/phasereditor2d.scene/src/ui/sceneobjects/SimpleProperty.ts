namespace phasereditor2d.scene.ui.sceneobjects {

    export function SimpleProperty(
        nameConfig: string | { name: string, codeName: string },
        defValue: any,
        label?: string,
        tooltip?: string,
        local: boolean = false,
        afterSetValue?: (obj: any) => void,
        increment?: number,
        incrementMin?: number,
        incrementMax?: number): IProperty<any> {

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
            increment,
            incrementMin,
            incrementMax,
            getValue: obj => obj[name],
            setValue: (obj, value) => {

                obj[name] = value;

                if (afterSetValue) {

                    afterSetValue(obj);
                }
            }
        };
    }
}