namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IEnumProperty<T, TValue> extends IProperty<T> {

        values: TValue[];

        getValueLabel(value: TValue): string;
    }
}