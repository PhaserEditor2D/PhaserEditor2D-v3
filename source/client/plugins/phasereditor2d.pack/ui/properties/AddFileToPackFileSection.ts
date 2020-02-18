namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class AddFileToPackFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AddFileToPackFileSection", "Asset Pack File", false);
        }

        protected createForm(parent: HTMLDivElement) {

            console.log("addUpdater " + this.getId());

            const comp = this.createGridElement(parent, 1);

            this.addUpdater(async () => {

                const finder = new core.PackFinder();

                await finder.preload();

                const packFiles = new Set<io.FilePath>();

                for (const file of this.getSelection()) {

                    const parentPacks = await finder.findPacksFor(file);

                    for (const pack of parentPacks) {

                        packFiles.add(pack.getFile());
                    }
                }

                while (comp.children.length > 0) {

                    comp.children.item(0).remove();
                }

                for (const file of packFiles) {

                    const btn = document.createElement("button");

                    btn.innerHTML =
                        `Open "${file.getProjectRelativeName()}"`;

                    btn.addEventListener("click", async (e) => {

                        colibri.Platform.getWorkbench().openEditor(file);
                    });

                    comp.appendChild(btn);
                }

                if (packFiles.size === 0) {

                    const importList = this.buildImportList();

                    for (const importData of importList) {

                        const btn = document.createElement("button");

                        btn.innerText = `Import ${importData.importer.getType()} (${importData.files.length})`;

                        btn.addEventListener("click", async (e) => {

                            //const editor = ide.Workbench.getWorkbench().getActiveEditor() as AssetPackEditor;

                            // await editor.importData_async(importData);
                        });

                        comp.appendChild(btn);
                    }
                }
            });
        }

        private buildImportList() {

            const importList: editor.IImportData[] = [];

            for (const importer of importers.Importers.getAll()) {

                const files = this.getSelection().filter(file => importer.acceptFile(file));

                if (files.length > 0) {

                    importList.push({
                        importer: importer,
                        files: files
                    });
                }
            }

            return importList;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof io.FilePath && obj.isFile();
        }

        canEditNumber(n: number): boolean {

            for (const obj of this.getSelection()) {

                if (!(obj instanceof io.FilePath)) {

                    return false;
                }
            }

            if (n > 0) {

                const list = this.buildImportList();

                return list.length > 0;
            }

            return false;
        }
    }
}