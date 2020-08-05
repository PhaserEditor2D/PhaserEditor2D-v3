namespace phasereditor2d.code.ui.editors.properties {

    import controls = colibri.ui.controls;

    export class DocumentationSection extends controls.properties.PropertySection<DocumentationItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.code.ui.editors.properties.DocumentationSection", "Documentation", true, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);
            comp.style.alignItems = "self-start";

            const docElement = document.createElement("div");
            docElement.style.height = "100%";
            docElement.classList.add("UserSelectText");

            comp.appendChild(docElement);

            this.addUpdater(() => {

                const item = this.getSelectionFirstElement() as DocumentationItem;

                docElement.innerHTML = item.toHTML();
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