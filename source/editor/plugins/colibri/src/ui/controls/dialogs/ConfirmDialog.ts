/// <reference path="./Dialog.ts" />

namespace colibri.ui.controls.dialogs {

    export class ConfirmDialog extends Dialog {

        private _messageElement: HTMLElement;
        private _confirmBtn: HTMLButtonElement;
        private _confirmCallback: (ok: boolean) => void;

        constructor() {
            super("ConfirmDialog");
        }

        createDialogArea() {

            this._messageElement = document.createElement("div");
            this._messageElement.classList.add("DialogClientArea", "DialogSection");

            this.getElement().appendChild(this._messageElement);
        }

        create() {

            super.create();

            this.setTitle("Confirm");

            this.addButton("Cancel", () => {

                if (this._confirmCallback) {

                    this._confirmCallback(false);
                }

                this.close();
            });

            this._confirmBtn = this.addButton("Confirm", () => {

                if (this._confirmCallback) {

                    this._confirmCallback(true);
                }

                this.close();
            });
        }

        getConfirmButton() {

            return this._confirmBtn;
        }

        setConfirmCallback(callback: (ok: boolean) => void) {

            this._confirmCallback = callback;
        }

        setMessage(text: string) {

            this._messageElement.innerHTML = text;
        }

        static async show(message: string, confirmBtnText = "Confirm"): Promise<boolean> {

            const dlg = new ConfirmDialog();
            dlg.create();
            dlg.getConfirmButton().textContent = confirmBtnText;
            dlg.setMessage(message);

            return new Promise((resolve, reject) => {

                dlg.setConfirmCallback(ok => {

                    resolve(ok);
                });
            });
        }
    }
}