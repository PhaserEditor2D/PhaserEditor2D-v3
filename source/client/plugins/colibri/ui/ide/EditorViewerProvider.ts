namespace colibri.ui.ide {

    import viewers = controls.viewers;

    export abstract class EditorViewerProvider {

        private _viewer: controls.viewers.TreeViewer;
        private _initialSelection: any[];

        constructor() {
            this._viewer = null;
            this._initialSelection = null;
        }

        setViewer(viewer: controls.viewers.TreeViewer) {

            this._viewer = viewer;

            if (this._initialSelection) {
                this.setSelection(this._initialSelection, true, true);
                this._initialSelection = null;
            }

        }

        setSelection(selection: any[], reveal: boolean, notify: boolean) {

            if (this._viewer) {

                this._viewer.setSelection(selection, notify);
                this._viewer.reveal(...selection);

            } else {
                this._initialSelection = selection;
            }

        }

        getSelection() {
            return this._viewer.getSelection();
        }

        onViewerSelectionChanged(selection: any[]) {

        }

        repaint() {
            
            if (this._viewer) {

                const state = this._viewer.getState();

                this.prepareViewerState(state);

                this._viewer.setState(state);

                this._viewer.repaint();
            }
        }

        prepareViewerState(state: viewers.ViewerState) {
            
        }

        abstract getContentProvider(): viewers.ITreeContentProvider;

        abstract getLabelProvider(): viewers.ILabelProvider;

        abstract getCellRendererProvider(): viewers.ICellRendererProvider;

        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): viewers.TreeViewerRenderer;

        abstract getPropertySectionProvider(): controls.properties.PropertySectionProvider;

        abstract getInput(): any;

        abstract preload(): Promise<void>;

        abstract getUndoManager();
    }
}