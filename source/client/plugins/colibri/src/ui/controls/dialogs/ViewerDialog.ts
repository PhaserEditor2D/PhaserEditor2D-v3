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

        goFront() {

            this.resize();

            if (this._viewer) {
                this._viewer.repaint();
            }
        }

        enableButtonOnlyWhenOneElementIsSelected(btn: HTMLButtonElement) {

            this.getViewer().addEventListener(EVENT_SELECTION_CHANGED, e => {

                btn.disabled = this.getViewer().getSelection().length !== 1;
            });

            btn.disabled = this.getViewer().getSelection().length !== 1;
        }

        addOpenButton(text: string, callback: (selection: any[]) => void) {

            const callback2 = () => {

                callback(this.getViewer().getSelection());

                this.close();
            };

            this.getViewer().addEventListener(controls.viewers.EVENT_OPEN_ITEM, callback2);

            return this.addButton(text, callback2);
        }
    }
}