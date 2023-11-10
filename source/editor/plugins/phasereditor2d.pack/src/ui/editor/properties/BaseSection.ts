namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export abstract class BaseSection extends controls.properties.PropertySection<core.AssetPackItem> {

        private _assetType: string;

        constructor(page: controls.properties.PropertyPage, id: string, title: string, assetType?: string, fillSpace?: boolean) {
            super(page, id, title, fillSpace);

            this._assetType = assetType;
        }

        getPack() {

            return (this.getSelectionFirstElement() as core.AssetPackItem).getPack();
        }

        getAssetType() {
            return null;
        }

        hasMenu() {

            return true;
        }

        createMenu(menu: controls.Menu) {

            let type = this.getAssetType();

            if (!type) {

                type = this._assetType;
            }

            if (type) {

                menu.addAction({
                    text: "Help",
                    callback: () => {
                        controls.Controls.openUrlInNewPage(
                            "http://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#" + type + "__anchor");
                    }
                });
            }
        }

        getEditor() {
            return ide.Workbench.getWorkbench().getActiveEditor() as AssetPackEditor;
        }

        changeItemField(key: string, value: any, updateSelection: boolean = false) {

            if (Number.isNaN(value)) {

                this.updateWithSelection();

                return;
            }

            this.getEditor().getUndoManager().add(
                new undo.ChangeItemFieldOperation(this.getEditor(), this.getSelection(), key, value, updateSelection)
            );
        }

        canEdit(obj: any, n: number) {
            return obj instanceof core.AssetPackItem && n === 1;
        }

        canEditNumber(n: number) {
            return n === 1;
        }

        async browseFile_onlyContentType(
            title: string, contentType: string, selectionCallback: (files: io.FilePath[]) => void) {

            this.browseFile(title, f => {

                const type = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(f);

                return type === contentType;

            }, selectionCallback);
        }

        async browseFile(title: string, fileFilter: (file: io.FilePath) => boolean,
            selectionCallback: (files: io.FilePath[]) => void) {

            const viewer = await this.getEditor().createFilesViewer(fileFilter);

            const dlg = new controls.dialogs.ViewerDialog(viewer, true);

            dlg.create();

            dlg.setTitle(title);

            {
                const btn = dlg.addButton("Select", () => {
                    selectionCallback(viewer.getSelection());
                    dlg.close();
                });

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    btn.disabled = viewer.getSelection().length === 0;
                });
            }

            dlg.addButton("Show All Files", () => {
                viewer.setInput(this.getEditor().getInput().getParent().flatTree([], false));
                viewer.repaint();
            });

            dlg.addButton("Cancel", () => {
                dlg.close();
            });

            viewer.eventOpenItem.addListener(async () => {

                selectionCallback([viewer.getSelection()[0]]);
                dlg.close();
            });
        }

        protected getHelp(helpKey: string) {
            return AssetPackPlugin.getInstance().getPhaserDocs().getDoc(helpKey);
        }

        protected createFileField(
            comp: HTMLElement, label: string, fieldKey: string, contentType: string, helpKey?: string) {

            let tooltip: string;

            if (helpKey) {
                tooltip = this.getHelp(helpKey);
            }

            this.createLabel(comp, label, tooltip);

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const val = this.getSelection()[0].getData()[fieldKey];

                text.value = val === undefined ? "" : val;
            });

            const icon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
            
            this.createButton(comp, icon, () => {

                this.browseFile_onlyContentType("Select File", contentType, (files) => {

                    const file = files[0];

                    const url = this.getPack().getUrlFromAssetFile(file);

                    this.changeItemField(fieldKey, url, true);
                });
            });
        }

        protected createMultiFileField(
            comp: HTMLElement, label: string, fieldKey: string, contentType: string, helpKey?: string) {

            this.createLabel(comp, label, helpKey ? this.getHelp(helpKey) : undefined);

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const val = this.getSelection()[0].getData()[fieldKey];

                text.value = val === undefined ? "" : JSON.stringify(val);
            });

            this.createButton(comp, "Browse", () => {

                this.browseFile_onlyContentType("Select Files", contentType, (files) => {

                    const pack = this.getPack();

                    const urls = files.map(file => pack.getUrlFromAssetFile(file));

                    this.changeItemField(fieldKey, urls, true);
                });
            });
        }

        protected createSimpleTextField(parent: HTMLElement, label: string, field: string, helpKey?: string) {

            this.createLabel(parent, label, helpKey ? this.getHelp(helpKey) : undefined);

            const text = this.createText(parent, false);
            text.style.gridColumn = "2 / span 2";

            text.addEventListener("change", e => {
                this.changeItemField(field, text.value, true);
            });

            this.addUpdater(() => {
                const data = this.getSelection()[0].getData();
                text.value = colibri.core.json.getDataValue(data, field);
            });

            return text;
        }

        protected createSimpleIntegerField(parent: HTMLElement, label: string, field: string, helpKey?: string) {

            this.createLabel(parent, label, helpKey ? this.getHelp(helpKey) : undefined);

            const text = this.createText(parent, false);
            text.style.gridColumn = "2 / span 2";

            text.addEventListener("change", e => {

                const value = Number.parseInt(text.value, 10);

                if (isNaN(value)) {

                    this.updateWithSelection();

                } else {

                    this.changeItemField(field, value, true);
                }
            });

            this.addUpdater(() => {

                const data = this.getSelection()[0].getData();

                const value = colibri.core.json.getDataValue(data, field);

                text.value = value === undefined ? 0 : value;
            });

            return text;
        }
    }
}