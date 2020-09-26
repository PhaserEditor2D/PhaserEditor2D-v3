/// <reference path="./ViewPart.ts" />

namespace colibri.ui.ide {

    export abstract class ViewerFileEditor extends FileEditor {

        protected _filteredViewer: controls.viewers.FilteredViewer<any>;
        protected _viewer: controls.viewers.TreeViewer;

        constructor(id: string, editorFactory: EditorFactory) {
            super(id, editorFactory);
        }

        protected abstract createViewer(): controls.viewers.TreeViewer;

        protected createPart(): void {

            this._viewer = this.createViewer();

            this.addClass("ViewerPart");

            this._filteredViewer = this.createFilteredViewer(this._viewer);
            this.add(this._filteredViewer);

            this._viewer.eventSelectionChanged.addListener(sel => {

                this.setSelection(sel as any);
            });

            this._viewer.getElement().addEventListener("contextmenu", e => this.onMenu(e));
        }

        protected createFilteredViewer(viewer: controls.viewers.TreeViewer) {

            return new controls.viewers.FilteredViewer(viewer, true);
        }

        private onMenu(e: MouseEvent) {

            e.preventDefault();

            this._viewer.onMouseUp(e);

            const menu = new controls.Menu();

            this.fillContextMenu(menu);

            menu.createWithEvent(e);
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