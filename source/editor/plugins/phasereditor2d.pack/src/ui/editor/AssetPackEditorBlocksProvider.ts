namespace phasereditor2d.pack.ui.editor {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export class AssetPackEditorBlocksProvider extends ide.EditorViewerProvider {

        private _editor: AssetPackEditor;
        private _contentProvider: AssetPackEditorBlocksContentProvider;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
            this._contentProvider = new AssetPackEditorBlocksContentProvider(this._editor);
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {

            return this._contentProvider;
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new LabelProvider();
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new files.ui.viewers.FileCellRendererProvider("grid");
        }

        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): controls.viewers.GridTreeViewerRenderer {

            // return new AssetPackEditorTreeViewerRenderer(this._editor, viewer);

            const provider = new controls.viewers.GridTreeViewerRenderer(viewer);

            provider.setPaintItemShadow(true);

            provider.setSectionCriteria(obj => obj instanceof colibri.core.io.FilePath && obj.isFolder());

            return provider;
        }

        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider {

            return new AssetPackEditorBlocksPropertySectionProvider();
        }

        getUndoManager() {

            return this._editor.getUndoManager();
        }

        getInput() {

            return this._editor.getInput().getParent();
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

    class LabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: colibri.core.io.FilePath): string {

            if (obj.isFolder()) {

                if (obj.isRoot()) {

                    return "/";
                }

                return obj.getProjectRelativeName().substring(1);
            }

            return obj.getName();
        }
    }
}