namespace colibri.ui.controls.viewers {

    export class LabelProviderFromStyledLabelProvider implements ILabelProvider {

        private _styledLabelProvider: IStyledLabelProvider;

        constructor(styledLabelProvider: IStyledLabelProvider) {

            this._styledLabelProvider = styledLabelProvider;
        }

        getLabel(obj: any): string {

            const theme = controls.Controls.getTheme();

            return this._styledLabelProvider.getStyledTexts(obj, theme.dark).map(elem => elem.text).join("");
        }
    }
}