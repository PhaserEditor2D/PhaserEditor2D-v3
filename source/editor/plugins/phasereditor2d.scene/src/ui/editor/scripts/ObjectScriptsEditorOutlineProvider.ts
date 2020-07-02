namespace phasereditor2d.scene.ui.editor.scripts {

    import controls = colibri.ui.controls;

    export class ObjectScriptsEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: ObjectScriptEditor;

        constructor(editor: ObjectScriptEditor) {
            super();

            this._editor = editor;
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {

            return new controls.viewers.ArrayTreeContentProvider();
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new controls.viewers.LabelProvider((obj: ObjectScript) => obj.getName());
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new controls.viewers.EmptyCellRendererProvider(
                obj => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_OBJECT_SCRIPT))
            );
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer {

            return new controls.viewers.TreeViewerRenderer(viewer);
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {

            return this._editor.getPropertyProvider();
        }

        getInput() {

            return this._editor.getViewer().getInput();
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