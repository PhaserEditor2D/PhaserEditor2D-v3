namespace colibri.ui.controls.dialogs {

    export class ProgressDialog extends Dialog {

        private _progressElement: HTMLElement;

        constructor() {
            super("ProgressDialog");
        }

        createDialogArea() {

            this._progressElement = document.createElement("div");
            this._progressElement.classList.add("ProgressBar");

            const area = document.createElement("div");
            area.classList.add("DialogClientArea");
            area.style.paddingTop = "10px";
            area.appendChild(this._progressElement);

            this.getElement().appendChild(area);
        }

        create() {

            super.create();

            this.getElement().style.height = "auto !important";
        }

        setProgress(progress: number) {

            this._progressElement.style.width = progress * 100 + "%";
        }
    }
}