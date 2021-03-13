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

            this._filteredViewer.setMenuProvider(new controls.viewers.DefaultViewerMenuProvider((viewer, menu) => {

                this.fillContextMenu(menu);
            }));

            this._viewer.eventSelectionChanged.addListener(sel => {

                this.setSelection(sel as any);
            });
        }

        protected createFilteredViewer(viewer: controls.viewers.TreeViewer) {

            return new controls.viewers.FilteredViewer(viewer, true);
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