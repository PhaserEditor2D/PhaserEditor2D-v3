/// <reference path="./ViewPart.ts" />

namespace colibri.ui.ide {

    export abstract class ViewerFileEditor extends FileEditor {
        
        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer : controls.viewers.TreeViewer;

        constructor(id : string) {
            super(id)
        }

        protected abstract  createViewer() : controls.viewers.TreeViewer;

        protected createPart() : void {

            this._viewer = this.createViewer();

            this.addClass("ViewerPart");

            this._filteredViewer = new controls.viewers.FilteredViewer(this._viewer);
            this.add(this._filteredViewer);

            this._viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, (e: CustomEvent) => {
                this.setSelection(e.detail);
            });
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