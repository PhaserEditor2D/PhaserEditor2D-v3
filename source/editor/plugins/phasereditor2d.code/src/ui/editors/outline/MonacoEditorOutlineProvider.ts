namespace phasereditor2d.code.ui.editors.outline {

    import controls = colibri.ui.controls;

    export class MonacoEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: MonacoEditor;
        private _items: any[];

        constructor(editor: MonacoEditor) {
            super();

            this._editor = editor;
            this._items = [];
        }

        getContentProvider(): controls.viewers.ITreeContentProvider {

            return new MonacoOutlineContentProvider(this);
        }

        getLabelProvider(): controls.viewers.ILabelProvider {

            // tslint:disable-next-line:new-parens
            return new class implements controls.viewers.ILabelProvider {

                getLabel(obj) {
                    return obj.text;
                }
            };
        }

        getCellRendererProvider(): controls.viewers.ICellRendererProvider {

            return new MonacoOutlineCellRendererProvider();
        }

        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer {

            return new controls.viewers.TreeViewerRenderer(viewer);
        }

        getPropertySectionProvider(): controls.properties.PropertySectionProvider {

            return null;
        }

        getInput() {
            return this._editor.getInput();
        }

        getItems() {
            return this._items;
        }

        async preload(): Promise<void> {

            // nothing for now
        }

        async refresh() {

            this._items = await this._editor.requestOutlineItems();

            this.repaint();
        }

        getUndoManager() {
            return this._editor.getUndoManager();
        }
    }
}