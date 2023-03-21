namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ParentDialog extends controls.dialogs.ViewerDialog {

        private _editor: editor.SceneEditor;

        constructor(editor: editor.SceneEditor) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.ParentDialog"), false);

            this._editor = editor;
        }

        create() {

            const viewer = this.getViewer();
            viewer.setLabelProvider(new editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setStyledLabelProvider(new editor.outline.SceneEditorOutlineStyledLabelProvider());
            viewer.setCellRendererProvider(new editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setContentProvider(new ParentContentProvider(this._editor));

            if (this._editor.getScene().isPrefabSceneType()) {

                const obj = this._editor.getScene().getPrefabObject();

                if (obj instanceof Phaser.GameObjects.Container || obj instanceof Phaser.GameObjects.Layer) {

                    viewer.setInput(obj);

                } else {

                    viewer.setInput([]);
                }

            } else {

                viewer.setInput(this._editor.getScene().sys.displayList);
            }

            viewer.setExpanded(viewer.getInput(), true);

            super.create();

            this.setTitle("Parent");

            const btn = this.addOpenButton("Move", sel => {

                const parent = sel[0] as (Container | Layer);

                if (parent instanceof Phaser.GameObjects.DisplayList) {

                    this._editor.getUndoManager().add(new MoveToParentOperation(this._editor));

                } else {

                    this._editor.getUndoManager().add(
                        new MoveToParentOperation(this._editor,
                            parent.getEditorSupport().getId()));
                }
            });

            this.enableButtonOnlyWhenOneElementIsSelected(btn, dstObj => {

                const editorSelection = this._editor.getSelectedGameObjects();

                for(const selObj of editorSelection) {

                    // cannot move a root obj to the display list
                    if (dstObj instanceof Phaser.GameObjects.DisplayList) {

                        if (dstObj.exists(selObj)) {

                            return false;
                        }

                        return true;
                    }

                    const selObjParent = selObj.getEditorSupport().getObjectParent();

                    if (dstObj === selObjParent) {
                        // cannot move the obj to its own parent
                        return false;
                    }

                    if (selObj instanceof ScriptNode) {
                        // you can move a script node to any object in the dialog
                        return true;
                    }

                    if (isGameObject(dstObj)) {

                        const dstObjES = (dstObj as ISceneGameObject).getEditorSupport();

                        if (dstObjES.isPrefabInstance() && !dstObjES.isAllowAppendChildren()) {
                            // you cannot move an object to a parent
                            // who is not allowing adding more children
                            return false;
                        }
                    }
                }

                return true;
            });

            this.addCancelButton();
        }
    }

    class ParentContentProvider extends ui.editor.outline.SceneEditorOutlineContentProvider {

        private _selection: ISceneGameObject[];

        constructor(editor: ui.editor.SceneEditor) {
            super(editor);

            this._selection = editor.getSelectedGameObjects();
        }

        getRoots(input: any): any[] {

            return [this._editor.getScene().children];
        }

        getChildren(parent: any): any[] {

            let children = super.getChildren(parent);

            children = children.filter(dstObj => {

                // cannot add anything different to an scene or a game object
                if (!isGameObject(dstObj) && !(dstObj instanceof Phaser.GameObjects.DisplayList)) {

                    return false;
                }

                for (const selObj of this._selection) {

                    // cannot move a layer to a container
                    if (selObj instanceof Layer && dstObj instanceof Container) {

                        return false;
                    }

                    // cannot add to itself or any's childlren
                    if (selObj === dstObj) {

                        return false;
                    }

                    // cannot add a non-script-node to a script node
                    if (dstObj instanceof ScriptNode && !(selObj instanceof ScriptNode)) {

                        return false;
                    }

                    // cannot add a non-script-node to a non-layer-or-container
                    if (!(dstObj instanceof Layer || dstObj instanceof Container) && !(selObj instanceof ScriptNode)) {

                        return false;
                    }

                    return true;
                }
            });

            return children;
        }
    }
}