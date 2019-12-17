namespace colibri.ui.controls.dialogs {

    export class Dialog extends Control {

        private _containerElement: HTMLElement;
        private _buttonPaneElement: HTMLElement;
        private _titlePaneElement: HTMLElement;
        private _width: number;
        private _height: number;
        private static _dialogs: Dialog[] = [];
        private static _firstTime = true;
        private _parentDialog: Dialog;
        private _closeWithEscapeKey: boolean;

        constructor(...classList: string[]) {
            super("div", "Dialog", ...classList);

            this._closeWithEscapeKey = true;

            this._width = 400;
            this._height = 300;

            this._parentDialog = Dialog._dialogs.length === 0 ?
                null : Dialog._dialogs[Dialog._dialogs.length - 1];

            if (Dialog._firstTime) {

                Dialog._firstTime = false;

                window.addEventListener("keydown", e => {

                    if (e.code === "Escape") {

                        if (Dialog._dialogs.length > 0) {

                            const dlg = Dialog._dialogs[Dialog._dialogs.length - 1];

                            if (dlg.isCloseWithEscapeKey()) {
                                dlg.close();
                            }
                        }
                    }
                });

                window.addEventListener(controls.EVENT_THEME_CHANGED, e => {

                    for (const dlg of Dialog._dialogs) {
                        dlg.layout();
                    }
                });

                window.addEventListener("resize", e => {

                    for (const dlg of Dialog._dialogs) {
                        dlg.layout();
                    }
                });
            }

            Dialog._dialogs.push(this);
        }

        static getActiveDialog() {
            return Dialog._dialogs[Dialog._dialogs.length - 1];
        }

        getDialogBackgroundElement() {
            return this._containerElement;
        }

        setCloseWithEscapeKey(closeWithEscapeKey: boolean) {
            this._closeWithEscapeKey = closeWithEscapeKey;
        }

        isCloseWithEscapeKey() {
            return this._closeWithEscapeKey;
        }

        getParentDialog() {
            return this._parentDialog;
        }

        create() {

            this._containerElement = document.createElement("div");
            this._containerElement.classList.add("DialogContainer")

            document.body.appendChild(this._containerElement);
            document.body.appendChild(this.getElement());

            window.addEventListener("resize", () => this.resize());

            this._titlePaneElement = document.createElement("div");
            this._titlePaneElement.classList.add("DialogTitlePane");
            this.getElement().appendChild(this._titlePaneElement);

            this.createDialogArea();

            this._buttonPaneElement = document.createElement("div");
            this._buttonPaneElement.classList.add("DialogButtonPane");

            this.getElement().appendChild(this._buttonPaneElement);

            this.resize();

            if (this._parentDialog) {
                this._parentDialog._containerElement.style.display = "none";
                this._parentDialog.style.display = "none";
            }
        }

        setTitle(title: string) {
            this._titlePaneElement.innerText = title;
        }

        addButton(text: string, callback: () => void) {

            const btn = document.createElement("button");

            btn.innerText = text;

            btn.addEventListener("click", e => callback());

            this._buttonPaneElement.appendChild(btn);

            return btn;
        }

        protected createDialogArea() {

        }

        protected resize() {

            this.setBounds({
                x: window.innerWidth / 2 - this._width / 2,
                y: window.innerHeight * 0.2,
                width: this._width,
                height: this._height
            });
        }

        setSize(width: number, height: number) {
            this._width = width;
            this._height = height;
        }

        close() {

            Dialog._dialogs = Dialog._dialogs.filter(d => d !== this);

            this._containerElement.remove();
            this.getElement().remove();

            if (this._parentDialog) {
                this._parentDialog._containerElement.style.display = "block";
                this._parentDialog.style.display = "grid";
            }
        }

        closeAll() {

            this.close();

            if (this._parentDialog) {
                this._parentDialog.closeAll();
            }
        }

    }

}