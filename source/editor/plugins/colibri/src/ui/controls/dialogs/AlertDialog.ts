/// <reference path="./Dialog.ts" />

namespace colibri.ui.controls.dialogs {

    export class AlertDialog extends Dialog {

        private _messageElement: HTMLElement;

        private static _currentDialog: AlertDialog;

        constructor() {
            super("AlertDialog");
        }

        createDialogArea() {

            this._messageElement = document.createElement("div");
            this._messageElement.classList.add("DialogClientArea", "DialogSection");

            this.getElement().appendChild(this._messageElement);
        }

        create() {

            super.create();

            this.setTitle("Alert");

            this.addButton("Close", () => {

                this.close();
            });
        }

        close() {

            super.close();

            AlertDialog._currentDialog = null;
        }

        setMessage(text: string) {

            this._messageElement.innerHTML = text;
        }

        static replaceConsoleAlert() {
            window["__alert"] = window.alert;

            window.alert = (msg: string) => {

                if (!this._currentDialog) {

                    const dlg = new AlertDialog();

                    dlg.create();

                    this._currentDialog = dlg;
                }

                const preElement = document.createElement("div");
                preElement.style.overflow = "wrap";
                preElement.innerHTML = msg;
                preElement.style.userSelect = "all";
                this._currentDialog._messageElement.innerHTML = "";
                this._currentDialog._messageElement.appendChild(preElement);
            };
        }
    }
}