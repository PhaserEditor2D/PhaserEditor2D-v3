namespace colibri.ui.controls.viewers {

    export class LabelProvider implements ILabelProvider {

        getLabel(obj: any): string {

            if (typeof (obj) === "string") {
                return obj;
            }

            return "";
        }
    }
}