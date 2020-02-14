namespace phasereditor2d.pack.ui.dialogs {

    import controls = colibri.ui.controls;

    export class AssetSelectionDialog extends controls.dialogs.ViewerDialog {

        private _selectionCallback: (selection: any[]) => void;
        private _cancelCallback: () => void;

        constructor() {
            super(new controls.viewers.TreeViewer());

            const size = this.getSize();

            this.setSize(size.width, size.height * 1.5);
        }

        setSelectionCallback(callback: (selection: any[]) => void) {
            this._selectionCallback = callback;
        }

        setCancelCallback(callback: () => void) {
            this._cancelCallback = callback;
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new controls.viewers.ShadowGridTreeViewerRenderer(viewer, false, true));
            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellSize(64);
            viewer.setInput([]);

            super.create();

            this.setTitle("Select Asset");

            this.enableButtonOnlyWhenOneElementIsSelected(

                this.addOpenButton("Select", sel => {

                    if (this._selectionCallback) {

                        this._selectionCallback(sel);
                    }
                }));

            this.addButton("Cancel", () => {

                this.close();

                if (this._cancelCallback) {

                    this._cancelCallback();
                }
            });
        }
    }
}