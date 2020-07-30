namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentSection extends controls.properties.PropertySection<UserComponent> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.usercomponent.UserComponentSection", "Component", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name", "Name of the component. In the compiled code, it is used as file name and class name.");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.getEditor().runOperation(() => {

                        for (const comp1 of this.getSelection()) {

                            comp1.setName(text.value);
                        }
                    });
                });

                this.addUpdater(() => {

                    text.value = this.flatValues_StringOneOrNothing(
                        this.getSelection().map(c => c.getName()));

                    text.readOnly = this.getSelection().length > 1;
                });
            }

            {
                // Game Object Type

                this.createLabel(comp, "Game Object Type", "Name of the type of the Game Object that this component can be added on.");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.getEditor().runOperation(() => {

                        for (const comp1 of this.getSelection()) {

                            comp1.setGameObjectType(text.value);
                        }
                    });
                });

                this.addUpdater(() => {

                    text.value = this.flatValues_StringOneOrNothing(
                        this.getSelection().map(c => c.getGameObjectType()));
                });
            }

            {
                // Super Class

                this.createLabel(comp, "Super Class", "Name of the super class of the component. It is optional.");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.getEditor().runOperation(() => {

                        for (const comp1 of this.getSelection()) {

                            comp1.setBaseClass(text.value);
                        }
                    });
                });

                this.addUpdater(() => {

                    text.value = this.flatValues_StringOneOrNothing(
                        this.getSelection().map(c => c.getBaseClass()));
                });
            }
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof UserComponent;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}