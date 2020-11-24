namespace colibri.ui.controls.dialogs {

    export declare type InputValidator = (input: string) => boolean;
    export declare type ResultCallback = (value: string) => void;

    export class InputDialog extends Dialog {

        private _textElement: HTMLInputElement;
        private _messageElement: HTMLLabelElement;
        private _acceptButton: HTMLButtonElement;
        private _validator: InputValidator;
        private _resultCallback: ResultCallback;

        constructor() {
            super("InputDialog");
        }

        getAcceptButton() {

            return this._acceptButton;
        }


        setInputValidator(validator: InputValidator) {

            this._validator = validator;
        }

        setResultCallback(callback: ResultCallback) {

            this._resultCallback = callback;
        }

        setMessage(message: string) {

            this._messageElement.innerText = message + ":";
        }

        setInitialValue(value: string) {

            this._textElement.value = value;
        }

        createDialogArea() {

            const area = document.createElement("div");
            area.classList.add("DialogClientArea", "DialogSection");

            area.style.display = "grid";
            area.style.gridTemplateColumns = "1fr";
            area.style.gridTemplateRows = "min-content min-content";

            this.getElement().appendChild(area);

            this._messageElement = document.createElement("label");
            this._messageElement.innerText = "Enter value:";
            this._messageElement.classList.add("InputDialogLabel");
            area.appendChild(this._messageElement);

            this._textElement = document.createElement("input");
            this._textElement.type = "text";
            this._textElement.addEventListener("keyup", e => this.validate());
            area.appendChild(this._textElement);
        }

        validate() {

            let valid = false;

            if (this._validator) {
                valid = this._validator(this._textElement.value);
            }

            this._acceptButton.disabled = !valid;
        }

        create() {

            super.create();

            this._acceptButton = this.addButton("Accept", () => {

                if (this._resultCallback) {

                    this._resultCallback(this._textElement.value);
                }

                this.close();
            });

            this.addButton("Cancel", () => this.close());

            setTimeout(() => this._textElement.focus(), 100);

            this.connectInputWithButton(this._textElement, this._acceptButton);
        }
    }
}