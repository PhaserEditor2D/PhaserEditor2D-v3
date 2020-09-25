namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export abstract class DocsSection extends editor.properties.BaseSceneSection<any> {

        private _converter: any;

        constructor(page: controls.properties.PropertyPage, id: string) {
            super(page, id, "Documentation", true, false);

            this._converter = new window["showdown"].Converter();
        }

        protected abstract getHelp(): string;

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);
            comp.style.alignItems = "self-start";

            const docElement = document.createElement("div");
            docElement.style.height = "100%";
            docElement.classList.add("UserSelectText");

            comp.appendChild(docElement);

            this.addUpdater(() => {

                const help = this.getHelp();
                const html = this._converter.makeHtml(help);
                docElement.innerHTML = html;
            });
        }

        hasMenu() {

            return false;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}