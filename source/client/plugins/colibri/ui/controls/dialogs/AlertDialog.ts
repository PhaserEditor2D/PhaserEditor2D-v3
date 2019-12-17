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

                AlertDialog._currentDialog = null;
                
                this.close();
            });
        }

        static replaceConsoleAlert() {
            window["__alert"] = window.alert;

            window.alert = (msg: string) => {

                if (!this._currentDialog) {

                    const dlg = new AlertDialog();

                    dlg.create();

                    this._currentDialog = dlg;
                }

                this._currentDialog._messageElement.innerHTML += `<pre>${msg}</pre>`;
            };
        }
    }
}