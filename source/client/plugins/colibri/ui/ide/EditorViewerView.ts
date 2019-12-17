/// <reference path="./ViewerView.ts" />

namespace colibri.ui.ide {

    import viewers = controls.viewers;

    export abstract class EditorViewerView extends ide.ViewerView {

        private _currentEditor: EditorPart;
        private _currentViewerProvider: EditorViewerProvider;
        private _viewerStateMap: Map<EditorPart, viewers.ViewerState>;

        constructor(id: string) {
            super(id);

            this._viewerStateMap = new Map();
        }

        protected createViewer(): viewers.TreeViewer {

            const viewer = new viewers.TreeViewer()

            viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                if (this._currentViewerProvider) {
                    this._currentViewerProvider.onViewerSelectionChanged(this._viewer.getSelection());
                }
            })

            return viewer;
        }

        protected createPart(): void {

            super.createPart();

            Workbench.getWorkbench().addEventListener(EVENT_EDITOR_ACTIVATED, e => this.onWorkbenchEditorActivated());
        }

        abstract getViewerProvider(editor: EditorPart): EditorViewerProvider;

        private async onWorkbenchEditorActivated() {

            if (this._currentEditor !== null) {

                const state = this._viewer.getState();
                this._viewerStateMap.set(this._currentEditor, state);
            }

            const editor = Workbench.getWorkbench().getActiveEditor();

            let provider: EditorViewerProvider = null;

            if (editor) {

                if (editor === this._currentEditor) {
                    provider = this._currentViewerProvider;
                } else {
                    provider = this.getViewerProvider(editor);
                }
            }

            if (provider) {

                await provider.preload();

                this._viewer.setTreeRenderer(provider.getTreeViewerRenderer(this._viewer));
                this._viewer.setLabelProvider(provider.getLabelProvider());
                this._viewer.setCellRendererProvider(provider.getCellRendererProvider());
                this._viewer.setContentProvider(provider.getContentProvider());
                this._viewer.setInput(provider.getInput());

                provider.setViewer(this._viewer);

                const state = this._viewerStateMap.get(editor);

                if (state) {

                    provider.prepareViewerState(state);
                    
                    this._viewer.setState(state);
                }

            } else {

                this._viewer.setInput(null);
                this._viewer.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
            }

            this._currentViewerProvider = provider;
            this._currentEditor = editor;

            this._viewer.repaint();
        }

        getPropertyProvider() {

            if (this._currentViewerProvider) {
                return this._currentViewerProvider.getPropertySectionProvider();
            }

            return null;
        }

        getUndoManager() {

            if (this._currentViewerProvider) {
                return this._currentViewerProvider.getUndoManager();
            }

            return super.getUndoManager();
        }
    }
}