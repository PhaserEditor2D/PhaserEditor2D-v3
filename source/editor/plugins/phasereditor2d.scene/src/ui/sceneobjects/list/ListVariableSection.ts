namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ListVariableSection extends editor.properties.BaseSceneSection<ObjectList> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ListVariableSection", "Variable", false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.performChange(list => {
                        list.setLabel(text.value);
                    });
                });

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().getLabel();
                });
            }

            {
                // Type

                this.createLabel(comp, "Type");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    const map = this.getEditor().getScene().buildObjectIdMap();

                    text.value = this.getSelectionFirstElement().inferType(map);
                });
            }

            {
                // Scope

                this.createLabel(comp, "Scope", "The lexical scope of the object.");

                // I skip the LOCAL scope here because a List without a variable
                // has no sense
                const items = [{
                    name: "METHOD",
                    value: ObjectScope.METHOD
                }, {
                    name: "CLASS",
                    value: ObjectScope.CLASS
                }, {
                    name: "PUBLIC",
                    value: ObjectScope.PUBLIC
                }];

                const btn = this.createMenuButton(comp, "", () => items, scope => {

                    this.performChange(list => {

                        list.setScope(scope);
                    });
                });

                this.addUpdater(() => {

                    btn.textContent = items
                        .find(item => item.value === this.getSelectionFirstElement().getScope())
                        .name;
                });
            }
        }

        private performChange(performChange: (list: ObjectList) => void) {
            this.getUndoManager().add(
                new ChangeListOperation(this.getEditor(),
                    this.getSelectionFirstElement(),
                    performChange)
            );
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof ObjectList;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}