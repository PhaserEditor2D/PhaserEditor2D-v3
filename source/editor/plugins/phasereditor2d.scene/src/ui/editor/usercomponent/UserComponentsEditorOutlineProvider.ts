namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    class OutlineContentProvider implements controls.viewers.ITreeContentProvider {

        private _editor: UserComponentsEditor;

        constructor(editor: UserComponentsEditor) {

            this._editor = editor;
        }

        getRoots(input: UserComponentsModel): any[] {

            return [...new Set(input.getComponents().map(c => c.getGameObjectType()))];
        }

        getChildren(parent: any): any[] {

            return this._editor.getModel().getComponents().filter(c => c.getGameObjectType() === parent);
        }
    }

    export class UserComponentsEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: UserComponentsEditor;

        constructor(editor: UserComponentsEditor) {
            super();

            this._editor = editor;
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {

            return new OutlineContentProvider(this._editor);
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new controls.viewers.LabelProvider(obj => {

                return obj instanceof UserComponent ? obj.getDisplayNameOrName() : obj as string;
            });
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new controls.viewers.EmptyCellRendererProvider(
                obj => new controls.viewers.IconImageCellRenderer(resources.getIcon(
                    obj instanceof UserComponent ?
                        resources.ICON_USER_COMPONENT : resources.ICON_GROUP
                ))
            );
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer {

            return new controls.viewers.TreeViewerRenderer(viewer);
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {

            return this._editor.getPropertyProvider();
        }

        getInput() {
            return this._editor.getModel();
        }

        preload(complete?: boolean): Promise<void> {

            return Promise.resolve();
        }

        getUndoManager() {

            return this._editor.getUndoManager();
        }

        onViewerSelectionChanged(selection: any[]) {

            const viewer = this._editor.getViewer();

            viewer.setSelection(selection);
            viewer.reveal(...selection);
            viewer.repaint();
        }

        fillContextMenu(menu: controls.Menu) {

            this._editor.fillContextMenu(menu);
        }
    }
}