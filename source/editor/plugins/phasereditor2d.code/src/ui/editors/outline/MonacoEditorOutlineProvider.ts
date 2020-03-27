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

        setViewer(viewer: controls.viewers.TreeViewer) {

            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => {

                const obj = viewer.getSelectionFirstElement();

                if (Array.isArray(obj.spans)) {

                    const span = obj.spans[0];

                    const editor = this._editor.getMonacoEditor();

                    const pos = editor.getModel().getPositionAt(span.start);
                    const end = editor.getModel().getPositionAt(span.start + span.length);

                    editor.setPosition(pos);
                    editor.revealPosition(pos, monaco.editor.ScrollType.Immediate);

                    const range: monaco.IRange = {
                        endColumn: end.column,
                        endLineNumber: end.lineNumber,
                        startColumn: pos.column,
                        startLineNumber: pos.lineNumber,
                    };

                    editor.setSelection(range);
                    editor.focus();
                }
            });

            super.setViewer(viewer);
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