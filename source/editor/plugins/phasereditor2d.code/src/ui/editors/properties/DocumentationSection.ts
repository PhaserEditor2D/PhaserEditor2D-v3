namespace phasereditor2d.code.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class DocumentationSection extends controls.properties.PropertySection<DocumentationItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.code.ui.editors.properties.DocumentationSection", "Documentation", true, false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);
            comp.style.alignItems = "self-start";

            const preElement = document.createElement("pre");
            preElement.style.wordBreak = "break-word";
            preElement.style.whiteSpace = "pre-wrap";

            comp.appendChild(preElement);

            this.addUpdater(() => {

                const item = this.getSelectionFirstElement() as DocumentationItem;

                preElement.innerHTML = item.toHTML();

            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof DocumentationItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}