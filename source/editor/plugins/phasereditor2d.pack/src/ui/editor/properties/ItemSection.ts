/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ItemSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.ItemSection", "Key");
        }

        getAssetType() {

            return this.getSelectionFirstElement().getType();
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            const docs = AssetPackPlugin.getInstance().getPhaserDocs();

            {
                // Key

                this.createLabel(comp, "Key", "The key of the file");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.changeItemField("key", text.value, true);
                });

                this.addUpdater(() => {

                    text.value = this.getSelection()[0].getKey();
                });
            }
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof core.AssetPackItem;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}