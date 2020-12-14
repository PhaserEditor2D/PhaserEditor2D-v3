namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectCellRenderer implements controls.viewers.ICellRenderer {

        private _maxWidth: number;
        private _maxHeight: number;

        constructor(maxWidth = 1024, maxHeight = 1024) {

            this._maxWidth = maxWidth;
            this._maxHeight = maxHeight;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const obj = args.obj as Image;

            const cache = obj.getEditorSupport().getScene().getEditor().getCellRendererCache();

            // const cached = obj.getData("__renderer_image") as controls.IImage;

            const cached = cache.getImage(obj);

            if (cached) {

                cached.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
            }
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const obj = args.obj as Image;

            if (!obj.scene) {

                return controls.PreloadResult.NOTHING_LOADED;
            }

            const cache = obj.getEditorSupport().getScene().getEditor().getCellRendererCache();

            return cache.preloadImage(obj);
        }
    }
}