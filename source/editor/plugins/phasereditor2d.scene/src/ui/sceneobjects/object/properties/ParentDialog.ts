namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ParentDialog extends controls.dialogs.ViewerDialog {

        private _editor: editor.SceneEditor;

        constructor(editor: editor.SceneEditor) {
            super(new controls.viewers.TreeViewer());

            this._editor = editor;
        }

        create() {

            const viewer = this.getViewer();
            viewer.setLabelProvider(new editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setCellRendererProvider(new editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            const input: any[] = [this._editor.getScene().sys.displayList];

            {
                const sel = this._editor.getSelectedGameObjects();

                this._editor.getScene().visit(obj => {

                    if (obj instanceof Container) {

                        const owner = obj.getEditorSupport().getOwnerPrefabInstance();

                        if (!owner) {

                            if (MoveToContainerOperation.canMoveAllTo(sel, obj)) {

                                input.push(obj);
                            }
                        }
                    }
                });
            }

            viewer.setInput(input);

            super.create();

            this.setTitle("Parent");

            this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Move", sel => {

                const parent = sel[0];

                if (parent instanceof Phaser.GameObjects.DisplayList) {

                    this._editor.getUndoManager().add(new MoveToContainerOperation(this._editor));

                } else {

                    this._editor.getUndoManager().add(
                        new MoveToContainerOperation(this._editor,
                            (parent as Container).getEditorSupport().getId()));
                }
            }));

            this.addCancelButton();
        }
    }
}