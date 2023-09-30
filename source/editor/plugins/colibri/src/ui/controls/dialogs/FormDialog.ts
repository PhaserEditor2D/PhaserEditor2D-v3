namespace colibri.ui.controls.dialogs {

    export class FormDialog extends Dialog {

        private _formElement: HTMLDivElement;
        private _formBuilder: properties.EasyFormBuilder;

        constructor() {
            super();
        }

        protected createDialogArea() {

            const clientArea = document.createElement("div");
            clientArea.classList.add("DialogClientArea");

            clientArea.style.display = "grid";
            clientArea.style.alignItems = "center";
            clientArea.style.gridTemplateColumns = "auto 1fr";
            clientArea.style.rowGap = "5px";
            clientArea.style.columnGap = "5px";
            clientArea.style.height = "min-content";

            this.getElement().appendChild(clientArea);

            this._formElement = clientArea;

            this._formBuilder = new controls.properties.EasyFormBuilder(this._formElement);
        }

        layout() {

            super.layout();

            this.getElement().style.height = "auto";
        }

        getBuilder() {

            return this._formBuilder;
        }

        getFormElement() {

            return this._formElement;
        }
    }
}