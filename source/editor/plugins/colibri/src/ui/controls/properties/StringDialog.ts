namespace colibri.ui.controls.properties {

    export class StringDialog extends dialogs.Dialog {
        private _textArea: HTMLTextAreaElement;

        createDialogArea() {

            this._textArea = document.createElement("textarea");
            this._textArea.classList.add("DialogClientArea");
            this._textArea.style.boxSizing = "border-box";
            this._textArea.style.resize = "none";

            this.getElement().appendChild(this._textArea);
        }

        setValue(value: string) {

            this._textArea.value = value;
        }

        getValue() {

            return this._textArea.value;
        }
    }
}