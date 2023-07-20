namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;

    export class AboutDialog extends controls.dialogs.Dialog {

        constructor() {
            super("AboutDialog");
        }

        createDialogArea() {

            const activated = IDEPlugin.getInstance().isLicenseActivated();

            const element = document.createElement("div");
            element.classList.add("DialogClientArea", "DialogSection");

            const html = `
            <p class="Title"><b>Phaser Editor 2D ${activated? "Premium" : "Free"}</b><br><small>v${colibri.PRODUCT_VERSION}</small></p>
            <p><i>A friendly IDE for HTML5 game development</i></p>

            <p>
                <p>@PhaserEditor2D</p>
                <a href="https://phasereditor2d.com" rel="noopener" target="_blank">phasereditor2d.com</a>
                <a href="https://www.twitter.com/PhaserEditor2D" rel="noopener" target="_blank">Twitter</a>
                <a href="https://www.facebook.com/PhaserEditor2D" rel="noopener" target="_blank">Facebook</a>
                <a href="https://github.com/PhaserEditor2D/PhaserEditor" rel="noopener" target="_blank">GitHub</a>
                <a href="https://www.youtube.com/c/PhaserEditor2D" rel="noopener" target="_blank">YouTube</a> <br>
            </p>

            <p>
            </p>

            <p><small>Copyright &copy; Arian Fornaris </small></p>
            `;

            element.innerHTML = html;

            this.getElement().appendChild(element);
        }

        create() {

            super.create();

            this.setTitle("About");

            this.addButton("Close", () => this.close());
        }
    }
}