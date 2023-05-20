namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ScenePlainObjectVariableSection extends editor.properties.BaseSceneSection<IScenePlainObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ScenePlainObjectVariableSection", "Variable", false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.performChange(objects => {

                        const obj = objects[0];

                        obj.getEditorSupport().setLabel(text.value);
                    });
                });

                this.addUpdater(() => {

                    text.readOnly = this.getSelection().length !== 1;
                    text.value = this.flatValues_StringJoinDifferent(
                        this.getSelection().map(obj => obj.getEditorSupport().getLabel()))
                });
            }

            {
                // Type

                this.createLabel(comp, "Type");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoinDifferent(
                        this.getSelection().map(obj => obj.getEditorSupport().getExtension().getTypeName()));
                });
            }

            {
                // Scope

                this.createLabel(comp, "Scope", "The lexical scope of the object.");

                const items = [
                    {
                        name: "LOCAL",
                        value: ObjectScope.LOCAL
                    },
                    {
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

                    this.performChange(objects => {

                        for (const obj of objects) {

                            const objES = obj.getEditorSupport();

                            objES.setScope(scope);
                        }
                    });
                });

                this.addUpdater(() => {

                    btn.textContent = this.flatValues_StringJoinDifferent(
                        this.getSelection().map(obj => {

                            const scope = obj.getEditorSupport().getScope();

                            return items.find(i => i.value === scope).name;
                        }));
                });
            }
        }

        private performChange(performChange: (objects: IScenePlainObject[]) => void) {

            this.getUndoManager().add(new ui.editor.undo.SceneSnapshotOperation(this.getEditor(), async () => {

                performChange(this.getSelection());
            }));
        }

        canEdit(obj: any, n: number): boolean {

            return ScenePlainObjectEditorSupport.hasEditorSupport(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}