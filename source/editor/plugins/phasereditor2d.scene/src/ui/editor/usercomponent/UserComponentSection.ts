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

                    this.runOperation(() => {

                        this.getSelectionFirstElement().setName(text.value);
                    });
                });

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().getName();
                });
            }

            {
                // Base Class

                this.createLabel(comp, "Super Class", "Name of the super class of the component. It is optional.");

                const text = this.createText(comp);

                text.addEventListener("change", e => {

                    this.runOperation(() => {

                        this.getSelectionFirstElement().setSuperClass(text.value);
                    });
                });

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().getSuperClass();
                });
            }
        }

        getEditor() {

            return colibri.Platform.getWorkbench()
                .getActiveWindow().getEditorArea()
                .getSelectedEditor() as UserComponentsEditor;
        }

        runOperation(action: (props?: sceneobjects.UserProperties) => void, updateSelection?: boolean) {

            const editor = this.getEditor();

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(editor);

            action(this.getSelectionFirstElement().getProperties());

            const after = UserComponentsEditorSnapshotOperation.takeSnapshot(editor);

            editor.getUndoManager().add(new UserComponentsEditorSnapshotOperation(editor, before, after));

            editor.setDirty(true);
            editor.getViewer().repaint();

            if (updateSelection) {

                this.updateWithSelection();
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof UserComponent;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}