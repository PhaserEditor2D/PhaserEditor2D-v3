namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddScriptDialog extends controls.dialogs.ViewerDialog {

        private static createViewer() {

            const viewer = new controls.viewers.TreeViewer("AddScriptsDialog");
            viewer.setLabelProvider(new controls.viewers.LabelProvider((obj: colibri.core.io.FilePath | ScriptNodeExtension) => {

                if (obj instanceof ScriptNodeExtension) {

                    return obj.getTypeName();
                }

                return obj.getNameWithoutExtension();
            }));
            viewer.setStyledLabelProvider(new (class s {
                getStyledTexts(obj: any, dark: boolean) {

                    let text: string;
                    let color: string;

                    if (obj instanceof ScriptNodeExtension) {

                        text = obj.getTypeName();
                        color = controls.Controls.getTheme().viewerForeground;

                    } else {

                        text = obj.getNameWithoutExtension();
                        color = ScenePlugin.getInstance().getPrefabColor();
                    }

                    return [{ text, color }];
                }
            }));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => new controls.viewers.IconImageCellRenderer(
                        icons.getIcon(icons.ICON_BUILD))));

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const input = [ScriptNodeExtension.getInstance(), ...finder.getScriptPrefabFiles()];

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

        addScript(script: any) {

            this._editor.getUndoManager().add(
                new ui.editor.undo.CreateObjectWithAssetOperation(this._editor, [script], 0, 0));
        }
    }
}