namespace colibri.ui.controls.properties {

    export class EasyFormBuilder {

        private _formBuilder = new FormBuilder();
        private _parent: HTMLElement;

        constructor(parent: HTMLElement) {

            this._parent = parent;
        }

        createLabel(text?: string, tooltip?: string) {

            return this._formBuilder.createLabel(this._parent, text, tooltip);
        }

        createButton(text: string, callback: (e?: MouseEvent) => void) {

            return this._formBuilder.createButton(this._parent, text, callback);
        }

        createMenuButton(
            text: string,
            getItems: () => Array<{ name: string, value: any, icon?: controls.IImage }>,
            callback: (value: any) => void) {

            return this._formBuilder.createMenuButton(this._parent, text, getItems, callback);
        }

        createText(readOnly?: boolean) {

            return this._formBuilder.createText(this._parent, readOnly);
        }

        createTextDialog(dialogTitle: string, readOnly?: boolean) {

            return this._formBuilder.createTextDialog(this._parent, dialogTitle, readOnly);
        }

        createColor(readOnly?: boolean, allowAlpha?: boolean) {

            return this._formBuilder.createColor(this._parent, readOnly, allowAlpha);
        }

        createTextArea(readOnly?: boolean) {

            return this._formBuilder.createTextArea(this._parent, readOnly);
        }
    }
}