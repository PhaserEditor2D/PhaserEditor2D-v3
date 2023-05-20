namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectListItemCellRenderer implements controls.viewers.ICellRenderer {

        private _objRenderer: controls.viewers.ICellRenderer;

        constructor(objRenderer: controls.viewers.ICellRenderer) {

            this._objRenderer = objRenderer;
        }

        private adaptArgs(args: controls.viewers.RenderCellArgs) {

            const args2 = args.clone();

            args2.obj = (args2.obj as ObjectListItem).getObject();

            return args2;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            this._objRenderer.renderCell(this.adaptArgs(args));
        }
        
        cellHeight(args: controls.viewers.RenderCellArgs) {
        
            return this._objRenderer.cellHeight(this.adaptArgs(args));
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            
            const clone = args.clone();
            
            clone.obj = (clone.obj as ObjectListItem).getObject();

            return this._objRenderer.preload(clone);
        }
        
        get layout() {

            return this._objRenderer.layout;
        }
    }
}