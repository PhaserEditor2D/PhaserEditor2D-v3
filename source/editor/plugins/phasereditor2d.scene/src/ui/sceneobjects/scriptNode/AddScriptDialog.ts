namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddScriptDialog extends controls.dialogs.ViewerDialog {

        private static createViewer() {

            const viewer = new controls.viewers.TreeViewer("AddScriptsDialog");
            viewer.setLabelProvider(new controls.viewers.LabelProvider((file: colibri.core.io.FilePath) => {
                return file.getNameWithoutExtension();
            }));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => new controls.viewers.IconImageCellRenderer(
                        ScenePlugin.getInstance().getIcon(ICON_BUILD))));

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const input = finder.getScriptPrefabFiles();

            viewer.setInput(input);

            return viewer;
        }

        private _editor: ui.editor.SceneEditor;

        constructor(editor: ui.editor.SceneEditor) {
            super(AddScriptDialog.createViewer(), false);

            this._editor = editor;
        }

        create(): void {

            super.create();

            this.setTitle("Add Script");

            this.enableButtonOnlyWhenOneElementIsSelected(
                this.addOpenButton("Add Script", sel => {

                    this.addScript(sel[0]);

                }));

            this.addCancelButton();
        }

        addScript(script: io.FilePath) {

            this._editor.getUndoManager().add(
                new ui.editor.undo.CreateObjectWithAssetOperation(this._editor, [script], 0, 0));
        }
    }
}