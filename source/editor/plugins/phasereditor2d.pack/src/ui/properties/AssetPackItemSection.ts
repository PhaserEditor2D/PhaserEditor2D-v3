namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class AssetPackItemSection extends controls.properties.PropertySection<core.AssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "AssetPackItemPropertySection", "File Key", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 3);
            comp.style.gridTemplateColumns = "auto 1fr auto";

            {
                // Key

                this.createLabel(comp, "Key");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().getKey();
                });

                this.createButton(comp, "Open", () => {

                    const item = this.getSelectionFirstElement();

                    const file = item.getPack().getFile();

                    const editor = colibri.Platform.getWorkbench().openEditor(file) as pack.ui.editor.AssetPackEditor;

                    editor.revealKey(item.getKey());
                });
            }
        }

        canEdit(obj: any): boolean {
            return obj instanceof core.AssetPackItem;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }

    }

}