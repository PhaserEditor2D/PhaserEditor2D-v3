namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;

    class Provider implements controls.viewers.ICellRendererProvider {

        constructor(private _renderer: controls.viewers.ICellRenderer) {
        }

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            return this._renderer;
        }

        preload(element: any): Promise<controls.PreloadResult> {
            
            return controls.Controls.resolveNothingLoaded();
        }
    }

    export class SimpleContentTypeCellRendererExtension extends ContentTypeCellRendererExtension {

        private _contentType: string;
        private _cellRenderer: controls.viewers.ICellRenderer;

        constructor(contentType: string, cellRenderer: controls.viewers.ICellRenderer) {
            super();

            this._contentType = contentType;
            this._cellRenderer = cellRenderer;
        }

        getRendererProvider(contentType: string): controls.viewers.ICellRendererProvider {

            if (contentType === this._contentType) {

                return new Provider(this._cellRenderer);
            }

            return null;
        }

    }
}