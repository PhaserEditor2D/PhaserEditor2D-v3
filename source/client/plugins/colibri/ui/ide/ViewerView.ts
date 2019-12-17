/// <reference path="./ViewPart.ts" />

namespace colibri.ui.ide {

    export abstract class ViewerView extends ViewPart {

        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer: controls.viewers.TreeViewer;

        constructor(id: string) {
            super(id)
        }

        protected abstract createViewer(): controls.viewers.TreeViewer;

        protected createPart(): void {

            this._viewer = this.createViewer();

            this.addClass("ViewerPart");

            this._filteredViewer = new controls.viewers.FilteredViewer(this._viewer);
            this.add(this._filteredViewer);

            this._viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, (e: CustomEvent) => {
                this.setSelection(e.detail);
            });

            this._viewer.getElement().addEventListener("contextmenu", e => this.onMenu(e));
        }

        protected fillContextMenu(menu: controls.Menu) {

        }

        private onMenu(e: MouseEvent) {

            e.preventDefault();

            this._viewer.onMouseUp(e);

            const menu = new controls.Menu();

            this._viewer.setMenu(menu);

            this.fillContextMenu(menu);

            menu.create(e);
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