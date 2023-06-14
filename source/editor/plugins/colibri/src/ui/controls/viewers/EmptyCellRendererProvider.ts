namespace colibri.ui.controls.viewers {

    export class EmptyCellRendererProvider implements ICellRendererProvider {

        private _getRenderer: (element: any) => ICellRenderer;

        static withIcon(icon: IImage) {

            return new EmptyCellRendererProvider(() => new IconImageCellRenderer(icon));
        }

        constructor(getRenderer?: (element: any) => ICellRenderer) {
            
            this._getRenderer = getRenderer ?? ((e) => new EmptyCellRenderer());
        }

        getCellRenderer(element: any): ICellRenderer {
            return this._getRenderer(element);
        }

        preload(obj: any): Promise<PreloadResult> {
            
            return Controls.resolveNothingLoaded();
        }
    }
}