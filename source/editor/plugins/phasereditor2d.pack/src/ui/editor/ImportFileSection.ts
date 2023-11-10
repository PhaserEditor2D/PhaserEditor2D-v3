namespace phasereditor2d.pack.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class ImportFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.ImportFileSection", "Asset Pack Entry", false);
        }

        createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 1);

            this.addUpdater(() => {

                while (comp.children.length > 0) {

                    comp.children.item(0).remove();
                }

                const importList: IImportData[] = [];

                for (const importer of importers.Importers.getAll()) {

                    const files = this.getSelection().filter(file => importer.acceptFile(file));

                    if (files.length > 0) {

                        importList.push({
                            importer: importer,
                            files: files
                        });
                    }
                }

                for (const importData of importList) {

                    const btn = document.createElement("button");

                    btn.innerText = `Import as ${importData.importer.getType()} (${importData.files.length})`;

                    btn.addEventListener("click", async (e) => {

                        const editor = ide.Workbench.getWorkbench().getActiveEditor() as AssetPackEditor;

                        await editor.importData_async(importData);
                    });

                    comp.appendChild(btn);
                }
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof io.FilePath && obj.isFile();
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}