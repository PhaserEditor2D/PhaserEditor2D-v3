namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddFileToPackFileSection extends controls.properties.PropertySection<io.FilePath> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AddFileToPackFileSection", "Asset Pack Entry", false);
        }

        private async getPackItems(finder: core.PackFinder) {

            const packItems: core.AssetPackItem[] = [];

            for (const file of this.getSelection()) {

                const items = await finder.findPackItemsFor(file);

                packItems.push(...items);
            }

            return packItems;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            this.addUpdater(async () => {

                comp.innerHTML = "";

                const finder = new core.PackFinder();

                await finder.preload();

                await this.buildImportButtons(finder, comp);

                await this.buildOpenButtons(finder, comp);
            });
        }

        private async buildOpenButtons(finder: core.PackFinder, comp: HTMLDivElement) {

            const packItems = await this.getPackItems(finder);

            const used = new Set();

            for (const item of packItems) {

                const btn = document.createElement("button");

                const key = item.getKey();
                const packName = item.getPack().getFile().getName();
                const packPath = item.getPack().getFile().getProjectRelativeName();
                const hash = `${key}@${packPath}`;

                if (used.has(hash)) {

                    continue;
                }

                used.add(hash);

                btn.innerHTML =
                    `Open ${key} at ${packName}`;

                btn.addEventListener("click", async (e) => {

                    const editor = colibri.Platform.getWorkbench()
                        .openEditor(item.getPack().getFile()) as editor.AssetPackEditor;

                    editor.revealKey(item.getKey());
                });

                comp.appendChild(btn);
            }
        }

        private async buildImportButtons(finder: core.PackFinder, comp: HTMLDivElement) {

            const importersData = await this.buildImportersData(finder);

            for (const importerData of importersData) {

                const btn = document.createElement("button");

                const importDesc = importerData.files.length === 1 ?
                    importerData.files[0].getName() : importerData.files.length.toString();

                btn.innerText = `Import as ${importerData.importer.getType()} (${importDesc})`;

                btn.addEventListener("click", async (e) => {

                    const packs = finder.getPacks();

                    const menu = new controls.Menu();

                    for (const pack of packs) {

                        const validFiles = importerData.files
                            .filter(file => {

                                const publicRoot = colibri.ui.ide.FileUtils.getPublicRoot(pack.getFile().getParent());

                                return file.getFullName().startsWith(publicRoot.getFullName());
                            });

                        menu.add(new controls.Action({
                            text: "Add To " + pack.getFile().getProjectRelativeName(),
                            enabled: validFiles.length > 0,
                            callback: () => {

                                this.importWithImporter(importerData, pack);
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

                                this.importWithImporter(importerData, pack);

                            });
                        }
                    }));

                    menu.createWithEvent(e);
                });

                comp.appendChild(btn);
            }
        }

        private async importWithImporter(importData: editor.IImportData, pack: core.AssetPack) {

            const packFile = pack.getFile();

            const importer = importData.importer;

            await importer.autoImport(pack, importData.files);

            const newContent = JSON.stringify(pack.toJSON(), null, 4);

            await colibri.ui.ide.FileUtils.setFileString_async(packFile, newContent);

            this.updateWithSelection();

            blocks.BlocksPlugin.getInstance().refreshBlocksView();
        }

        private async buildImportersData(finder: core.PackFinder) {

            const importList: editor.IImportData[] = [];

            const selection: io.FilePath[] = [];

            for (const file of this.getSelection()) {

                const items = await finder.findPackItemsFor(file);

                if (items.length === 0) {

                    selection.push(file);
                }
            }

            for (const importer of importers.Importers.getAll()) {

                const files = selection.filter(file => importer.acceptFile(file));

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

            return n > 0;

            // if (n > 0) {

            //     const list = this.buildImportList();

            //     return list.length > 0;
            // }

            // return false;
        }
    }
}