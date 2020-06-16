namespace colibri.ui.controls.viewers {

    class FilterControl extends Control {
        private _filterElement: HTMLInputElement;

        constructor() {
            super("div", "FilterControl");
            this.setLayoutChildren(false);

            this._filterElement = document.createElement("input");
            this.getElement().appendChild(this._filterElement);
        }

        getFilterElement() {
            return this._filterElement;
        }

    }

    export class ViewerContainer extends controls.Control {
        private _viewer: Viewer;

        constructor(viewer: Viewer) {
            super("div", "ViewerContainer");

            this._viewer = viewer;

            this.add(viewer);

            setTimeout(() => this.layout(), 1);
        }

        getViewer() {
            return this._viewer;
        }

        layout() {
            const b = this.getElement().getBoundingClientRect();
            this._viewer.setBoundsValues(b.left, b.top, b.width, b.height);
        }
    }

    export class FilteredViewer<T extends Viewer> extends Control {

        private _viewer: T;
        private _viewerContainer: ViewerContainer;
        private _filterControl: FilterControl;
        private _scrollPane: ScrollPane;

        constructor(viewer: T, ...classList: string[]) {
            super("div", "FilteredViewer", ...classList);
            this._viewer = viewer;

            this._filterControl = new FilterControl();
            this.add(this._filterControl);

            this._viewerContainer = new ViewerContainer(this._viewer);
            this._scrollPane = new ScrollPane(this._viewerContainer);
            this.add(this._scrollPane);

            this.setLayoutChildren(false);

            this.registerListeners();
        }

        private registerListeners() {

            this._filterControl.getFilterElement().addEventListener("input", e => this.onFilterInput(e));

            this._filterControl.getFilterElement().addEventListener("keyup", e => {

                if (e.key === "ArrowDown") {

                    e.preventDefault();

                    const viewer = this.getViewer() as any as viewers.TreeViewer;

                    viewer.getElement().focus();

                    const sel = viewer.getSelection();

                    const selVisible = viewer.getVisibleElements().filter(elem => sel.indexOf(elem)> 0).length > 0;

                    if (!selVisible) {

                        const obj = viewer.getFirstVisibleElement();

                        if (obj) {

                            viewer.setSelection([obj]);
                        }
                    }

                    viewer.reveal(viewer.getSelection());
                }
            });

            this.getViewer().getElement().addEventListener("keyup", e => {

                if (e.key === "ArrowUp") {

                    if (this.getViewer().getSelection().length === 1) {

                        const elem = this.getViewer().getSelectionFirstElement();

                        const visibleElem = (this.getViewer() as any as viewers.TreeViewer).getFirstVisibleElement();

                        if (visibleElem === elem) {

                            this._filterControl.getFilterElement().focus();
                        }
                    }
                }
            });
        }

        private onFilterInput(e?: Event) {

            const value = this._filterControl.getFilterElement().value;

            this._viewer.setFilterText(value);

            this._viewer.repaint();
        }

        filterText(value: string) {

            this._filterControl.getFilterElement().value = value;

            this.onFilterInput();
        }

        getViewer() {
            return this._viewer;
        }

        layout() {
            this._viewerContainer.layout();
            this._scrollPane.layout();
        }

        getFilterControl() {
            return this._filterControl;
        }
    }
}