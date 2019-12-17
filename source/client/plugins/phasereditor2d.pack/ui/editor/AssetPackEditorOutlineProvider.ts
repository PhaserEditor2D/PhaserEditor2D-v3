namespace phasereditor2d.pack.ui.editor {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export class AssetPackEditorOutlineProvider extends ide.EditorViewerProvider {

        private _editor: AssetPackEditor;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
        }

        getUndoManager() {
            return this._editor.getUndoManager();
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {
            return new AssetPackEditorOutlineContentProvider(this._editor);
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {
            return this._editor.getViewer().getLabelProvider();
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {
            return new viewers.AssetPackCellRendererProvider("tree");
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

        preload(): Promise<void> {
            return Promise.resolve();
        }

        onViewerSelectionChanged(selection : any[]) {
            
            const viewer= this._editor.getViewer();

            viewer.setSelection(selection, false);
            viewer.reveal(...selection);
            viewer.repaint();
        }
    }

}