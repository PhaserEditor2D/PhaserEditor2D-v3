namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SceneEditorOutlineProvider extends ide.EditorViewerProvider {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super();
            this._editor = editor;
        }

        getUndoManager() {
            return this._editor.getUndoManager();
        }

        getContentProvider(): controls.viewers.ITreeContentProvider {
            return new SceneEditorOutlineContentProvider();
        }

        getLabelProvider(): controls.viewers.ILabelProvider {
            return new SceneEditorOutlineLabelProvider();
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {
            return new SceneEditorOutlineRendererProvider(this._editor);
        }

        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer {
            return new controls.viewers.TreeViewerRenderer(viewer, 48);
        }

        getPropertySectionProvider(): controls.properties.PropertySectionProvider {
            return this._editor.getPropertyProvider();
        }

        getInput() {
            return this._editor;
        }

        preload(): Promise<void> {
            return;
        }

        onViewerSelectionChanged(selection: any[]) {
            this._editor.setSelection(selection, false);
            this._editor.repaint();
        }
    }

}