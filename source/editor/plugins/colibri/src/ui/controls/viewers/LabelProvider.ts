namespace colibri.ui.controls.viewers {

    export class LabelProvider implements ILabelProvider {

        private _getLabel: (obj: any) => string;

        constructor(getLabel?: (obj: any) => string) {
            this._getLabel = getLabel;
        }

        getLabel(obj: any): string {

            if (this._getLabel) {

                return this._getLabel(obj);
            }

            if (typeof (obj) === "string") {
                
                return obj;
            }

            return "";
        }
    }
}