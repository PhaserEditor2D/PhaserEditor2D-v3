/// <reference path="./Dialog.ts" />

namespace colibri.ui.controls.dialogs {

    export abstract class AbstractViewerDialog extends Dialog {

        private _viewer: viewers.TreeViewer;
        private _filteredViewer: viewers.FilteredViewer<viewers.TreeViewer>;

        constructor(viewer: viewers.TreeViewer) {
            super("AbstractViewerDialog");

            this._viewer = viewer;
        }

        protected createFilteredViewer() {

            this._filteredViewer = this.newFilteredViewer();
        }

        protected newFilteredViewer() {

            return new viewers.FilteredViewer(this._viewer);
        }

        getViewer() {
            return this._viewer;
        }

        getFilteredViewer() {

            return this._filteredViewer;
        }

        goFront() {

            this.resize();

            if (this._viewer) {
                this._viewer.repaint();
            }
        }

        enableButtonOnlyWhenOneElementIsSelected(btn: HTMLButtonElement) {

            this.getViewer().eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length !== 1;
            });

            btn.disabled = this.getViewer().getSelection().length !== 1;
        }

        addOpenButton(text: string, callback: (selection: any[]) => void) {

            const callback2 = () => {

                callback(this.getViewer().getSelection());

                this.close();
            };

            this.getViewer().eventOpenItem.addListener(callback2);

            return this.addButton(text, callback2);
        }
    }
}