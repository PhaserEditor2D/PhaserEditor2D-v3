namespace phasereditor2d.code.ui.editors.outline {

    import controls = colibri.ui.controls;

    export class MonacoEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {

        private _editor: MonacoEditor;
        private _items: any[];
        private _itemsMap: Map<string, any>;

        constructor(editor: MonacoEditor) {
            super();

            this._editor = editor;
            this._items = [];
            this._itemsMap = new Map();
        }

        setViewer(viewer: controls.viewers.TreeViewer) {

            viewer.eventOpenItem.addListener(() => {

                const obj = viewer.getSelectionFirstElement();

                if (Array.isArray(obj.spans)) {

                    const span = obj.spans[0];

                    const editor = this._editor.getMonacoEditor();
                    const model = this._editor.getMonacoEditor().getModel();

                    const pos = model.getPositionAt(span.start);
                    const end = model.getPositionAt(span.start + span.length);

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

        prepareViewerState(state: controls.viewers.ViewerState) {

            state.selectedObjects = new Set(
                [...state.selectedObjects]
                    .map(obj => this._itemsMap.get(obj.id) || obj));

            state.expandedObjects = new Set(
                [...state.expandedObjects]
                    .map(obj => this._itemsMap.get(obj.id) || obj));
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

        revealOffset(offset: number) {

            const item = this.findItemAtOffset(this._items, offset);

            if (item) {

                this.setSelection([item], true, false);
            }
        }

        private findItemAtOffset(items: any[], offset: number) {

            for (const item of items) {

                if (Array.isArray(item.childItems)) {

                    const found = this.findItemAtOffset(item.childItems, offset);

                    if (found) {

                        return found;
                    }
                }

                const span = item.spans[0];

                if (offset >= span.start && offset <= span.start + span.length) {

                    return item;
                }
            }

            return null;
        }

        async refresh() {

            this._items = await this._editor.requestOutlineItems();

            this._itemsMap = new Map();

            this.buildItemsMap(this._items, "");

            this.repaint();
        }

        private buildItemsMap(items: any[], prefix: string) {

            for (const item of items) {

                item.id = prefix + "#" + item.text + "#" + item.kind;

                this._itemsMap.set(item.id, item);

                if (Array.isArray(item.childItems)) {

                    this.buildItemsMap(item.childItems, item.id);

                    item.childItems.sort((a, b) => {

                        return a.spans[0].start - b.spans[0].start;
                    });
                }
            }
        }

        getUndoManager() {
            return this._editor.getUndoManager();
        }
    }
}