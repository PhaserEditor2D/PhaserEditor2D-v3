/// <reference path="./ViewPart.ts" />

namespace colibri.ui.ide {

    export abstract class ViewerView extends ViewPart {

        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer: controls.viewers.TreeViewer;
        private _showZoomControls: boolean;

        constructor(id: string, showZoomControls: boolean = true) {
            super(id);

            this._showZoomControls = showZoomControls;
        }

        protected abstract createViewer(): controls.viewers.TreeViewer;

        protected createPart(): void {

            this._viewer = this.createViewer();

            this.addClass("ViewerPart");

            this._filteredViewer = new controls.viewers.FilteredViewer(this._viewer, this._showZoomControls);
            this.add(this._filteredViewer);

            this._viewer.eventSelectionChanged.addListener(sel => {

                this.setSelection(sel as any);
            });

            const view = this;

            // this._viewer.getElement().addEventListener("contextmenu", e => this.onMenu(e));
            this._filteredViewer.setMenuProvider(new (class implements controls.viewers.IViewerMenuProvider {

                fillMenu(viewer: controls.viewers.TreeViewer, menu: controls.Menu) {

                    view.fillContextMenu(menu);

                    const viewerMenu = new controls.Menu("Viewer");

                    new controls.viewers.DefaultViewerMenuProvider().fillMenu(viewer, viewerMenu);

                    menu.addSeparator();
                    menu.addMenu(viewerMenu);
                }
            })());
        }

        protected fillContextMenu(menu: controls.Menu) {
            // nothing
        }

        getViewer() {
            return this._viewer;
        }

        layout() {
            if (this._filteredViewer) {
                this._filteredViewer.layout();
            }
        }
    }
}