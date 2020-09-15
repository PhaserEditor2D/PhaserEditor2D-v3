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
            viewer.setSorted(false);
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                args => new controls.viewers.IconImageCellRenderer(
                    webContentTypes.WebContentTypesPlugin.getInstance()
                        .getIcon(webContentTypes.ICON_FILE_SCRIPT))));
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
            btnPanel.appendChild(this.createButton(btnPanel, "Delete", () => { }));
            btnPanel.appendChild(this.createButton(btnPanel, "Add", () => {
            }));
            btnPanel.appendChild(this.createButton(btnPanel, "Move Down", () => { }));
            btnPanel.appendChild(this.createButton(btnPanel, "Move Up", () => { }));

            comp.appendChild(btnPanel);
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