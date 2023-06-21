namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class BrowseUserComponentsDialog extends controls.dialogs.ViewerDialog {

        private static createViewer(editor: ui.editor.SceneEditor) {

            const viewer = new controls.viewers.TreeViewer("BrowseScriptsDialog");

            viewer.setLabelProvider(new ui.editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setStyledLabelProvider(new ui.editor.outline.SceneEditorOutlineStyledLabelProvider());
            viewer.setCellRendererProvider(new ui.editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setContentProvider(new UserCompponentsDialogContentProvider(editor));
            viewer.setInput([])
            viewer.expandRoots();

            return viewer;
        }

        private _editor: ui.editor.SceneEditor;

        constructor(editor: ui.editor.SceneEditor) {
            super(BrowseUserComponentsDialog.createViewer(editor), true);

            this._editor = editor;
        }

        create(): void {

            super.create();

            this.setTitle("Browse User Components");

            this.addOpenButton("Select", sel => {

                const selSet = new Set(sel.map(obj => {

                    if (obj instanceof sceneobjects.UserComponentNode) {

                        return obj.getObject()
                    }

                    return obj;
                }));


                this._editor.setSelection([...selSet]);
            });

            this.addCancelButton();
        }
    }

    class UserCompponentsDialogContentProvider extends ui.editor.outline.SceneEditorOutlineContentProvider {

        constructor(editor: ui.editor.SceneEditor) {
            super(editor, true);
        }

        getRoots(input: any): any[] {

            return [this._editor.getScene().sys.displayList];
        }

        getChildren(parent: any): any[] {

            const children = super.getChildren(parent);

            let result = [];

            for (const obj of children) {

                if (obj instanceof sceneobjects.UserComponentNode) {

                    result.push(obj);

                } else if (isGameObject(obj)) {

                    if (this.hasUserComponents(obj)) {

                        result.push(obj);
                    }
                }
            }

            return result;
        }

        private hasUserComponents(obj: ISceneGameObject) {

            let result = obj.getEditorSupport().getUserComponentsComponent()
                .getUserComponentNodes().length > 0;

            if (!result) {

                const children = super.getChildren(obj);

                for (const child of children) {

                    if (isGameObject(child)) {

                        result = this.hasUserComponents(child);

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