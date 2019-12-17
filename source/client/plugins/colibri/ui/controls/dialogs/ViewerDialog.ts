namespace colibri.ui.controls.dialogs {

    export class ViewerDialog extends Dialog {

        private _viewer: viewers.TreeViewer;
        private _filteredViewer: viewers.FilteredViewer<viewers.TreeViewer>;

        constructor(viewer: viewers.TreeViewer) {
            super("ViewerDialog");

            this._viewer = viewer;

        }

        createDialogArea() {

            this._filteredViewer = new viewers.FilteredViewer(this._viewer, "DialogClientArea");

            this.add(this._filteredViewer);

            this._filteredViewer.getFilterControl().getFilterElement().focus();
        }

        getViewer() {
            return this._viewer;
        }

    }

}