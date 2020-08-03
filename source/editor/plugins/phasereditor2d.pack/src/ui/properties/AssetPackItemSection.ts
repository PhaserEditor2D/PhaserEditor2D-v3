namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class AssetPackItemSection extends controls.properties.PropertySection<core.AssetPackItem | core.AssetPackImageFrame> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AssetPackItemPropertySection", "File Key", false);
        }

        createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 3);
            comp.style.gridTemplateColumns = "auto 1fr auto";

            {
                // Key

                this.createLabel(comp, "Key");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getPackItem().getKey();
                });

                this.createButton(comp, "Open", () => {

                    const item = this.getPackItem();

                    const file = item.getPack().getFile();

                    const editor = colibri.Platform.getWorkbench().openEditor(file) as pack.ui.editor.AssetPackEditor;

                    editor.revealKey(item.getKey());
                });
            }
        }

        private getPackItem() {

            const obj = this.getSelectionFirstElement();

            if (obj instanceof core.AssetPackImageFrame) {

                return obj.getPackItem();
            }

            return obj;
        }

        canEdit(obj: any): boolean {

            return obj instanceof core.AssetPackItem || obj instanceof core.AssetPackImageFrame;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }

    }

}