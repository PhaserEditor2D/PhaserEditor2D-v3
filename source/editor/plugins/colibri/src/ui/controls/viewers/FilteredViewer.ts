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
        private _zoomControl: ZoomControl;
        private _filteredViewer: FilteredViewer<any>;
        private _mouseOverZoomControl: boolean;

        constructor(filteredViewer: FilteredViewer<any>, zoom = true) {
            super("div", "ViewerContainer");

            this._viewer = filteredViewer.getViewer();
            this._filteredViewer = filteredViewer;

            this.add(this._viewer);

            if (zoom) {

                this.addZoomControl();
            }

            //setTimeout(() => this.layout(), 1);
            requestAnimationFrame(() => this.layout());
        }

        private addZoomControl() {

            this._zoomControl = new ZoomControl({
                showReset: false
            });

            this.getElement().appendChild(this._zoomControl.getElement());

            this._zoomControl.setCallback(z => {

                const viewer = this.getViewer();

                viewer.setCellSize(viewer.getCellSize() + ICON_SIZE * z);
                viewer.saveCellSize();

                viewer.repaint();
            });

            this._zoomControl.getElement().addEventListener("mouseenter", e => {

                this._mouseOverZoomControl = true;
            });

            this._zoomControl.getElement().addEventListener("mouseleave", e => {

                this._mouseOverZoomControl = false;

                this.layoutZoomControl();
            });
        }

        getViewer() {

            return this._viewer;
        }

        layout() {

            const b = this.getElement().getBoundingClientRect();

            this._viewer.setBoundsValues(b.left, b.top, b.width, b.height);

            this.layoutZoomControl();
        }

        private layoutZoomControl() {

            if (this._zoomControl) {

                if (!this._mouseOverZoomControl) {

                    if (this._filteredViewer.getScrollPane().containsClass("hideScrollBar")) {

                        this._zoomControl.getElement().style.right = "5px";

                    } else {

                        this._zoomControl.getElement().style.right = "20px";
                    }
                }
            }
        }
    }

    export class FilteredViewer<T extends Viewer> extends Control {

        private _viewer: T;
        private _viewerContainer: ViewerContainer;
        private _filterControl: FilterControl;
        private _scrollPane: ScrollPane;

        constructor(viewer: T, showZoomControls: boolean, ...classList: string[]) {
            super("div", "FilteredViewer", ...classList);

            this._viewer = viewer;

            this._filterControl = new FilterControl();
            this.add(this._filterControl);

            this._viewerContainer = new ViewerContainer(this, showZoomControls);
            this._scrollPane = new ScrollPane(this._viewerContainer);
            this.add(this._scrollPane);

            this.setLayoutChildren(false);

            this.registerListeners();

            requestAnimationFrame(() => this._scrollPane.layout());
        }

        getScrollPane() {

            return this._scrollPane;
        }

        private registerListeners() {

            this._filterControl.getFilterElement().addEventListener("input", e => this.onFilterInput(e));

            this._filterControl.getFilterElement().addEventListener("keyup", e => {

                if (e.key === "ArrowDown") {

                    e.preventDefault();

                    const viewer = this.getViewer() as any as viewers.TreeViewer;

                    viewer.getElement().focus();

                    const sel = viewer.getSelection();

                    const selVisible = viewer.getVisibleElements().filter(elem => sel.indexOf(elem) > 0).length > 0;

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