namespace phasereditor2d.scene.ui.sceneobjects {

    export function FXProperty(prop: IProperty<any>): IProperty<FXObject> {

        return {
            name: prop.name,
            defValue: prop.defValue,
            label: prop.label,
            tooltip: prop.tooltip,
            local: prop.local,
            codeName: prop.codeName,
            valueToCodeConverter: prop.valueToCodeConverter,
            getValue: obj => {

                return prop.getValue(obj.getPhaserFX());
            },
            setValue: (obj, value) => {

                prop.setValue(obj.getPhaserFX(), value);
            }
        };
    };
}