namespace phasereditor2d.scene.ui.sceneobjects {

    export function SimpleProperty(name: string, defValue: any, label?: string, tooltip?: string): IProperty<any> {

        return {
            name,
            defValue,
            label,
            tooltip,
            getValue: obj => obj[name],
            setValue: (obj, value) => obj[name] = value
        };
    }
}