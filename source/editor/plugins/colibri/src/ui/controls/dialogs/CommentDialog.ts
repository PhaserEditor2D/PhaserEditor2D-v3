namespace colibri.ui.controls.dialogs {

    export class CommentDialog extends Dialog {

        constructor() {
            super("CommentDialog");
        }

        createDialogArea() {

            this.getElement().style.width = "auto";
            this.getElement().style.height = "auto";

            const clientAreaElement = document.createElement("div");
            clientAreaElement.classList.add("DialogClientArea");
            this.getElement().appendChild(clientAreaElement);

            const inputElement = document.createElement("input");
            inputElement.style.width = "32px";
            inputElement.style.background = "transparent";
            inputElement.style.fontSize = "32px";
            inputElement.style.fontFamily = "monospace";
            inputElement.style.border = "none";
            inputElement.addEventListener("keydown", e => {

                setTimeout(() => {

                    const size = 20 * inputElement.value.length + 10;

                    inputElement.style.width = Math.max(size, 50) + "px";

                    this.resize();

                }, 10);
            });

            clientAreaElement.appendChild(inputElement);

            setTimeout(() => inputElement.focus(), 10);
        }

        protected resize() {

            const w = this.getElement().getBoundingClientRect().width;

            this.setLocation(
                window.innerWidth / 2 - w / 2,
                window.innerHeight * 0.2);
        }
    }
}