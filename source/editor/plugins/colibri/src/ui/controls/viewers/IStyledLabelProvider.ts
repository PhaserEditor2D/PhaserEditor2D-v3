namespace colibri.ui.controls.viewers {

    export interface IStyledText {
        text: string;
        color: string;
    }

    export interface IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean): IStyledText[];
    }
}