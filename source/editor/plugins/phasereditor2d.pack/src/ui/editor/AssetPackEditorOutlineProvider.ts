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

        getContentProvider(): controls.viewers.ITreeContentProvider {

            return new AssetPackEditorOutlineContentProvider(this._editor);
        }

        getLabelProvider(): controls.viewers.ILabelProvider {

            return this._editor.getViewer().getLabelProvider();
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {

            return new viewers.AssetPackCellRendererProvider("tree");
        }

        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer {

            return new controls.viewers.TreeViewerRenderer(viewer, 64);
        }

        getPropertySectionProvider(): controls.properties.PropertySectionProvider {

            return this._editor.getPropertyProvider();
        }

        getInput() {

            return this._editor.getViewer().getInput();
        }

        preload(): Promise<void> {
            
            return Promise.resolve();
        }

        onViewerSelectionChanged(selection: any[]) {

            const viewer = this._editor.getViewer();

            viewer.setSelection(selection, false);
            viewer.reveal(...selection);
            viewer.repaint();
        }
    }

}