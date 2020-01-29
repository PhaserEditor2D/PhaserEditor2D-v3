/// <reference path="../viewers/ObjectExtensionAndPrefabLabelProvider.ts"/>
/// <reference path="../viewers/ObjectExtensionAndPrefabViewer.ts"/>

namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AddObjectDialog extends controls.dialogs.ViewerDialog {

        static OBJECT_LIST_TYPE = "ObjectListType";

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super(new AddObjectDialogViewer());

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

                    if (type === AddObjectDialog.OBJECT_LIST_TYPE) {

                        // TODO: missing undo operation

                        const scene = this._editor.getScene();
                        const lists = scene.getObjectLists().getLists();

                        const newList = new sceneobjects.ObjectList();

                        const nameMaker = new colibri.ui.ide.utils.NameMaker(
                            (obj: sceneobjects.ObjectList) => obj.getLabel());

                        nameMaker.update(lists);

                        newList.setLabel(nameMaker.makeName("list"));

                        this._editor.getUndoManager().add(
                            new sceneobjects.AddObjectListOperation(this._editor, newList));

                    } else {

                        this._editor.getUndoManager().add(new undo.AddObjectOperation(this._editor, type));
                    }
                }));

            this.addCancelButton();
        }
    }

    class AddObjectDialogViewer extends viewers.ObjectExtensionAndPrefabViewer {

        constructor() {
            super();

            this.setLabelProvider(new class extends viewers.ObjectExtensionAndPrefabLabelProvider {

                getLabel(obj: any) {

                    if (obj === AddObjectDialog.OBJECT_LIST_TYPE) {
                        return "List";
                    }

                    return super.getLabel(obj);
                }
            }());

            this.setCellRendererProvider(new class extends viewers.ObjectExtensionAndPrefabCellRendererProvider {

                getCellRenderer(obj: any) {

                    if (obj === AddObjectDialog.OBJECT_LIST_TYPE) {

                        return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LIST));
                    }

                    return super.getCellRenderer(obj);
                }
            }());

            this.setContentProvider(new class extends viewers.ObjectExtensionAndPrefabContentProvider {

                getChildren(obj: any) {

                    if (obj === viewers.ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION) {

                        const list = [...super.getChildren(obj)];

                        list.push(AddObjectDialog.OBJECT_LIST_TYPE);

                        return list;
                    }

                    return super.getChildren(obj);
                }

            }());
        }
    }
}