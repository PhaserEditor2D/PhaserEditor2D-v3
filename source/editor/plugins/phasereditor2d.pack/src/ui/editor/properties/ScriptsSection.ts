namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ScriptsSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties", "Scripts", core.SCRIPTS_TYPE, true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);
            comp.style.gridTemplateRows = "1fr auto";

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.pack.ui.editor.properties.ScriptSection");
            viewer.setCellRendererProvider(new ui.viewers.AssetPackCellRendererProvider("tree"));
            viewer.setLabelProvider(new controls.viewers.LabelProvider(obj => obj));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setInput([]);

            const filteredViewer = new colibri.ui.ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, false);
            comp.appendChild(filteredViewer.getElement());

            this.addUpdater(async () => {

                viewer.setInput([]);
                viewer.repaint();

                viewer.setInput(this.getPackItem().getUrls());
                filteredViewer.resizeTo();
            });

            const btnPanel = document.createElement("div");
            btnPanel.classList.add("PropertyButtonPanel");

            {
                const listener = () => {

                    this.performChanges(urls => {

                        const selected = new Set(viewer.getSelection());

                        return urls.filter(url => !selected.has(url));
                    });
                };

                const btn = this.createButton(btnPanel, "Delete", listener);

                viewer.eventDeletePressed.addListener(listener);

                viewer.eventSelectionChanged.addListener(() => {
                    btn.disabled = viewer.getSelection().length === 0;
                });

                btn.disabled = true;

                btnPanel.appendChild(btn);
            }

            btnPanel.appendChild(this.createButton(btnPanel, "Add Scripts", () => {

                this.browseFile_onlyContentType("Scripts", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, files => {

                    const pack = this.getPack();

                    this.performChanges(urls => {

                        const used = new Set(urls);

                        const newUrls = files

                            .map(file => pack.getUrlFromAssetFile(file))

                            .filter(url => !used.has(url));

                        urls.push(...newUrls);

                        viewer.setSelection(newUrls);

                        return urls;
                    });

                    this.updateWithSelection();
                });
            }));

            {
                const btn = this.createButton(btnPanel, "Move Down", () => {

                    this.performChanges(urls => {

                        const selectionSel = new Set(viewer.getSelection());

                        for (let i = urls.length - 1; i >= 0; i--) {

                            const url = urls[i];

                            if (selectionSel.has(url)) {

                                if (i === urls.length - 1) {
                                    break;
                                }

                                const temp = urls[i + 1];
                                urls[i + 1] = url;
                                urls[i] = temp;
                            }
                        }

                        return urls;
                    });
                });

                btnPanel.appendChild(btn);

                viewer.eventSelectionChanged.addListener(() => {

                    const selected = new Set(viewer.getSelection());

                    btn.disabled = selected.size === 0;

                    const urls = this.getPackItem().getUrls();

                    if (urls.length === 0 || selected.has(urls[urls.length - 1])) {

                        btn.disabled = true;
                    }
                });

                btn.disabled = true;
            }

            {
                const btn = this.createButton(btnPanel, "Move Up", () => {

                    this.performChanges(urls => {

                        const selectionSel = new Set(viewer.getSelection());

                        for (let i = 0; i < urls.length; i++) {

                            const url = urls[i];

                            if (selectionSel.has(url)) {

                                if (i === 0) {
                                    break;
                                }

                                const temp = urls[i - 1];
                                urls[i - 1] = url;
                                urls[i] = temp;
                            }
                        }

                        return urls;
                    });

                    setTimeout(() => viewer.setSelection(viewer.getSelection()), 10);
                });

                viewer.eventSelectionChanged.addListener(() => {

                    const selected = new Set(viewer.getSelection());

                    btn.disabled = selected.size === 0;

                    const urls = this.getPackItem().getUrls();

                    if (urls.length === 0 || selected.has(urls[0])) {

                        btn.disabled = true;
                    }
                });

                btn.disabled = true;

                btnPanel.appendChild(btn);
            }

            comp.appendChild(btnPanel);
        }

        private performChanges(operation: (urls: string[]) => string[]) {

            const item = this.getPackItem();

            const urls = operation([...item.getUrls()]);

            this.getEditor().getUndoManager().add(
                new undo.ChangeItemFieldOperation(this.getEditor(), this.getSelection(), "url", urls, true)
            );
        }

        getPackItem() {

            return (this.getSelectionFirstElement() as core.ScriptsAssetPackItem)
        }

        canEdit(obj: any, n: number) {

            return obj instanceof core.ScriptsAssetPackItem;
        }

        canEditNumber(n: number) {

            return n === 1;
        }
    }
}