namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class BrowseScriptsDialog extends controls.dialogs.ViewerDialog {

        private static createViewer(editor: ui.editor.SceneEditor) {

            const viewer = new controls.viewers.TreeViewer("BrowseScriptsDialog");

            viewer.setLabelProvider(new ui.editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setStyledLabelProvider(new ui.editor.outline.SceneEditorOutlineStyledLabelProvider());
            viewer.setCellRendererProvider(new ui.editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setContentProvider(new ScriptDialogContentProvider(editor));
            viewer.setInput([])
            viewer.expandRoots();

            return viewer;
        }

        private _editor: ui.editor.SceneEditor;

        constructor(editor: ui.editor.SceneEditor) {
            super(BrowseScriptsDialog.createViewer(editor), true);

            this._editor = editor;
        }

        create(): void {

            super.create();

            this.setTitle("Browse Scripts");

            this.addOpenButton("Select", sel => {

                this._editor.setSelection(sel);
            });

            this.addCancelButton();
        }
    }

    class ScriptDialogContentProvider extends ui.editor.outline.SceneEditorOutlineContentProvider {

        getRoots(input: any): any[] {

            const sel = this._editor.getSelectedGameObjects();

            if (sel.length === 0) {

                return this._editor.getScene().getGameObjects();
            }

            return sel;
        }

        getChildren(parent: any): any[] {

            const children = super.getChildren(parent);

            let result = [];

            for (const obj of children) {

                if (obj instanceof ScriptNode) {

                    result.push(obj);

                } else if (isGameObject(obj)) {

                    if (this.hasUserComponentOrScriptNode(obj)) {

                        result.push(obj);
                    }
                }
            }

            return result;
        }

        private hasUserComponentOrScriptNode(obj: ISceneGameObject) {

            let result = obj.getEditorSupport().getObjectScriptNodes().length
                + obj.getEditorSupport().getUserComponentsComponent()
                    .getUserComponentNodes().length > 0;

            if (!result) {

                const children = super.getChildren(obj);

                for (const child of children) {

                    if (isGameObject(child)) {

                        if (child instanceof ScriptNode) {

                            return true;
                        }

                        result = this.hasUserComponentOrScriptNode(child);

                        if (result) {

                            return true;
                        }
                    }
                }
            }

            return result;
        }
    }
}