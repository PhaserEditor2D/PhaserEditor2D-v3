namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IPropertyXY {

        label: string;
        tooltip?: string;
        setterName?:string;
        x: IProperty<any>;
        y: IProperty<any>;
    }
}