namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddScriptDialog extends controls.dialogs.ViewerDialog {

        private static createViewer() {

            const viewer = new controls.viewers.TreeViewer("AddScriptsDialog");
            viewer.setStyledLabelProvider(new ScriptStyledLabelProvider());
            viewer.setLabelProvider(new controls.viewers.LabelProviderFromStyledLabelProvider(viewer.getStyledLabelProvider()));
            viewer.setContentProvider(new ScriptsContentProvider);
            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => {

                        let icon = resources.getIcon(resources.ICON_BUILD);

                        if (e instanceof io.FilePath && e.isFolder()) {

                            icon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
                        }

                        return new controls.viewers.IconImageCellRenderer(icon)
                    }));

            viewer.setInput([]);

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
                }), (obj: io.FilePath | ScriptNodeExtension) => {

                    return obj instanceof ScriptNodeExtension || obj.isFile();
                });

            this.addCancelButton();
        }

        addScript(script: any) {

            this._editor.getUndoManager().add(
                new ui.editor.undo.CreateObjectWithAssetOperation(this._editor, [script], 0, 0));
        }
    }
}