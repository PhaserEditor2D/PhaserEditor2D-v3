namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddObjectDialog extends controls.dialogs.ViewerDialog {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super(new viewers.ObjectExtensionAndPrefabViewer());

            this._editor = editor;

            const size = this.getSize();
            this.setSize(size.width, size.height * 1.5);
        }

        create() {

            super.create();

            this.setTitle("Add Object");

            this.enableButtonOnlyWhenOneElementIsSelected(

                this.addOpenButton("Create", async (sel) => {

                    const type = sel[0];

                    const maker = this._editor.getSceneMaker();

                    let obj;

                    if (type instanceof io.FilePath) {

                        obj = await maker.createPrefabInstanceWithFile(type);

                    } else {

                        obj = maker.createEmptyObject(type);
                    }

                    this._editor.setSelection([obj]);
                    this._editor.setDirty(true);
                    this._editor.refreshDependenciesHash();

                    this._editor.getUndoManager().add(new undo.AddObjectsOperation(this._editor, [obj]));
                }));

            this.addCancelButton();
        }
    }
}