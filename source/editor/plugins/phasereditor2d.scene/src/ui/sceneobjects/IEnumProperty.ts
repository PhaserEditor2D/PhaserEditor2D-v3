namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IEnumProperty<T, TValue> extends IProperty<T> {

        values?: TValue[];

        getEnumValues?: (object: T) => TValue[];

        getValueLabel: (value: TValue) => string;
    }
}