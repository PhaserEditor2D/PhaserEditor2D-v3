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
            viewer.setLabelProvider(new LabelProvider());
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

            this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Move", sel => {

                const parent = sel[0] as (Container | Layer);

                if (parent instanceof Phaser.GameObjects.DisplayList) {

                    this._editor.getUndoManager().add(new MoveToParentOperation(this._editor));

                } else {

                    this._editor.getUndoManager().add(
                        new MoveToParentOperation(this._editor,
                            parent.getEditorSupport().getId()));
                }
            }));

            this.addCancelButton();
        }
    }

    class LabelProvider extends editor.outline.SceneEditorOutlineLabelProvider {

        getLabel(obj: any): string {
            
            if (obj instanceof Phaser.GameObjects.DisplayList) {

                return "Scene";
            }

            return super.getLabel(obj);
        }
    }

    class ParentContentProvider implements controls.viewers.ITreeContentProvider {

        private _editor: ui.editor.SceneEditor;

        constructor(editor: ui.editor.SceneEditor) {

            this._editor = editor;
        }

        getRoots(input: Phaser.GameObjects.DisplayList): any[] {

            return [input];
        }

        getChildren(parent: any): any[] {

            if (parent instanceof Phaser.Structs.List) {

                return this.filterList(parent.list);
            }

            if (parent instanceof Phaser.GameObjects.DisplayList) {

                return this.filterList(parent.list);
            }

            if (parent instanceof Container) {

                return this.filterList(parent.list);
            }

            return [];
        }

        private filterList(list: any[]) {

            const sel = this._editor.getSelectedGameObjects();

            return list.filter(obj => {

                return MoveToParentOperation.canMoveAllTo(sel, obj);

            }).reverse();
        }
    }
}