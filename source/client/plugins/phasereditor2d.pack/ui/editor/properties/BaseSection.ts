namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export abstract class BaseSection extends controls.properties.PropertySection<core.AssetPackItem> {

        getEditor() {
            return <AssetPackEditor>ide.Workbench.getWorkbench().getActiveEditor();
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

        async browseFile_onlyContentType(title: string, contentType: string, selectionCallback: (files: io.FilePath[]) => void) {

            this.browseFile(title, f => {

                const type = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(f);

                return type === contentType;

            }, selectionCallback);
        }

        async browseFile(title: string, fileFilter: (file: io.FilePath) => boolean, selectionCallback: (files: io.FilePath[]) => void) {

            const viewer = await this.getEditor().createFilesViewer(fileFilter);

            const dlg = new controls.dialogs.ViewerDialog(viewer);

            dlg.create();

            dlg.setTitle(title);

            {
                const btn = dlg.addButton("Select", () => {
                    selectionCallback(viewer.getSelection());
                    dlg.close();
                });

                btn.disabled = true;

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
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

            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, async (e) => {
                selectionCallback([viewer.getSelection()[0]]);
                dlg.close();
            });
        }

        protected createFileField(comp: HTMLElement, label: string, fieldKey: string, contentType: string) {

            this.createLabel(comp, label);

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const val = this.getSelection()[0].getData()[fieldKey];

                text.value = val === undefined ? "" : val;
            });

            this.createButton(comp, "Browse", () => {

                this.browseFile_onlyContentType("Select File", contentType, (files) => {

                    const file = files[0];

                    const url = core.AssetPackUtils.getFilePackUrl(file);

                    this.changeItemField(fieldKey, url, true);

                });

            });
        }

        protected createMultiFileField(comp: HTMLElement, label: string, fieldKey: string, contentType: string) {

            this.createLabel(comp, label);

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const val = this.getSelection()[0].getData()[fieldKey];

                text.value = val === undefined ? "" : JSON.stringify(val);
            });

            this.createButton(comp, "Browse", () => {

                this.browseFile_onlyContentType("Select Files", contentType, (files) => {

                    const urls = files.map(file => core.AssetPackUtils.getFilePackUrl(file));

                    this.changeItemField(fieldKey, urls, true);
                });
            });
        }

        protected createSimpleTextField(parent: HTMLElement, label: string, field: string) {

            this.createLabel(parent, label);

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

        protected createSimpleIntegerField(parent: HTMLElement, label: string, field: string) {

            this.createLabel(parent, label);

            const text = this.createText(parent, false);
            text.style.gridColumn = "2 / span 2";

            text.addEventListener("change", e => {
                this.changeItemField(field, Number.parseInt(text.value), true);
            });

            this.addUpdater(() => {
                const data = this.getSelection()[0].getData();
                text.value = colibri.core.json.getDataValue(data, field);
            });

            return text;
        }
    }
}