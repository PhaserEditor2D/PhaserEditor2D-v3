namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class BlocksSection extends controls.properties.PropertySection<core.AssetPack> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "id", "Blocks", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            const check = this.createCheckbox(comp, this.createLabel(comp, "Show All Files In Project"));

            check.addEventListener("change", () => {

                this.getSelectionFirstElement().setShowAllFilesInBlocks(check.checked);
                const editor = colibri.Platform.getWorkbench().getActiveEditor() as AssetPackEditor;
                editor.refreshBlocks();
                editor.setDirty(true);
            });

            this.addUpdater(() => {

                check.checked = this.getSelectionFirstElement().isShowAllFilesInBlocks();
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof core.AssetPack;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}