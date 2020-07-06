namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentsEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: UserComponentsEditor;

        constructor(editor: UserComponentsEditor) {
            super();

            this._editor = editor;
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {

            // tslint:disable-next-line:new-parens
            return new class extends controls.viewers.ArrayTreeContentProvider {

                getRoots(input: UserComponentsModel) {

                    return input.getComponents();
                }
            };
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new controls.viewers.LabelProvider((obj: UserComponent) => obj.getName());
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new controls.viewers.EmptyCellRendererProvider(
                obj => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT))
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

            viewer.setSelection(selection, false);
            viewer.reveal(...selection);
            viewer.repaint();
        }
    }
}