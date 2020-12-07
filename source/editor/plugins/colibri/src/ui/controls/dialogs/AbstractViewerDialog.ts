/// <reference path="./Dialog.ts" />

namespace colibri.ui.controls.dialogs {

    export abstract class AbstractViewerDialog extends Dialog {

        private _viewer: viewers.TreeViewer;
        private _filteredViewer: viewers.FilteredViewer<viewers.TreeViewer>;
        protected _showZoomControls: boolean;

        constructor(viewer: viewers.TreeViewer, showZoomControls: boolean) {
            super("AbstractViewerDialog");

            this._viewer = viewer;
            this._showZoomControls = showZoomControls;
        }

        protected createFilteredViewer() {

            this._filteredViewer = this.newFilteredViewer();
        }

        protected newFilteredViewer() {

            return new viewers.FilteredViewer(this._viewer, this._showZoomControls);
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

        enableButtonOnlyWhenOneElementIsSelected(btn: HTMLButtonElement, filter?: (obj: any) => boolean) {

            this.getViewer().eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length !== 1;

                if (!btn.disabled && filter) {

                    btn.disabled = !filter(this.getViewer().getSelectionFirstElement());
                }
            });

            btn.disabled = this.getViewer().getSelection().length !== 1;

            return btn;
        }

        addOpenButton(text: string, callback: (selection: any[]) => void, allowSelectEmpty = false) {

            const callback2 = () => {

                callback(this.getViewer().getSelection());

                this.close();
            };

            this.getViewer().eventOpenItem.addListener(callback2);

            const btn = this.addButton(text, callback2);

            if (!allowSelectEmpty) {

                this.getViewer().eventSelectionChanged.addListener(() => {

                    btn.disabled = this.getViewer().getSelection().length === 0;
                });

                btn.disabled = true;
            }

            const inputElement = this.getFilteredViewer().getFilterControl().getElement();

            const listener = e => {

                if (e.key === "Enter") {

                    e.preventDefault();

                    const sel = this.getViewer().getSelection();

                    if (sel.length === 0) {

                        if (!allowSelectEmpty) {

                            const elements = this.getViewer().getVisibleElements();

                            if (elements.length === 1) {

                                this.getViewer().setSelection(elements);

                                btn.click();
                            }
                        }
                    } else {

                        btn.click();
                    }
                }
            };

            inputElement.addEventListener("keyup", listener);
            this.getViewer().getElement().addEventListener("keyup", listener);

            return btn;
        }
    }
}