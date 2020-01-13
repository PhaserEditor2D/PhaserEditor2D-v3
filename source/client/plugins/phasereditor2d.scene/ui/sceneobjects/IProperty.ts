namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IProperty<T> {

        getValue(obj: T): any;

        setValue(obj: T, value: any): void;

        name?: string;

        defValue?: any;

        label?: string;

        tooltip?: string;
    }
}