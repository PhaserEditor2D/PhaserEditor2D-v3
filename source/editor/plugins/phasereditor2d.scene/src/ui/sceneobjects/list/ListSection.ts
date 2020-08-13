namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ListSection extends editor.properties.BaseSceneSection<ObjectList> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ListSection", "List", true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";
            comp.style.gridTemplateRows = "1fr auto";

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.ListSection");
            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);
            viewer.setLabelProvider(new editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setCellRendererProvider(new editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            const filteredViewer = new colibri.ui.ide.properties
                .FilteredViewerInPropertySection(this.getPage(), viewer, true);
            comp.appendChild(filteredViewer.getElement());

            this.addUpdater(() => {

                const list = this.getSelectionFirstElement();

                const map = this.getEditor().getScene().buildObjectIdMap();

                const input = list.getObjectIds()
                    .map(id => map.get(id))
                    .filter(obj => obj !== undefined);

                viewer.setInput(input);
                viewer.setSelection([]);
            });

            const btnRow = document.createElement("div");

            comp.appendChild(btnRow);

            const selectBtn = this.createButton(btnRow, "Select In Scene", () => {

                this.getEditor().setSelection(viewer.getSelection());
            });
            selectBtn.style.float = "right";

            const removeBtn = this.createButton(btnRow, "Remove From List", () => {

                this.getUndoManager().add(
                    new RemoveObjectsFromListOperation(
                        this.getEditor(),
                        this.getSelectionFirstElement(),
                        viewer.getSelection())
                );

            });

            removeBtn.style.float = "right";
            removeBtn.style.marginRight = "5px";

            viewer.eventSelectionChanged.addListener(() => {

                selectBtn.disabled = removeBtn.disabled = viewer.getSelection().length === 0;
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof ObjectList;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }

    }
}