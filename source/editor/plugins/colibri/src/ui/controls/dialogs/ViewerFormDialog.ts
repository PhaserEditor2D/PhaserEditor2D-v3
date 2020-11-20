namespace colibri.ui.controls.dialogs {

    export class ViewerFormDialog extends AbstractViewerDialog {

        constructor(viewer: viewers.TreeViewer, showZoomControls: boolean) {
            super(viewer, showZoomControls);
        }

        protected createDialogArea() {

            const clientArea = document.createElement("div");
            clientArea.classList.add("DialogClientArea");

            clientArea.style.display = "grid";
            clientArea.style.gridTemplateRows = "1fr auto";
            clientArea.style.gridRowGap = "5px";

            this.createFilteredViewer();

            clientArea.appendChild(this.getFilteredViewer().getElement());

            const formArea = document.createElement("div");
            formArea.classList.add("DialogSection");
            formArea.style.display = "grid";
            formArea.style.gridTemplateColumns = "auto 1fr";
            formArea.style.gridTemplateRows = "auto";
            formArea.style.columnGap = "5px";
            formArea.style.rowGap = "10px";
            formArea.style.alignItems = "center";

            this.createFormArea(formArea);

            clientArea.appendChild(formArea);

            this.getElement().appendChild(clientArea);
        }

        newFilteredViewer() {

            return new viewers.FilteredViewerInElement(this.getViewer(), this._showZoomControls);
        }

        getFilteredViewer() {

            return super.getFilteredViewer() as viewers.FilteredViewerInElement<viewers.TreeViewer>;
        }

        layout() {

            super.layout();

            this.getFilteredViewer().resizeTo();
        }

        protected createFormArea(formArea: HTMLDivElement) {
            // nothing
        }
    }
}