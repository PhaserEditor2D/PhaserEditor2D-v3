namespace phasereditor2d.scene.ui.dialogs {

    import controls = colibri.ui.controls;

    export class AddObjectDialog extends controls.dialogs.ViewerDialog {

        static createViewer(editor: editor.SceneEditor): controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.dialogs.AddObjectDialog");

            viewer.setContentProvider(new AddObjectContentProvider(editor));
            viewer.setLabelProvider(new blocks.SceneEditorBlocksLabelProvider());
            viewer.setStyledLabelProvider(new blocks.SceneEditorBlocksStyledLabelProvider(editor));
            viewer.setCellRendererProvider(new blocks.SceneEditorBlocksCellRendererProvider());
            viewer.setInput([]);

            viewer.expandRoots(true);

            return viewer;
        }

        private _editor: editor.SceneEditor;

        constructor(editor: editor.SceneEditor) {
            super(AddObjectDialog.createViewer(editor), true);

            this._editor = editor;
        }

        create() {

            super.create();

            this.setTitle("Add Object");

            const addButton = this.addButton("Add Object", () => {

                const obj = this.getViewer().getSelectionFirstElement();

                this._editor.getDropManager().dropDataAtCenter([obj]);

                this.close();

            });

            const filter = obj => SCENE_OBJECT_CATEGORIES.indexOf(obj) < 0;

            this.enableButtonOnlyWhenOneElementIsSelected(addButton, filter);

            this.getViewer().setExpandWhenOpenParentItem();

            this.getViewer().eventOpenItem.addListener(obj => {

                if (filter(obj)) {

                    addButton.click();
                }
            });

            this.addCancelButton();
        }
    }

    class AddObjectContentProvider extends blocks.SceneEditorBlocksContentProvider {

        constructor(editor: editor.SceneEditor) {
            super(editor, () => []);
        }

        getRoots(input: any) {

            if (this._editor.getScene().isScriptNodePrefabScene()) {

                return [sceneobjects.ScriptNodeExtension.getInstance()];
            }

            return SCENE_OBJECT_CATEGORIES;
        }
    }
}