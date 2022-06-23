namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectCellRenderer implements controls.viewers.ICellRenderer {

        constructor() {

        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const obj = args.obj as Image;

            const cache = obj.getEditorSupport().getScene().getEditor().getCellRendererCache();

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