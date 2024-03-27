namespace colibri.ui.ide.welcome {

    export class WelcomePage extends colibri.ui.ide.EditorPart {

        private static _factory: WelcomePageFactory;
        private _contentElement: HTMLDivElement;

        static getFactory() {

            return this._factory || (this._factory = new WelcomePageFactory());
        }

        constructor() {
            super("colibri.ui.ide.welcome.WelcomePage", WelcomePage.getFactory());

            const ext = ColibriPlugin.getInstance().getWelcomePageExtension();

            if (ext) {

                this.setIcon(ext.getIcon());
            }
        }

        setInput(input: colibri.ui.ide.IEditorInput): void {

            super.setInput(input);

            this.setTitle("Welcome");
        }

        protected createPart(): void {

            this._contentElement = document.createElement("div");
            this._contentElement.classList.add("WelcomePageArea");

            this.getElement().appendChild(this._contentElement);

            const ext = ColibriPlugin.getInstance().getWelcomePageExtension();

            if (ext) {

                ext.buildPage(this, this._contentElement);
            }
        }
    }
}