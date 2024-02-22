namespace colibri.ui.ide {

    import viewers = controls.viewers;

    export abstract class EditorViewerProvider {

        private _viewer: controls.viewers.TreeViewer;
        private _initialSelection: any[];
        private _selectedTabSection: string;

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

                if (reveal) {

                    this._viewer.reveal(...selection);
                }

            } else {

                this._initialSelection = selection;
            }
        }

        getSelection() {

            return this._viewer.getSelection();
        }

        onViewerSelectionChanged(selection: any[]) {
            // nothing
        }

        onViewerDoubleClick(selection: any[]) {
            // nothing
        }

        repaint(resetScroll = false) {

            if (this._viewer) {

                const state = this._viewer.getState();

                this.prepareViewerState(state);

                this._viewer.setState(state);

                if (resetScroll) {

                    this._viewer.setScrollY(0);

                } else {

                    this._viewer.repaint();
                }
            }
        }

        prepareViewerState(state: viewers.ViewerState) {
            // nothing
        }

        abstract getContentProvider(): viewers.ITreeContentProvider;

        abstract getLabelProvider(): viewers.ILabelProvider;

        getStyledLabelProvider(): viewers.IStyledLabelProvider {

            return undefined;
        }

        abstract getCellRendererProvider(): viewers.ICellRendererProvider;

        abstract getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): viewers.TreeViewerRenderer;

        abstract getPropertySectionProvider(): controls.properties.PropertySectionProvider;

        abstract getInput(): any;

        abstract preload(complete?: boolean): Promise<void>;

        abstract getUndoManager(): colibri.ui.ide.undo.UndoManager;

        getTabSections() {

            return [];
        }

        tabSectionChanged(section: string) {

            this._selectedTabSection = section;

            this.repaint(true);
        }

        getSelectedTabSection() {

            return this._selectedTabSection;
        }

        allowsTabSections() {

            return false;
        }

        fillContextMenu(menu: controls.Menu) {
            // nothing
        }
    }
}