namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class AddFileToPackFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AddFileToPackFileSection", "Asset Pack File", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            this.addUpdater(async () => {

                const finder = new core.PackFinder();

                await finder.preload();

                const packItems: core.AssetPackItem[] = [];

                for (const file of this.getSelection()) {

                    const items = await finder.findPackItemsFor(file);

                    packItems.push(...items);
                }

               comp.innerHTML = "";

                for (const item of packItems) {

                    const btn = document.createElement("button");

                    btn.innerHTML =
                        `${item.getKey()} at ${item.getPack().getFile().getProjectRelativeName()}`;

                    btn.addEventListener("click", async (e) => {

                        const editor = colibri.Platform.getWorkbench()
                            .openEditor(item.getPack().getFile()) as editor.AssetPackEditor;

                        editor.revealKey(item.getKey());
                    });

                    comp.appendChild(btn);
                }

                if (packItems.length === 0) {

                    const importList = this.buildImportList();

                    for (const importData of importList) {

                        const btn = document.createElement("button");

                        btn.innerText = `Import ${importData.importer.getType()} (${importData.files.length})`;

                        btn.addEventListener("click", async (e) => {

                            const packs = finder.getPacks();

                            const menu = new controls.Menu();

                            for (const pack of packs) {

                                menu.add(new controls.Action({
                                    text: "Add To " + pack.getFile().getProjectRelativeName(),
                                    callback: () => {

                                        this.importWithImporter(importData, pack);
                                    }
                                }));
                            }

                            menu.add(new controls.Action({
                                text: "Add To New Pack File",
                                callback: () => {

                                    const ext = new pack.ui.dialogs.NewAssetPackFileWizardExtension();

                                    const dlg = ext.createDialog({
                                        initialFileLocation: this.getSelectionFirstElement().getParent()
                                    });

                                    dlg.setTitle("New " + ext.getDialogName());

                                    const callback = dlg.getFileCreatedCallback();

                                    dlg.setFileCreatedCallback(async (file) => {

                                        await callback(file);

                                        const content = colibri.ui.ide.FileUtils.getFileString(file);

                                        const pack = new core.AssetPack(file, content);

                                        this.importWithImporter(importData, pack);

                                    });
                                }
                            }));

                            menu.createWithEvent(e);
                        });

                        comp.appendChild(btn);
                    }
                }
            });
        }

        private async importWithImporter(importData: editor.IImportData, pack: core.AssetPack) {

            const packFile = pack.getFile();

            const importer = importData.importer;

            for (const file of importData.files) {

                importer.importFile(pack, file);
            }

            const newContent = JSON.stringify(pack.toJSON(), null, 4);

            await colibri.ui.ide.FileUtils.setFileString_async(packFile, newContent);

            this.updateWithSelection();

            blocks.BlocksPlugin.getInstance().refreshBlocksView();
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