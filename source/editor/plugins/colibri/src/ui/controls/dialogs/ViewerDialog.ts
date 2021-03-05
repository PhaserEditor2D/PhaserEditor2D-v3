/// <reference path="./AbstractViewerDialog.ts" />

namespace colibri.ui.controls.dialogs {

    export class ViewerDialog extends AbstractViewerDialog {

        constructor(viewer: viewers.TreeViewer, showZoomControls: boolean) {
            super(viewer, showZoomControls);
        }

        createDialogArea() {

            this.createFilteredViewer();

            this.getFilteredViewer().addClass("DialogClientArea");

            this.add(this.getFilteredViewer());

            this.getFilteredViewer().getFilterControl().getFilterElement().focus();

            this.getFilteredViewer().setMenuProvider(new controls.viewers.DefaultViewerMenuProvider((viewer, menu) => {

                this.fillContextMenu(menu);
            }));
        }

        protected fillContextMenu(menu: controls.Menu): void {
            // nothing
        }
    }
}