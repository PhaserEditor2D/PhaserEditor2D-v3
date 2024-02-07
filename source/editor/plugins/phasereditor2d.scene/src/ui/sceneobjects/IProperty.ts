namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IProperty<T> {

        getValue(obj: T): any;

        setValue(obj: T, value: any): void;

        name: string;

        codeName?: string;

        defValue: any;

        increment?: number;

        incrementMin?: number;

        incrementMax?: number;

        incrementValueComputer?: colibri.ui.controls.properties.IValueComputer;

        local?: boolean;

        label?: string;

        tooltip?: string;

        valueToCodeConverter?: IValueToCodeConverter;
    }

    export declare type IValueToCodeConverter = (value: any) => any;

    export function ArrayValueToCodeConverter(value: any[]) {

        return `[${value.map(val => JSON.stringify(val)).join(", ")}]`;
    }
}