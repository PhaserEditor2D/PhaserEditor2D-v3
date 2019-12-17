namespace phasereditor2d.pack.ui.editor {

    import ide = colibri.ui.ide;

    export class AssetPackEditorBlocksProvider extends ide.EditorViewerProvider {

        private _editor: AssetPackEditor;
        private _contentProvider : AssetPackEditorBlocksContentProvider;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
            this._contentProvider = new AssetPackEditorBlocksContentProvider(this._editor);
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {
            return this._contentProvider;
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {
            return new files.ui.viewers.FileLabelProvider();
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {
            return new files.ui.viewers.FileCellRendererProvider("grid");
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer {
            return new AssetPackEditorTreeViewerRenderer(this._editor, viewer);
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {
            return new AssetPackEditorBlocksPropertySectionProvider();
        }

        getUndoManager() {
            return this._editor.getUndoManager();
        }

        getInput() {
            return this._editor.getInput().getParent().getFiles();
        }

        async updateBlocks_async() {
            
            await this._contentProvider.updateIgnoreFileSet_async();

            const sel = this.getSelection().filter(obj => !this._contentProvider.getIgnoreFileSet().has(obj));

            this.setSelection(sel, false, true);

            this.repaint();
        }

        preload(): Promise<void> {
            return Promise.resolve();
        }

    }
}