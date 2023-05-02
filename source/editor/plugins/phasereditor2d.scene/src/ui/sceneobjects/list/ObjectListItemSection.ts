namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectListItemSection extends editor.properties.BaseSceneSection<ObjectListItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ObjectListItemSection", "List Item");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Name", "The object's name.");

                const field = this.createText(comp, true);

                this.addUpdater(() => {

                    const labels = this.getSelectedGameObjects()

                        .map(obj => obj.getEditorSupport().getLabel());

                    field.value = this.flatValues_StringOneOrNothing(labels);
                });
            }

            {
                const btn = this.createButton(comp, "Select Game Object", () => {

                    this.getEditor().setSelection(this.getSelectedGameObjects());
                });

                btn.style.gridColumn = "1 / span 2";
            }
        }

        private getSelectedGameObjects() {

            const map = this.getEditor().getScene().buildObjectIdMap();

            return this.getSelection()

                .map(item => item.getObjectId())

                .map(id => map.get(id))

                .filter(obj => Boolean(obj));
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof ObjectListItem;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}